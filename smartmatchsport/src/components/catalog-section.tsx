import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/header';
import '../styles_module/catalog-section.css';
import { useMousePositionEffect } from '../mouseHover';
import {Footer} from '../components/footer';
import bgImage from '../new beta images/3.webp';


interface Category {
  id: number;
  name: string;
  description?: string | null;
}

interface Product {
  id: number;
  name: string;
  price: number | string;
  imageUrl?: string | null;
  category?: Category | null;
  inventory?: { quantity?: number } | null;
}

async function api(path: string) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export function CatalogSection() {
  const location = useLocation();

  const { handleMouseMove } = useMousePositionEffect();

  const isStandaloneCatalogRoute = location.pathname === '/catalog';
  const wrapperStyle: React.CSSProperties = isStandaloneCatalogRoute
    ? {
        ...styles.wrapper,
        height: '100vh',
        position:'relative',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
      }
    : styles.wrapper;

  const containerRef = useRef<HTMLElement | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlQuery = params.get('q') || '';
    const urlCategoryId = params.get('categoryId') || '';
    setQuery(urlQuery);
    setSelectedCategoryId(urlCategoryId);
  }, [location.search]);

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

  useEffect(() => {
    let alive = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [categoriesData, productsData] = await Promise.all([
          api('/api/categories'),
          api('/api/products'),
        ]);

        if (!alive) return;

        setCategories(categoriesData);
        setProducts(productsData);
      } catch (err) {
        if (!alive) return;
        setError(err instanceof Error ? err.message : 'Failed to load catalog');
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadData();

    return () => {
      alive = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const categoryFilter = selectedCategoryId ? Number(selectedCategoryId) : null;

    return products.filter((product) => {
      const matchesQuery = !normalizedQuery || product.name.toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        categoryFilter === null || product.category?.id === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, selectedCategoryId]);

  const getCardStyle = (imageUrl?: string | null): React.CSSProperties => ({
    ...styles.card,
    backgroundImage: imageUrl
      ? `linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.82) 100%), url(${imageUrl})`
      : styles.card.backgroundImage,
  });

  // Helper to detect nested scrollable elements inside the catalog container
  const isInsideNestedScrollable = (eventTarget: EventTarget | null, container: HTMLElement | null) => {
    if (!(eventTarget instanceof HTMLElement)) return false;
    let el: HTMLElement | null = eventTarget;
    while (el && el !== container && el !== document.body) {
      const style = window.getComputedStyle(el);
      const overflowY = style.overflowY;
      if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
        return true;
      }
      el = el.parentElement;
    }
    return false;
  };

  // Smooth wheel handling for the catalog container while preserving nested scrolls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let targetScrollTop = container.scrollTop;
    let rafId: number | null = null;

    const animate = () => {
      rafId = null;
      const current = container.scrollTop;
      const diff = targetScrollTop - current;
      const EASE = 0.12;
      if (Math.abs(diff) < 0.5) {
        container.scrollTop = targetScrollTop;
        return;
      }
      container.scrollTop = current + diff * EASE;
      rafId = window.requestAnimationFrame(animate);
    };

    const onWheel = (e: WheelEvent) => {
      // Allow nested scrollable elements to handle the event
      if (isInsideNestedScrollable(e.target, container)) return;

      // Take control of scrolling for a smoother feel
      e.preventDefault();
      const maxScrollTop = container.scrollHeight - container.clientHeight;
      const speedFactor = 1;
      targetScrollTop = Math.max(0, Math.min(maxScrollTop, targetScrollTop + e.deltaY * speedFactor));
      if (rafId === null) rafId = window.requestAnimationFrame(animate);
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel as EventListener);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={containerRef} style={wrapperStyle}>
      <Header scrollToSection={function (offset: number): void {
        throw new Error('Function not implemented.');
      } }/>
        <div className='pxl-overlay--gradient gr1'></div>

      <div style={styles.hero}>
        <div style={styles.heroRow}>
          <div style={styles.heroCopy}>
            {/* <h2 style={styles.title}>Spring Boot products, loaded dynamically</h2> */}
            <div style={styles.subtitle}>
             Game Collection  :
            </div>
          </div>

          {/* <div style={styles.heroSearch}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              style={styles.input}
            />
          </div> */}
        <div style={styles.controls}>
        <select
          value={selectedCategoryId}
          onChange={(event) => setSelectedCategoryId(event.target.value)}
          style={styles.select}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>







        </div>
      </div>

    

      {loading ? <div style={styles.stateBox}>Loading catalog...</div> : null}
      {error ? <div style={{ ...styles.stateBox, color: '#9d1c1c' }}>{error}</div> : null}
      {cartMessage ? <div style={styles.stateBox}>{cartMessage}</div> : null}

      {!loading && !error ? (
        <div style={styles.grid}>
          {filteredProducts.map((product) => (
            <article key={product.id} className="catalog-card" onMouseMove={handleMouseMove}>
              <div className="catalog-card-bg" style={getCardStyle(product.imageUrl)}></div>
              <div style={styles.cardBody}>
                <div className="catalog-card-content">
                <div style={styles.metaRow}>
                  <span style={styles.categoryTag}>{product.category?.name || 'Uncategorized'}</span>
                  <span style={styles.stock}>{product.inventory?.quantity ?? 0} in stock</span>
                </div>
                <h3 style={styles.cardTitle}>{product.name}</h3>
                <div style={styles.price}><span>Starting at</span>{" "}<span className='priceColor'> ${typeof product.price === 'string' ? product.price : product.price.toFixed?.(2) ?? product.price}</span></div>
                </div>
                <div className="catalog-card-actions">
                <button type="button" className="btn-epic catalog-order-button" onClick={() => addToCart(product.id)}>
                  <div>
                    <span>Order now</span>
                    <span>Order now</span>
                  </div>
                </button>
                </div>
                {/* <ProductReviews productId={product.id} /> */}
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {!loading && !error && filteredProducts.length === 0 ? (
        <div style={styles.stateBox}>No products match your filters.</div>
      ) : null}
      <div className='margine'></div>
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
