import React, { useEffect, useState } from 'react';
import "../styles_module/profilePage.css";
import avatar from "../new beta images/avatar.webp"
import Trailer from '../components/Trailer';
import { Header } from '../components/header';
import bgImage from '../new beta images/3.webp';
import { Link, useLocation } from 'react-router-dom';



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

export function ProfilePage() {
    const location = useLocation();
  const [userId, setUserId] = useState<string | null>(null);
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
  const [message, setMessage] = useState('');
   const isStandaloneCatalogRoute = location.pathname === '/profile';
    const wrapperStyle: React.CSSProperties = isStandaloneCatalogRoute
      ? {
          ...styles.wrapper,
          height: '100vh',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          // scrollbarWidth: 'none'
        }
      : styles.wrapper;

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

  if (!userId) {
    return <div className='logincasefailed'>
      <hr></hr>
      Please login first, then open profile.
      <hr></hr>
      </div>;
  }

  return (
    <div style={wrapperStyle}>
      <div className='profileContainer'>
       {/* <Trailer /> */}
        <Header scrollToSection={function (offset: number): void {
          throw new Error('Function not implemented.');
        } }/>
      <div className='profileIdentityContainer'>
        <img src={avatar}></img>
        <div className='anima'>
          <div className='dot-anima'></div>
          <span style={{fontWeight:'bold'}}>User Online</span>
        </div>
        <div className='insideProfileIdentity'>
          <div className='labelProfile'>HI, Mr/Mrs : {identity.firstName} {identity.lastName}</div>
          <div className='labelProfile'>Name : {identity.firstName} {identity.lastName}</div>
          <div className='labelProfile'>Email : {identity.email}</div>
          <div className='labelProfile'>Phone : {form.phone}</div>
          <div className='labelProfile'>City : {form.city}</div>
          <div className='labelProfile'>Country : {form.country}</div>
          <div className='labelProfile'>Adress : {form.address}</div>
        </div>
      </div>
      <div className='profileInsideframe'></div>
      <div className='profileInsideframe'></div>
      <div className='profileInsideframe'>
        <div className='profileFramLast'></div>
        <div className='profileFramLast'></div>

      </div>



      {/* <div>
        <p>
          Name: {identity.firstName} {identity.lastName}
        </p>
        <p>Email: {identity.email}</p>
        <p>Phone: {form.phone}</p>
        <p>Address: {form.address}</p>
        <p>City: {form.city}</p>
        <p>Country: {form.country}</p>
      </div> */}

      {/* <form onSubmit={handleSubmit}>
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
        <input name="country" placeholder="Country" value={form.country} onChange={handleChange} />
        <button type="submit">Save profile</button>
        <p>{message}</p>
      </form> */}
      </div>
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
