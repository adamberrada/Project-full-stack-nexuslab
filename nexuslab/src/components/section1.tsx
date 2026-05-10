import { useEffect, useMemo, useRef, useState } from 'react'


// import chaineRest from "../image/chaine rest.png";
// import { useMousePositionEffect } from '../mouseHover';
// import brown from '../V/megaV1.mp4';
// import blue from '../V/megaV2.mp4';
// import fire from '../V/megaV3.mp4';
// styles
import '../styles_module/section1.css';
// import {WaterDropGrid} from '../components/anime'
// import { WaterDrop } from '../components/water';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// import chaine1 from '../image/chaine2.png'
// import chaine2 from '../image/chaine2.png'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import spin from '../V/spin.webm';
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import slide1 from '../new beta images/1.webp';
import slide2 from '../new beta images/2.webp';
import slide3 from '../new beta images/3.webp';
import { RatingStars } from './RatingStars';
import { useNavigate } from "react-router-dom";


const sliderImages = [
  { url: slide3 },
  { url: slide2 },
  { url: slide1 },
];

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  price: number | string;
  imageUrl?: string | null;
  category?: Category | null;
};

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { headers: { 'Content-Type': 'application/json' } });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return (await response.json()) as T;
}

function formatMoney(value: number | string) {
  if (typeof value === 'number') return value.toFixed(2);
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric.toFixed(2);
  return String(value);
}


