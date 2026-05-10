
import React, { useEffect, useMemo, useRef, useState } from 'react';
// import Logo from '../image/logo.svg';
// styles and images
import '../styles_module/header.css';
import { Link, useLocation, useNavigate } from "react-router-dom";

type Category = {
  id: number;
  name: string;
  description?: string | null;
};

type Product = {
  id: number;
  name: string;
};

const logoUrl = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/logo.svg` : '/logo.svg';

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return (await response.json()) as T;
}

export function Header({ scrollToSection, isDimmed = false }: { 
  scrollToSection: (offset: number) => void;
  isDimmed?: boolean;
}) {
const [isVisible, setIsVisible] = useState(false);
const [productQuery, setProductQuery] = useState('');
const [allProducts, setAllProducts] = useState<Product[]>([]);
const [allCategories, setAllCategories] = useState<Category[]>([]);
const [showSearchDropdown, setShowSearchDropdown] = useState(false);
const [userId, setUserId] = useState<string | null>(null);

const searchInputRef = useRef<HTMLInputElement | null>(null);

const navigate = useNavigate();
const location = useLocation();

useEffect(() => {
  const syncAuth = () => {
    setUserId(localStorage.getItem('userId'));
  };

  syncAuth();

  const onStorage = (e: StorageEvent) => {
    if (e.key === 'userId') syncAuth();
  };

  const onAuthChanged = () => syncAuth();

  window.addEventListener('storage', onStorage);
  window.addEventListener('auth:changed', onAuthChanged as EventListener);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('auth:changed', onAuthChanged as EventListener);
  };
}, []);

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const q = params.get('q') || '';
  setProductQuery(q);
}, [location.search]);

useEffect(() => {
  let alive = true;

  const load = async () => {
    try {
      const [products, categories] = await Promise.all([
        fetchJson<Product[]>('/api/products'),
        fetchJson<Category[]>('/api/categories'),
      ]);
      if (!alive) return;
      setAllProducts(products);
      setAllCategories(categories);
    } catch {
      // Keep header usable even if backend is down.
      if (!alive) return;
      setAllProducts([]);
      setAllCategories([]);
    }
  };

  load();
  return () => {
    alive = false;
  };
}, []);

const suggestions = useMemo(() => {
  const q = productQuery.trim().toLowerCase();
  if (!q) return [] as Product[];

  return allProducts
    .filter((p) => p.name?.toLowerCase().includes(q))
    .slice(0, 6);
}, [allProducts, productQuery]);

const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const trimmed = productQuery.trim();
  setShowSearchDropdown(false);
  navigate(trimmed ? `/catalog?q=${encodeURIComponent(trimmed)}` : '/catalog');
};

const goToSuggestion = (name: string) => {
  const trimmed = name.trim();
  setProductQuery(trimmed);
  setShowSearchDropdown(false);
  navigate(trimmed ? `/catalog?q=${encodeURIComponent(trimmed)}` : '/catalog');
};

const goToCategory = (categoryId: number) => {
  const trimmed = productQuery.trim();
  setIsVisible(false);
  const params = new URLSearchParams();
  params.set('categoryId', String(categoryId));
  if (trimmed) params.set('q', trimmed);
  navigate(`/catalog?${params.toString()}`);
};

const logout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('firstName');
  localStorage.removeItem('lastName');
  window.dispatchEvent(new Event('auth:changed'));
  navigate('/login');
};


  return (
    <header className={isDimmed ? 'header header--dimmed' : 'header header--solid'}>
      {/* logo container */}
      <div className="grid-container-header">
               <Link className='linkLogo'   to={"/"}>
        <div className="grid-element-header header-radial" >
          <div className="left-header" data-aos="fade-right">
              <svg
    xmlns="http://www.w3.org/2000/svg"
    id="svg1"
    width="50.596"
    height="50.177"
    version="1.1"
    viewBox="-15 0 115.781 80.215"
  >
    <g id="layer1" transform="translate(-42.585 -101.225)">
      <g id="g98" transform="translate(6.635 41.718)">
        <g
          id="g50"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.079"
          transform="translate(2.75 -4.24)"
        >
          <path
            id="path49-4"
            d="M64.396 110.857a1.296 1.296 44.208 0 0 1.335 1.299h8.44a1.296 1.296 135 0 0 1.296-1.296 1.374 1.374 45 0 0-1.374-1.375h-8.28a1.42 1.42 135.942 0 0-1.417 1.372"
          ></path>
          <path
            id="path49-4-8"
            d="M70.099 105.153h-.07a1.28 1.28 135.536 0 0-1.281 1.257l-.155 8.643a1.314 1.314 46.158 0 0 1.284 1.337 1.374 1.374 135.016 0 0 1.381-1.38l.115-8.565a1.275 1.275 45.405 0 0-1.274-1.292"
          ></path>
        </g>
        <path
          id="path49-7-2"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.196"
          d="M141.54 135.107h-2.92L129.28 90.76l3.533-.037z"
        ></path>
        <path
          id="path49-7-2-2"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.196"
          d="m49.414 135.325 2.899-.003 9.359-44.433-3.533-.036z"
        ></path>
        <path
          id="path49-7-4"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.125"
          d="M69.861 135.32v-3l-19.813-.003 1.98 3.007z"
        ></path>
        <path
          id="path49-7-4-8"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.119"
          d="m65.717 139.719 2.98-2.64H48.991l-.655 2.643z"
        ></path>
        <path
          id="path49-7-4-8-7"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.119"
          d="m125.384 139.72-2.98-2.641h19.705l.654 2.643z"
        ></path>
        <path
          id="path49-7-4-6-3"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.142"
          d="m100.717 117.566 3.803-.004 19.67 17.563-4.296.003z"
        ></path>
        <path
          id="path49-7-4-6-3-8"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.142"
          d="m89.21 117.577-3.883-.008-19.76 17.745 4.296.003z"
        ></path>
        <path
          id="path49-7-4-6-8"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.102"
          d="m104.479 119.903.01-2.336H85.337l.111 2.336z"
        ></path>
        <path
          id="path49-7-4-5"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.125"
          d="m140.803 135.097-1.648-2.895-19.828-.076 1.978 3.007z"
        ></path>
        <g
          id="g51"
          fill="#cb4b16"
          strokeWidth="0.271"
          transform="translate(3.385 -2.976)"
        >
          <ellipse
            id="path51"
            cx="109.762"
            cy="109.804"
            fill="#268bd2"
            rx="2.084"
            ry="2.035"
          ></ellipse>
          <ellipse
            id="path51-8"
            cx="117.023"
            cy="109.814"
            fill="#b58900"
            rx="2.084"
            ry="2.035"
          ></ellipse>
          <ellipse
            id="path51-8-0"
            cx="113.51"
            cy="106.292"
            fill="#dc322f"
            rx="2.084"
            ry="2.035"
          ></ellipse>
          <ellipse
            id="path51-8-0-8"
            cx="113.324"
            cy="113.121"
            fill="#859900"
            rx="2.084"
            ry="2.035"
          ></ellipse>
        </g>
        <rect
          id="rect1-8"
          width="3.223"
          height="61.76"
          x="-121.907"
          y="-89.468"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.497"
          ry="2.821"
          transform="matrix(-.54118 -.8409 -.96173 .274 0 0)"
        ></rect>
        <rect
          id="rect1-8-6-2"
          width="3.216"
          height="32.789"
          x="76.535"
          y="42.595"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.362"
          ry="1.498"
          transform="matrix(.95806 .28656 .44079 .89761 0 0)"
        ></rect>
        <rect
          id="rect1-8-6-2-2"
          width="3.631"
          height="41.765"
          x="117.709"
          y="-147.18"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.434"
          ry="0.786"
          transform="matrix(-.44355 .89625 -.9661 .2582 0 0)"
        ></rect>
        <rect
          id="rect1-8-6-2-2-9"
          width="3.128"
          height="17.242"
          x="118.928"
          y="-139.813"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.259"
          ry="0.788"
          transform="matrix(-.38277 .92384 -.96594 .25875 0 0)"
        ></rect>
        <rect
          id="rect1-8-6-2-1"
          width="2.43"
          height="19.066"
          x="103.596"
          y="14.431"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.24"
          ry="0.871"
          transform="matrix(.90063 .43458 -.0056 .99998 0 0)"
        ></rect>
        <rect
          id="rect1-8-1"
          width="3.223"
          height="61.76"
          x="-89.549"
          y="-49.827"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.497"
          ry="2.821"
          transform="matrix(-.54118 -.8409 -.96173 .274 0 0)"
        ></rect>
        <rect
          id="rect1-8-6"
          width="3.223"
          height="61.76"
          x="-68.132"
          y="74.957"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.497"
          ry="2.821"
          transform="matrix(.54118 -.8409 .96173 .274 0 0)"
        ></rect>
        <rect
          id="rect1-8-6-9"
          width="3.223"
          height="61.76"
          x="-36.163"
          y="115.212"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.497"
          ry="1.611"
          transform="matrix(.54118 -.8409 .96173 .274 0 0)"
        ></rect>
        <circle
          id="path85"
          cx="99.44"
          cy="78.802"
          r="0.004"
          fill="#002b36"
          stroke="#000"
          strokeWidth="0.351"
        ></circle>
        <rect
          id="rect92"
          width="2.607"
          height="11.484"
          x="-44.628"
          y="116.751"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.31"
          ry="1.331"
          transform="matrix(.39181 -.92005 .94636 .3231 0 0)"
        ></rect>
        <path
          id="rect92-9"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.329"
          d="M53.419 77.903h2.338a.247.247 45 0 1 .247.247v10.177a.247.247 135 0 1-.247.247H51.83a.247.247 45 0 1-.247-.247V79.74a1.837 1.837 135 0 1 1.837-1.837"
          transform="matrix(.99996 .009 -.02463 .9997 0 0)"
        ></path>
        <path
          id="rect93"
          fill="#5623d8"
          fillOpacity="1"
          strokeWidth="0.351"
          d="M50.576 86.244h2.125a2.08 2.08 45 0 1 2.08 2.081v6.731h-6.473v-6.544a2.27 2.27 135 0 1 2.268-2.268"
          transform="matrix(1 0 0 .88323 .094 10.024)"
        ></path>
      </g>
    </g>
  </svg>
  
              {/* <div className='logo-name'>Smart<span style={{color:'green'}}>Match</span> Campanion</div> */}
              <div className='logo-name'>NexusLab</div>
          </div>
        </div>
</Link>

        {/* categoory containers*/}
        <div className="grid-element-header" data-aos="fade-up">
          <div className="left-header-element-2 H1">
            <div className='left-header-element-2-inside'></div>

            <div className='left-header-element-2-inside'
            
             onClick={() => setIsVisible(!isVisible)}
             onMouseLeave={() => setIsVisible(false)}
             style={{
              transition: isVisible ? 'none' : 'transform 1s ease-out',
             }}
            >
              <button type="button" className="btn-12 headerCategoryButton">category</button>

                 {isVisible && (
                <div className='dropdown-content headerCategoryDropdown' onMouseLeave={() => setIsVisible(false)}>
                  {allCategories.length === 0 ? (
                    <div className='divSelect'>No categories</div>
                  ) : (
                    allCategories.map((category) => (
                      <div className='divSelect' key={category.id}>
                        <button
                          type="button"
                          className="headerDropdownItem"
                          onClick={() => goToCategory(category.id)}
                        >
                          {category.name}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
              </div>
            <div className='left-header-element-2-inside'></div>
            <div className='left-header-element-2-inside'></div>
          
            
         
          </div>
        </div>


      {/* right before last */}
        <div className="grid-element-header" data-aos="fade-up">
          <div className='searchContainer'>
            <form className="headerSearchForm" onSubmit={submitSearch} role="search" aria-label="Product search">
              <input
                className="headerSearchInput"
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                placeholder="Search products"
                aria-label="Search products"
                ref={searchInputRef}
                onFocus={() => {
                  if (productQuery.trim()) setShowSearchDropdown(true);
                }}
                onBlur={() => {
                  // Let suggestion clicks land before we close.
                  window.setTimeout(() => setShowSearchDropdown(false), 120);
                }}
              />
              <button className="headerSearchButton" type="submit">Search</button>
            </form>

            {showSearchDropdown && suggestions.length > 0 ? (
              <div className="headerSearchDropdown" role="listbox" aria-label="Search suggestions">
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="headerSearchSuggestion"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => goToSuggestion(p.name)}
                    role="option"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>



        {/* right last */}
        <div className="grid-element-header" data-aos="fade-left">
          <div className='left-header-element-2 H4'>
            <div className='left-header-element-2-inside'  >
              <Link to={"/cart"}>
              <span className='btn-12'>Cart</span>
              </Link>

            </div>
            <div className='left-header-element-2-inside'  >
               <Link   to={"/orders"}>
              <span className='btn-12'> Order</span>
              </Link>
            </div>
             <div className='left-header-element-2-inside'  >
              <Link to={"/profile"}>
              <span className='btn-12'>profile</span>
              </Link>
            </div>

            {userId ? (
              <button
                type="button"
                className='btn-epic-header headerAuthButton'
                onClick={logout}
              >
                <span>Log out</span>
              </button>
            ) : (
              <Link className="linkJoin" to={"/signup"}>
                <div className='btn-epic-header'  >
                  <div>
                  <span>Log in</span>
                  <span>Log in</span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>


      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      

   <div className="animation-scroll-header">
          <div className="inside-animation-scroll-item-header item1">
             {/* <img   src={Logo}  style={{width: '25px', height: '30px' }} alt=""></img> */}
              {/* <div className='title'>FROM Enactus To MASTERPIECES</div> */}
             {/* <img   src={Logo}  style={{width: '25px', height: '30px' }} alt=""></img> */}
             {/* <div className='title'>Top 12 du Maroc </div> */}
             {/* <img   src={Logo}  style={{width: '25px', height: '30px' }} alt=""></img> */}
             {/* <div className='title'>Demi finaliste 2023-2024 </div> */}
             {/* <img   src={Logo}  style={{width: '25px', height: '30px' }} alt=""></img> */}
             {/* <div className='title'>Gagnant de prix Enactus Got Impact</div> */}
             {/* <img   src={Logo}  style={{width: '25px', height: '30px' }} alt=""></img> */}
            </div>
            </div>
    </header>
  )
};
