import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Header } from '../components/header';
import '../styles_module/orderPage.css';
import {Footer} from '../components/footer';
import bgImage from '../new beta images/3.webp';
import { useNavigate } from "react-router-dom";



type OrderItemResponse = {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number | string;
  quantity: number;
  lineTotal: number | string;
};

type OrderResponse = {
  id: number;
  userId: number;
  orderDate: string;
  totalAmount: number | string;
  status: string;
  items: OrderItemResponse[];
};

type LocationState = {
  placedOrderId?: number;
} | null;

function formatMoney(value: number | string) {
  if (typeof value === 'number') return value.toFixed(2);
  return value;
}

export function OrdersPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || null) as LocationState;

  const isStandaloneCatalogRoute = location.pathname === '/orders';
  const wrapperStyle: React.CSSProperties = isStandaloneCatalogRoute
    ? {
        ...styles.wrapper,
        height: '100vh',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        // scrollbarWidth: 'none'
      }
    : styles.wrapper;




  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderResponse[] | null>(null);
  const [message, setMessage] = useState('');

  const numericUserId = useMemo(() => {
    if (!userId) return null;
    const parsed = Number(userId);
    return Number.isFinite(parsed) ? parsed : null;
  }, [userId]);

  const loadOrders = async (uid: number) => {
    setMessage('');

    const response = await fetch(`/api/orders/user/${uid}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      setMessage(errorData.message || 'Failed to load orders');
      return;
    }
 

    const data = (await response.json()) as OrderResponse[];
    setOrders(data);
  };

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  useEffect(() => {
    if (!numericUserId) return;

    const placedId = state?.placedOrderId;
    if (placedId) {
      setMessage(`Order placed (#${placedId}).`);
    }

    loadOrders(numericUserId).catch(() => setMessage('Cannot reach backend (http://localhost:8080)'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericUserId]);

  if (!numericUserId) {
    return <div className='logincasefailed'>
      <hr></hr>
      Please login first, then open orders.
      <hr></hr>
      </div>;
  }
  const validateOrder = async (orderId: number) => {
    setMessage('');

    if (!numericUserId) {
      setMessage('You must login first.');
      return;
    }

    try {
      const selectedOrder = orders?.find((order) => order.id === orderId) ?? null;

      const response = await fetch(`/api/orders/${orderId}/validate?userId=${numericUserId}`, {
        method: 'PUT',
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        setMessage(data?.message || 'Failed to validate order');
        return;
      }

      // Reset the currently displayed order after successful validation.
      setOrders((prev) => (prev ? prev.filter((order) => order.id !== orderId) : prev));
      setMessage('Order validated successfully.');
      navigate('/validation', { state: { orderId, userId: numericUserId, validatedOrder: selectedOrder } });
    } catch {
      setMessage('Cannot reach backend (http://localhost:8080)');
    }
  };
 
  return (
    <div style={wrapperStyle}>
         <Header scrollToSection={function (offset: number): void {
                    throw new Error('Function not implemented.');
                  } }/>
      

   <div style={styles.hero}>
        <div style={styles.heroRow}>
          <div style={styles.heroCopy}>
            {/* <h2 style={styles.title}>Spring Boot products, loaded dynamically</h2> */}
            <div style={styles.subtitle}>
             My orders:
            </div>
              <button className="return-home-btn" 
      onClick={() => navigate('/productReview')}>
        → add a review 
      </button>
          </div>
        </div>
      </div>




      {message ? <p>{message}</p> : null}

      {!orders ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <div className='noOrder'>No orders yet. Go to Cart and click Checkout to create one.</div>
      ) : (
      <div className='orderContent'>
  {orders.map((order) => (
    <div key={order.id} className="order-glass-card">
      
      {/* LEFT SIDE: Order Details */}
      <div className="order-details">
        <div className="order-header">
          <h3>Order #{order.id}</h3>
          <span className={`status-badge ${order.status?.toLowerCase() || 'default'}`}>
            {order.status?.toUpperCase() || 'UNKNOWN'}
          </span>
        </div>
        
        <p className="order-meta">
          Date: {order.orderDate} • Total: {formatMoney(order.totalAmount)}
        </p>
        
        <div className="order-items">
          {order.items.map((item) => (
            <div key={item.id} className="order-item">
              <span>{item.productName} (x{item.quantity})</span>
              <span>{formatMoney(item.lineTotal)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: Summary & Button */}
      <div className="order-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatMoney(order.totalAmount)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>$0.00</span>
        </div>
        
        <div className="summary-divider"></div>
        
        <div className="summary-row total">
          <span>Total</span>
          <span>{formatMoney(order.totalAmount)}</span>
        </div>
        
        <button className="validate-btn"
        onClick={() => validateOrder(order.id)}>
          VALIDER LE PAIEMENT
        </button>
        
      </div>
      
    </div>
  ))}
</div>

      )}

          <Footer />
      
    </div>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
  },
  heroCopy: {
    minWidth: 280,
    flex: '1 1 520px',
  },
  heroSearch: {
    minWidth: 240,
    flex: '0 1 360px',
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
  subtitle: {
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
    maxWidth: '85%',
    margin: '0 auto',
    padding: '0 24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 20,
    justifyContent: 'center',
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
    height:'55dvh',
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
