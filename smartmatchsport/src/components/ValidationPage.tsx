import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './header';
import '../styles_module/ValidationPage.css';
import {Footer} from './footer';
import bgImage from '../new beta images/3.webp';
import { useNavigate } from "react-router-dom";

type ProfileResponse = {
  userId: number;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
};

type UpdateProfileRequest = {
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
};

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
  orderId?: number;
  userId?: number;
  validatedOrder?: OrderResponse | null;
} | null;

function formatMoney(value: number | string) {
  if (typeof value === 'number') return value.toFixed(2);
  return value;
}

export function ValidationPage() {
  const location = useLocation();
  const state = (location.state || null) as LocationState;
  const navigate = useNavigate();
  const validatedOrderFromState = state?.validatedOrder ?? null;

  const isStandaloneCatalogRoute = location.pathname === '/validation';
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
    if (!numericUserId) return;

    const placedId = state?.placedOrderId;
    if (placedId) {
      setMessage(`Order placed (#${placedId}).`);
    }

    loadOrders(numericUserId).catch(() => setMessage('Cannot reach backend (http://localhost:8080)'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericUserId]);

  // profile
  const [identity, setIdentity] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [form, setForm] = useState({
    phone: '',
    address: '',
    city: '',
    country: '',
  });

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setUserId(id);

    setIdentity({
      firstName: localStorage.getItem('firstName') || '',
      lastName: localStorage.getItem('lastName') || '',
      email: localStorage.getItem('userEmail') || '',
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      setMessage('');

      try {
        const response = await fetch(`/api/users/${userId}/profile`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          setMessage(errorData.message || 'Failed to load profile');
          return;
        }

        const data = (await response.json()) as ProfileResponse;
        setForm({
          phone: data.phone ?? '',
          address: data.address ?? '',
          city: data.city ?? '',
          country: data.country ?? '',
        });

        localStorage.setItem('userPhone', data.phone ?? '');
        localStorage.setItem('userAddress', data.address ?? '');
        localStorage.setItem('userCity', data.city ?? '');
        localStorage.setItem('userCountry', data.country ?? '');
      } catch {
        setMessage('Cannot reach backend. Start Spring Boot on http://localhost:8080');
      }
    };

    load();
  }, [userId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (!userId) {
      setMessage('You must login first.');
      return;
    }

    const payload: UpdateProfileRequest = {
      phone: form.phone.trim() ? form.phone.trim() : null,
      address: form.address.trim() ? form.address.trim() : null,
      city: form.city.trim() ? form.city.trim() : null,
      country: form.country.trim() ? form.country.trim() : null,
    };

    try {
      const response = await fetch(`/api/users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setMessage(errorData.message || 'Failed to update profile');
        return;
      }

      const data = (await response.json().catch(() => null)) as ProfileResponse | null;
      if (data) {
        setForm({
          phone: data.phone ?? '',
          address: data.address ?? '',
          city: data.city ?? '',
          country: data.country ?? '',
        });
        localStorage.setItem('userPhone', data.phone ?? '');
        localStorage.setItem('userAddress', data.address ?? '');
        localStorage.setItem('userCity', data.city ?? '');
        localStorage.setItem('userCountry', data.country ?? '');
      }
      setMessage('Profile updated successfully');
    } catch {
      setMessage('Cannot reach backend. Start Spring Boot on http://localhost:8080');
    }
  };

  const ordersToRender = (orders && orders.length > 0)
    ? orders
    : (validatedOrderFromState ? [validatedOrderFromState] : []);

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
            </div>
          </div>
        </div>
      </div>




      {message ? <p>{message}</p> : null}

      {!orders && !validatedOrderFromState ? (
        <p>Loading...</p>
      ) : ordersToRender.length === 0 ? (
        <div className='noOrder'>No orders yet. Go to Cart and click Checkout to create one.</div>
      ) : (
      <div className='orderContent'>
  {ordersToRender.map((order) => (
  <div className="confirmation-container">
  <div className="confirmation-glass-card">
    
    {/* LEFT SECTION: Confirmation & Details */}
    <div className="confirmation-left">
      
      {/* Success Header */}
      <div className="success-header">
        <div className="checkmark-circle">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#10b981" strokeWidth="3" fill="none"/>
            <path d="M12 20L18 26L28 14" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p className="confirmation-number">Confirmation n°
             {/* {order.orderNumber} */}
             </p>
          <h2 className="thank-you-text">Thank you, 
            {/* {user.name}! */}
            </h2>
        </div>
      </div>

      {/* Confirmation Message */}
      <div className="confirmation-message glass-box">
        <h3>Your order is now confirmed</h3>
        <p>Thank you,</p>
        <p>Your order is pending validation by phone.</p>
        <p>Please stay reachable, one of our agents will contact you as soon as possible to confirm your order.</p>
      </div>

      {/* Order Details */}
      <div className="order-details-section glass-box">
        <h3>Order Details</h3>
        
        <div className="details-grid">
          <div className="detail-column">
            <h4>Contact Information</h4>
            <p>
              {identity.email}
              </p>
            
            <h4>Billing Address</h4>
            <p>
              {form.address}
              <br/>
              {form.city}
              <br/>
              {form.country}
              <br/>
             {form.phone}
            </p>
            
            <h4>Payment Method</h4>
            <p>Livraison express partout au Maroc</p>
          </div>
          
          <div className="detail-column">
            <h4>Moyen de paiement</h4>
            <div className="payment-icon">💳</div>
            <p>Payment on delivery • 
              {formatMoney(order.totalAmount)}
              </p>
            
            <h4>Billing Address</h4>
            <p>
              {form.address}
              <br/>
              {form.city}
              <br/>
              {form.country}
              <br/>
             {form.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Return to Home Button */}
      <button className="return-home-btn" 
      onClick={() => navigate('/')}>
        ← Back to Home
      </button>
     
    </div>

    {/* RIGHT SECTION: Order Summary */}
    <div className="confirmation-right">
      <div className="order-items-summary">
        {order.items.map((item) => (
          <div key={item.id} className="summary-item">
            <div className="item-quantity-badge">{item.quantity}</div>
            <div className="item-info">
              <p className="item-name">{item.productName}</p>
            </div>
            <div className="item-price">{formatMoney(item.lineTotal)}</div>
          </div>
        ))}
        
        <div className="summary-divider"></div>
        
        <div className="summary-row">
          <span>Sous-total • {order.items.length} items</span>
          <span>{formatMoney(order.totalAmount)}</span>
        </div>
        
        <div className="summary-row">
          <span>Shipping</span>
          <span>$0.00</span>
        </div>
        
        <div className="summary-divider"></div>
        
        <div className="summary-total">
          <span>Total</span>
          <span className="total-amount">{formatMoney(order.totalAmount)} $</span>
        </div>
      </div>
    </div>
    
  </div>
</div>
  ))}
</div>
      )}

{/* <div className="orders-container">
  
  <div className="order-glass-card">

    <div className="order-details">
      <div className="order-header">
        <h3>Order #1</h3>
        <span className="status-badge confirmed">CONFIRMED</span>
      </div>
      
      <p className="order-meta">
        Date: 2026-05-09 • Total: $1,607.00
      </p>
      
      <div className="order-items">
        <div className="order-item">
          <span>Casque no audio (x1)</span>
          <span>$1,099.00</span>
        </div>
        <div className="order-item">
          <span>Tapis de yoga2 (x1)</span>
          <span>$109.00</span>
        </div>
        <div className="order-item">
          <span>Pixel Pack (x1)</span>
          <span>$399.00</span>
        </div>
      </div>
    </div>

    <div className="order-summary">
      <div className="summary-row">
        <span>Subtotal</span>
        <span>$1,607.00</span>
      </div>
      <div className="summary-row">
        <span>Shipping</span>
        <span>$0.00</span>
      </div>
      
      <div className="summary-divider"></div>
      
      <div className="summary-row total">
        <span>Total</span>
        <span>$1,607.00</span>
      </div>
      
      <button className="validate-btn" 
      >
        VALIDER LE PAIEMENT
      </button>
    </div>
  </div>
</div> */}



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