export function Section1() {
      const btnRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  // const { handleMouseMove } = useMousePositionEffect();
  // slideRef removed because SimpleImageSlider doesn't accept a ref prop in its props type

  const [products, setProducts] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState(0);
  const [cartMessage, setCartMessage] = useState('');


  useEffect(() => {
    AOS.init({
      duration: 2000,
      once: true,
    });
  },[]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const data = await fetchJson<Product[]>('/api/products');
        if (!alive) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        if (!alive) return;
        setProducts([]);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  const productSlides = useMemo(() => {
    if (products.length === 0) return sliderImages;
    return products.map((p) => ({
      url: p.imageUrl || 'https://via.placeholder.com/1400x700?text=Product',
    }));
  }, [products]);

  const activeProduct = products.length > 0 ? products[Math.min(activeIndex, products.length - 1)] : null;

  useEffect(() => {
    if (!activeProduct) {
      setAvgRating(null);
      setRatingCount(0);
      return;
    }

    let alive = true;
    const loadRating = async () => {
      try {
        const response = await fetch(`/api/reviews/product/${activeProduct.id}`);
        if (!response.ok) {
          if (!alive) return;
          setAvgRating(null);
          setRatingCount(0);
          return;
        }

        const data = (await response.json()) as Array<{ rating: number | string | null | undefined }>;
        if (!alive) return;

        const ratings = (Array.isArray(data) ? data : [])
          .map((r) => Number(r.rating))
          .filter((n) => Number.isFinite(n));

        if (ratings.length === 0) {
          setAvgRating(null);
          setRatingCount(0);
          return;
        }

        const sum = ratings.reduce((acc, v) => acc + v, 0);
        setAvgRating(sum / ratings.length);
        setRatingCount(ratings.length);
      } catch {
        if (!alive) return;
        setAvgRating(null);
        setRatingCount(0);
      }
    };

    loadRating();
    return () => {
      alive = false;
    };
  }, [activeProduct?.id]);

  const addToCart = async (productId: number) => {
    setCartMessage('');

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setCartMessage('Login first to add items to cart.');
      return;
    }

    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: Number(userId), productId, quantity: 1 }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      if (!response.ok) {
        setCartMessage(data?.message || `Failed to add to cart (${response.status})`);
        return;
      }

      setCartMessage('Added to cart. Open /cart to view.');
    } catch {
      setCartMessage('Cannot reach backend. Start Spring Boot on http://localhost:8080');
    }
  };


    return (
      // the first container will spillet the page into 50%
      <div className='section-container'>
        <div className='pxl-overlay--gradients1'></div>

        <div className="section1SliderWrap slider-zoom">
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            navigation
            pagination={{ clickable: true }}
            watchOverflow={false}
            loop={productSlides.length > 1}
            slidesPerView={1}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="section1Swiper"
          >
            {productSlides.map((slide, idx) => (
              <SwiperSlide key={slide.url ? `${slide.url}-${idx}` : idx}>
                <div className="section1SlideImage" style={{ backgroundImage: `url(\"${slide.url}\")` }} />
              </SwiperSlide>
            ))}
          </Swiper>

          {activeProduct ? (
            <div className="section1SliderOverlay">
              <div className="section1SliderMeta">
                <div className="section1SliderCategory tagS1">
                <div className='dot-tags1'></div>
                  {activeProduct.category?.name || 'Uncategorized'}</div>
                <div className="section1SliderRating">
                  <RatingStars value={avgRating ?? 0} />
                  <span className="section1SliderRatingText">
                    {avgRating === null ? 'No rating' : `${avgRating.toFixed(1)}/5`}
                    {ratingCount ? ` (${ratingCount})` : ''}
                  </span>
                </div>
              </div>

              <div className="section1SliderTitleRow">
                <div className="section1SliderTitle" data-aos="fade-left">{activeProduct.name}</div>
                {/* <div className="section1SliderPrice">${formatMoney(activeProduct.price)}</div> */}
              </div>
              
              <div className='section1SliderContentproduct' data-aos="fade-up">
                buy all the product you want here let the ride come to you enlish you true imagination and feel 
              </div>
              <div className='section1SliderPrice' data-aos="fade-up">
                  <div className='startPrice'>Starting at</div>
                  <div className='priceTags1'>
                  <div className='lablesPriceTag'>$</div>
                <div className="priceLable">{formatMoney(activeProduct.price)}</div>
                  <div className='lablesPriceTag'>/mountly</div>
                </div>
              </div>
          

              <button type="button" className="btn-epic"
              data-aos="fade-up"
              //  onClick={() => addToCart(activeProduct.id)}

               onClick={() => navigate('/catalog')}
               >
                <div>
                  <span>See more</span>
                  <span>See more</span>
                </div>
              </button>

              {cartMessage ? <div className="section1SliderMessage">{cartMessage}</div> : null}
            </div>
          ) : null}
        </div>












        {/* <div className='inside-section-container'> */}
              {/* first */}
              {/* <div className='S1_C1'  data-aos="fade-left">
                <div className='P1'>
                  <div className='S1_C1_CC'>
                    <h1 className='h1H'>SmartMatch Sport</h1>
                    <p>Application basée sur l'algorithme ELO + équilibrage intelligent pour des matches amateurs justes et compétitifs.</p>
                     <a style={{textDecoration: "none", color:"black"}} href='https://enactus-morocco.org/'>
                    <button
                        ref={btnRef}
                        className='btn-5' 
                        onMouseMove={handleMouseMove}
                      >
                      <Link className="linkForm" to="/Test"></Link>
                      <span 
                        className='buttom-span' >
                          Creer un match
                      </span>
                    </button>
                    <button
                        ref={btnRef}
                        className='btn-5' 
                        onMouseMove={handleMouseMove}
                      >
                      <Link className="linkForm" to="/Test"></Link>
                      <span 
                        className='buttom-span' >
                          explorer les matches
                      </span>
                    </button>
                    </a>
                  </div>
                </div>
              </div> */}
                      {/* <video   className='section1_video'
                        autoPlay
                        loop
                        muted
                        playsInline 
                        >
                          <source src={fire} type="video/mp4" />
                      </video> */}
              {/* second */}
              {/* <div className='S1_C2'> */}
                {/* <WaterDrop /> */}
                    {/* <div className="animation-scroll-chaine">
                <div className="inside-animation-scroll-item-chaine chaine1">
                        <img className='chaine' 
                        // src={chaine2}
                          alt=""></img>
                        <div className='chaineMiddle-start'></div>
                        <div className='chaineMiddle-end'></div>
                </div> 
                <div className="inside-animation-scroll-item-chaine chaine2">
                  <img className='chaine' 
                  // src={chaine2}
                    alt=""></img>
                        <div className='chaineMiddle-start'></div>
                        <div className='chaineMiddle-end'></div>

                </div>
                <div className="inside-animation-scroll-item-chaine chaine3">
                  <img className='chaine' 
                  // src={chaine2}
                    alt=""></img>
                  <div className='chaineMiddle-start'></div>
                        <div className='chaineMiddle-end'></div>

                </div>
                <div className="inside-animation-scroll-item-chaine chaine4">
                  <img className='chaine' 
                  // src={chaine2}
                    alt=""></img>
                  <div className='chaineMiddle-start'></div>
                        <div className='chaineMiddle-end'></div>

                </div>
                <div className="inside-animation-scroll-item-chaine chaine5">
                  <img className='chaine' 
                  // src={chaine2}
                    alt=""></img>
                  <div className='chaineMiddle-start'></div>
                        <div className='chaineMiddle-end'></div>

                </div>
                <div className="inside-animation-scroll-item-chaine chaine6">
                  <img className='chaine' 
                  // src={chaine2}
                    alt=""></img>
                  <div className='chaineMiddle-start'></div>
                        <div className='chaineMiddle-end'></div>

                </div>
                 <div className="inside-animation-scroll-item-chaine chaine7">
                  <img className='chaine' 
                  // src={chaine2}
                    alt=""></img>
                  <div className='chaineMiddle-start'></div>
                        <div className='chaineMiddle-end'></div>

                </div>
                 <div className="inside-animation-scroll-item-chaine chaine8">
                  <img className='chaine' 
                  // src={chaine2}
                    alt=""></img>
                  <div className='chaineMiddle-start'></div>
                        <div className='chaineMiddle-end'></div>

                </div>
              
            </div>
             <video className='webmVideo'
                        autoPlay
                        loop
                        muted
                        playsInline
              //  controls
                    >
                    <source src={spin} type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
              <div className="animation-scroll">
                <div className="inside-animation-scroll-item item1">
                  <img 
                  // src={Image}
                    width="340" height= "223" alt=""></img>
                </div> 
                <div className="inside-animation-scroll-item item2">
                  <img 
                  // src={enactus1}
                    width="340" height= "223" alt=""></img>
                </div>
                <div className="inside-animation-scroll-item item3">
                  <img 
                  // src={enactus2}
                    width="340" height= "223" alt=""></img>
                </div>
                <div className="inside-animation-scroll-item item4">
                  <img 
                  // src={enactus3}
                   width="340" height= "223" alt=""></img>
                </div>
                <div className="inside-animation-scroll-item item5">
                  <img 
                  // src={Image1}
                    width="340" height= "223" alt=""></img>
                </div>
                <div className="inside-animation-scroll-item item6">
                  <img 
                  // src={Image2}
                    width="340" height= "223" alt=""></img>
                </div>
            </div> */}
            
          {/* </div> */}
        {/* </div> */}
        
              
                 {/* <img 
                //  src={chaineRest}
                  alt='..'  className='chaineRest' />               */}
      </div>
      
    )
  
  } 