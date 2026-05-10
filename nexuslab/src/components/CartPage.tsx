import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProductReviewsContent} from './ProductReviewsContent';
import { Header } from '../components/header';
import '../styles_module/cartePage.css';
import { useMousePositionEffect } from '../mouseHover';
import {Footer} from '../components/footer';
import bgImage from '../new beta images/3.webp';

type CartItemResponse = {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string | null;
  unitPrice: number | string;
  quantity: number;
  lineTotal: number | string;
  availableQuantity: number;
};

type CartResponse = {
  cartId: number;
  userId: number;
  items: CartItemResponse[];
  totalAmount: number | string;
};

function formatMoney(value: number | string) {
  if (typeof value === 'number') return value.toFixed(2);
  return value;
}

export function CartPage() {

  const location = useLocation();
// const { handleMouseMove } = useMousePositionEffect();
  const isStandaloneCatalogRoute = location.pathname === '/cart';
  const wrapperStyle: React.CSSProperties = isStandaloneCatalogRoute
    ? {
        ...styles.wrapper,
        height: '100vh',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        // scrollbarWidth: 'none'

      }
    : styles.wrapper;

  const getCartStyle = (imageUrl?: string | null): React.CSSProperties => ({
    ...styles.card,
    backgroundImage: imageUrl
      ? `linear-gradient(180deg, rgba(17, 24, 39, 0.15) 0%, rgba(17, 24, 39, 0.82) 100%), url(${imageUrl})`
      : styles.card.backgroundImage,
  });

  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [message, setMessage] = useState('');

  const [addProductId, setAddProductId] = useState('');
  const [addQty, setAddQty] = useState(1);

  const numericUserId = useMemo(() => {
    if (!userId) return null;
    const parsed = Number(userId);
    return Number.isFinite(parsed) ? parsed : null;
  }, [userId]);

  const loadCart = async (uid: number) => {
    setMessage('');
    const response = await fetch(`/api/cart/${uid}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      setMessage(errorData.message || 'Failed to load cart');
      return;
    }
    const data = (await response.json()) as CartResponse;
    setCart(data);
  };

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  useEffect(() => {
    if (!numericUserId) return;
    loadCart(numericUserId).catch(() => setMessage('Cannot reach backend (http://localhost:8080)'));
  }, [numericUserId]);

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (!numericUserId) {
      setMessage('You must login first.');
      return;
    }

    const productId = Number(addProductId);
    if (!Number.isFinite(productId) || productId <= 0) {
      setMessage('Enter a valid productId');
      return;
    }

    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: numericUserId, productId, quantity: addQty }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setMessage(errorData.message || 'Failed to add to cart');
        return;
      }

      const data = (await response.json()) as CartResponse;
      setCart(data);
      setMessage('Added to cart');
    } catch {
      setMessage('Cannot reach backend (http://localhost:8080)');
    }
  };

  const updateItemQuantity = async (itemId: number, quantity: number) => {
    setMessage('');

    if (!Number.isFinite(quantity) || quantity < 1) return;

    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setMessage(errorData.message || 'Failed to update item');
        return;
      }

      const data = (await response.json()) as CartResponse;
      setCart(data);
    } catch {
      setMessage('Cannot reach backend (http://localhost:8080)');
    }
  };

  const removeItem = async (itemId: number) => {
    setMessage('');

    try {
      const response = await fetch(`/api/cart/remove/${itemId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setMessage(errorData.message || 'Failed to remove item');
        return;
      }

      if (numericUserId) {
        await loadCart(numericUserId);
      }
    } catch {
      setMessage('Cannot reach backend (http://localhost:8080)');
    }
  };

  const checkout = async () => {
    setMessage('');

    if (!numericUserId) {
      setMessage('You must login first.');
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: numericUserId }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        setMessage(data?.message || 'Failed to place order');
        return;
      }

      const placedOrderId = data?.id;
      await loadCart(numericUserId);
      navigate('/orders', { state: { placedOrderId } });
    } catch {
      setMessage('Cannot reach backend (http://localhost:8080)');
    }
  };

  if (!numericUserId) {
    return <div className='logincasefailed'>
    <hr></hr>
      Please login first, then open cart.
    <hr></hr>
    </div>;
  }
    // const getCardStyle = (imageUrl?: string | null): React.CSSProperties => ({
    //   ...styles.card,
    //   backgroundImage: imageUrl
    //     ? `linear-gradient(180deg, rgba(17, 24, 39, 0.15) 0%, rgba(17, 24, 39, 0.82) 100%), url(${imageUrl})`
    //     : styles.card.backgroundImage,
    // });
  

  return (
    <section style={wrapperStyle}>
       <Header scrollToSection={function (offset: number): void {
              throw new Error('Function not implemented.');
            } }/>
            

       <div style={styles.hero}>
        <div style={styles.heroRow}>
          <div style={styles.heroCopy}>
            {/* <h2 style={styles.title}>Spring Boot products, loaded dynamically</h2> */}
            <div style={styles.subtitle1}>
             My cart:
            </div>
              <div style={styles.subtitle2}>
            Quantity
            </div>
              <div style={styles.subtitle3}>
            Total
            </div>
          </div>
        </div>
      </div>

      {/* <form onSubmit={handleAdd}>
        <input
          placeholder="Product ID"
          value={addProductId}
          onChange={(e) => setAddProductId(e.target.value)}
        />
        <input
          type="number"
          min={1}
          value={addQty}
          onChange={(e) => setAddQty(Number(e.target.value))}
        />
        <button type="submit">Add</button>
      </form> */}

      <p>{message}</p>

      {!cart ? (
        <p>Loading...</p>
      ) : cart.items.length === 0 ? (
        <div className='cartEmpty'>Cart is empty</div>
      ) : (
        <div className='cartANdCheckoutGrid' >
         

        <div style={styles.grid} >
          {cart.items.map((item) => (
              <div className='gridQutCart'>
            <article key={item.id} className="cart-card"
            //  onMouseMove={handleMouseMove}
             >
              <div></div>
            <div key={item.id} className="cart-card-bg" style={getCartStyle(item.imageUrl)} ></div>

            <div style={styles.cardBody}>
                <div></div>
                <div className='cardbody'>
                <div style={styles.metaRow}>
                  <span style={styles.categoryTag}>{item.productId || 'Uncategorized'}</span>
                  <span style={styles.stock}>{item.availableQuantity} in stock</span>
                </div>
                <h3 style={styles.cardTitle}>{item.productName}</h3>
                <p style={styles.price}>${typeof item.unitPrice === 'string' ? item.unitPrice : item.unitPrice.toFixed?.(2) ?? item.unitPrice}</p>

                <div className="cart-card-actions">

                 <button type="button" className="btn-epic cart-order-button" onClick={() => removeItem(item.id)}>
                  <div>
                    <span> Remove</span>
                    <span> Remove</span>
                  </div>
                </button>
                </div>
             
              </div>
              </div>
         



              
              {/* <div>
                Unit: {formatMoney(item.unitPrice)} | Line: {formatMoney(item.lineTotal)} | Available: {item.availableQuantity}
              </div> */}
            

            </article>
              <div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                style={{
                  background: 'rgba(139, 92, 246, 0.3)',
                  border: '1px solid rgba(139, 92, 246, 0.5)',
                  color: '#fff',
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                }}
              >
                -
              </button>
              
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateItemQuantity(item.id, Number(e.target.value))}
                className="quantity-input"
              />
              
              <button 
                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                style={{
                  background: 'rgba(139, 92, 246, 0.3)',
                  border: '1px solid rgba(139, 92, 246, 0.5)',
                  color: '#fff',
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                }}
              >
                +
              </button>
            </div>

                {/* <button type="button" onClick={() => removeItem(item.id)}>
                  Remove
                </button> */}
              </div>
            </div>
          ))}
          </div>
          <div>
          <div className='totalAndCheckout'>
        <p className='total-text'>
          Total: <span className='price-highlight'>{cart.totalAmount} <span>$</span></span>
        </p>
        
        <button className='checkoutButtom' type="button" onClick={checkout}>
          Checkout
        </button>
        
      </div>
      {/* ... existing Total and Checkout code ... */}

      <div className="guarantees-section">
        <h3 className="guarantees-title">Our Guarantees</h3>
        
        <div className="guarantees-grid">
          {/* Item 1: Support */}
          <div className="guarantee-card">
            <div className="guarantee-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow-support" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <path d="M8 16C8 11.58 11.58 8 16 8C20.42 8 24 11.58 24 16V18C24 22.42 20.42 26 16 26C11.58 26 8 22.42 8 18V16Z" stroke="#8b5cf6" stroke-width="2" filter="url(#glow-support)"/>
  <rect x="7" y="15" width="3" height="6" rx="1.5" stroke="#8b5cf6" stroke-width="2" filter="url(#glow-support)"/>
  <rect x="22" y="15" width="3" height="6" rx="1.5" stroke="#8b5cf6" stroke-width="2" filter="url(#glow-support)"/>
  <path d="M19 22L17 25" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" filter="url(#glow-support)"/>
  <path d="M20 10L22 8M22 10L20 12M24 10L22 12" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round" filter="url(#glow-support)"/>
</svg>
            </div>
            <h4>24/7 Support</h4>
            <p>Available when you need us, via chat, email or phone</p>
          </div>

          {/* Item 2: Trust/Social */}
          <div className="guarantee-card">
            <div className="guarantee-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow-love" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <circle cx="16" cy="16" r="10" stroke="#8b5cf6" stroke-width="2" filter="url(#glow-love)"/>
  <path d="M16 22C16 22 10 18 10 14C10 11 12 10 14 10C15.5 10 16 11.5 16 11.5C16 11.5 16.5 10 18 10C20 10 22 11 22 14C22 18 16 22 16 22Z" fill="#8b5cf6" filter="url(#glow-love)"/>
  <path d="M8 8L9 7M8 8L7 9M8 8L9 9" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round" filter="url(#glow-love)"/>
  <path d="M24 8L25 7M24 8L23 9M24 8L25 9" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round" filter="url(#glow-love)"/>
</svg>
            </div>
            <h4>Our Customers Love Us</h4>
            <p>Over 10,000 subscribers on our social media pages</p>
          </div>

          {/* Item 3: Delivery */}
          <div className="guarantee-card">
            <div className="guarantee-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow-delivery" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <rect x="8" y="10" width="16" height="14" rx="2" stroke="#8b5cf6" stroke-width="2" filter="url(#glow-delivery)"/>
  <path d="M8 15H24" stroke="#8b5cf6" stroke-width="2" filter="url(#glow-delivery)"/>
  <path d="M16 10V24" stroke="#8b5cf6" stroke-width="2" filter="url(#glow-delivery)"/>
  <path d="M18 8L14 16H18L14 24L20 16H16L20 8H18Z" fill="#8b5cf6" filter="url(#glow-delivery)"/>
  <path d="M6 18H9M6 22H10" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round" filter="url(#glow-delivery)"/>
</svg>
            </div>
            <h4>Fast Delivery</h4>
            <p>100% of shipments delivered within 24-48h to your doorstep</p>
          </div>
        </div>
      </div>
      </div>

        </div>
      )}
        <div className='pxl-overlay--gradient gr2'></div>



    <Footer />
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  
  wrapper: {
    minHeight: '100vh',
    // padding: '0px 24px 64px',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    // 'radial-gradient(circle at top left, rgba(82, 0, 235, 0.25), transparent 42%), linear-gradient(180deg, #1e1f22 0%, #1e1f22 100%)',
      
    color: '#f8fafc',
  },
  hero: {

    maxWidth: 1290,
    margin: '100px 20px 26px 16dvh',
  },
  heroRow: {
    // display: 'flex',
    // alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  heroCopy: {
    minWidth: 280,
    // flex: '1 1 520px',
    display:'grid',
    gridTemplateColumns:'1fr 1fr 25dvh',
    columnGap:'20px',
    alignItems:'center',
    justifyContent:'end',
    borderBottom: '1px solid rgba(255,255,255,0.12)',

  },

  kicker: {
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    fontSize: 12,
    color: '#f59e0b',
  },
  title: {
    margin: '8px 0 12px',
    fontSize: 'clamp(2rem, 5vw, 4rem)',
    lineHeight: 1.05,
  },
  subtitle1: {
    margin: 0,
    maxWidth: 720,
    color: '#cbd5e1',
    fontSize: 47,
     fontFamily: "'savior bold', sans-serif",
      fontWeight: 'bold'

     
  },
    subtitle2: {
    margin: 0,
    maxWidth: 720,
    color: '#cbd5e1',
    fontSize: 27,
     fontFamily: "'savior bold', sans-serif",
      fontWeight: 'bold'

     
  },
    subtitle3: {
    margin: 0,
    maxWidth: 720,
    color: '#cbd5e1',
    fontSize: 47,
     fontFamily: "'savior bold', sans-serif",
      fontWeight: 'bold'

     
  },
  controls: {
    maxWidth: 1100,
    margin: '0 auto 24px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(15, 23, 42, 0.78)',
    color: '#fff',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.12)',
    background: '#461bb4',
    color: '#fff',
    outline: 'none',
    fontFamily: "'savior bold', 'sans-serif'",
    
  },
  stateBox: {
    maxWidth: 1100,
    margin: '0 auto 24px',
    padding: '16px 18px',
    borderRadius: 14,
    background: 'rgba(15, 23, 42, 0.7)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#e2e8f0',
  },
  grid: {
    // maxWidth: '165%',
    margin: '0 0',
    padding: '0 24px',
    display: 'grid',
    // gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 20,
    justifyContent: 'start',
    // backgroundColor:'black',
    // border: '3px solid rgba(255,255,255,0.1)',
    
    marginLeft:'15dvh',
  },
  card: {

    overflow: 'auto',
    borderRadius: 20,
    // backgroundColor: '#111827',
    backgroundSize: 'cover',
    backgroundPosition: 'top',
    backgroundRepeat: 'no-repeat',
    border: '1px solid rgba(255,255,255,0.08)',
    // boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
     scrollbarWidth: 'none',
  },
  cardBody: {
    height:'25dvh',
    display:'flex',
    flexDirection:'column',
    justifyContent: 'flex-end',
    padding: '8px 16px 12px',
    background: 'linear-gradient(180deg, rgba(8, 15, 30, 0.18) 0%, rgba(8, 15, 30, 0.82) 100%)',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    fontSize: 12,
    color: '#cbd5e1',
    marginBottom: 12,
  },
  categoryTag: {
    padding: '4px 10px',
    fontFamily: "'savior bold', 'sans-serif'",
    borderRadius: 999,
    // background: '#5623d8',
    border:'1px solid white ',
    color: '#ffffff',
      fontWeight: 'bold'
  },
  stock: {
    whiteSpace: 'nowrap',
  },
  cartButton: {
    marginTop: 12,
    width: '100%',
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(15, 23, 42, 0.78)',
    color: '#fff',
    cursor: 'pointer',
  },
  cardTitle: {
    margin: '0 0 10px',
    fontSize: 20,
    lineHeight: 1.2,
    fontFamily: "'savior bold', 'sans-serif'",
      fontWeight: 'bold'

  },
  price: {
    margin: 0,
    display:'grid',
    gridTemplateColumns:'1fr 1fr',
    color: 'silver',
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "'savior bold', 'sans-serif'",

  },
  root: {
    minHeight: '100vh',
    // overflowY: 'auto',
  },
  html: {
  height: "100%",
  // overflow: auto;
}
};
