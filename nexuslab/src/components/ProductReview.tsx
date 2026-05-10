import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { ProductReviewsContent as ProductReviews } from './ProductReviewsContent';
import bgImage from '../new beta images/3.webp';
import '../styles_module/catalog-section.css';

type Category = {
  id: number;
  name: string;
  description?: string | null;
};

type Product = {
  id: number;
  name: string;
  price: number | string;
  imageUrl?: string | null;
  category?: Category | null;
  inventory?: { quantity?: number } | null;
};

async function api(path: string) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export function ProductReview() {
  const location = useLocation();

  const isStandaloneCatalogRoute = location.pathname.startsWith('/productReview');
  const wrapperStyle: React.CSSProperties = isStandaloneCatalogRoute
    ? {
        ...styles.wrapper,
        height: '100vh',
        position: 'relative',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
      }
    : styles.wrapper;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [eligibleProductIds, setEligibleProductIds] = useState<Set<number>>(new Set());
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const productsData = await api('/api/products');
        if (!alive) return;
        setProducts(productsData);
      } catch (err) {
        if (!alive) return;
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        if (alive) setLoading(false);
      }
    };

    setUserId(localStorage.getItem('userId'));
    loadProducts();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const numericUserId = userId ? Number(userId) : null;
    if (!numericUserId) {
      setEligibleProductIds(new Set());
      return;
    }

    let alive = true;

    const loadOrders = async () => {
      try {
        const resp = await api(`/api/orders/user/${numericUserId}`);
        if (!alive) return;
        // resp expected to be an array of orders with 'status' and 'items'
        const ids = new Set<number>();
        (resp || []).forEach((order: any) => {
          const status = String(order.status || '').toUpperCase();
          if (status === 'CONFIRMED') {
            (order.items || []).forEach((it: any) => ids.add(Number(it.productId)));
          }
        });
        setEligibleProductIds(ids);
      } catch (e) {
        // ignore and keep empty set
        setEligibleProductIds(new Set());
      }
    };

    loadOrders();

    return () => {
      alive = false;
    };
  }, [userId]);

  const getCardStyle = (imageUrl?: string | null): React.CSSProperties => ({
    ...styles.card,
    backgroundImage: imageUrl
      ? `linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.82) 100%), url(${imageUrl})`
      : styles.card.backgroundImage,
  });

  // Only show products that the user purchased (confirmed orders)
  const displayedProducts = products.filter((p) => eligibleProductIds.has(p.id));

  return (
    <section style={wrapperStyle}>
      <Header
        scrollToSection={function (_offset: number): void {
          throw new Error('Function not implemented.');
        }}
      />

      <div style={styles.hero}>
        <div style={styles.heroRow}>
          <div style={styles.heroCopy}>
            <div style={styles.subtitle}>Product Reviews :</div>
          </div>
        </div>
      </div>

      {loading ? <div style={styles.stateBox}>Loading products...</div> : null}
      {error ? <div style={{ ...styles.stateBox, color: '#9d1c1c' }}>{error}</div> : null}

      {!loading && !error ? (
        <div style={styles.grid}>
          {userId === null && (
            <div style={styles.stateBox}>Please login and place an order to review products.</div>
          )}

          {userId !== null && displayedProducts.length === 0 && (
            <div style={styles.stateBox}>No purchased products to review.</div>
          )}

          {userId !== null && displayedProducts.length > 0 && (
            displayedProducts.map((product) => (
              <article key={product.id} className="catalog-card">
                <div className="catalog-card-bg" style={getCardStyle(product.imageUrl)}></div>
                <div style={styles.cardBody}>
                  <div className="catalog-card-content">
                    <div style={styles.metaRow}>
                      <span style={styles.categoryTag}>{product.category?.name || 'Uncategorized'}</span>
                      <span style={styles.stock}>{product.inventory?.quantity ?? 0} in stock</span>
                    </div>
                    <h3 style={styles.cardTitle}>{product.name}</h3>
                    <div style={styles.price}>
                      <span>Starting at</span>
                      <span className="priceColor">
                        {' '}
                        ${typeof product.price === 'string' ? product.price : product.price.toFixed?.(2) ?? product.price}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={() => setSelectedProductId(product.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 10,
                        border: '1px solid rgba(255,255,255,0.12)',
                        background: 'rgba(245, 158, 11, 0.12)',
                        color: '#fff',
                        cursor: 'pointer',
                        width: '100%',
                      }}
                    >
                      View reviews
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      ) : null}

      {/* External reviews panel (outside the card) */}
      {selectedProductId ? (
        <div style={styles.sidebar}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <h3 style={{ margin: 0 }}>{`Reviews`}</h3>
            <button
              type="button"
              onClick={() => setSelectedProductId(null)}
              style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
          <div style={{ marginTop: 8 }}>
            <ProductReviews
              productId={selectedProductId as number}
              allowReview={eligibleProductIds.has(selectedProductId as number)}
              forceOpen={true}
            />
          </div>
        </div>
      ) : null}

      {!loading && !error && products.length === 0 ? (
        <div style={styles.stateBox}>No products found.</div>
      ) : null}

      <div className="margine"></div>
      <Footer />
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
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
  subtitle: {
    margin: 0,
    maxWidth: 720,
    color: '#cbd5e1',
    fontSize: 47,
    fontFamily: "'savior bold', sans-serif",
    fontWeight: 'bold',
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
    backgroundSize: 'cover',
    backgroundPosition: 'top',
    backgroundRepeat: 'no-repeat',
    border: '1px solid rgba(255,255,255,0.08)',
    scrollbarWidth: 'none',
  },
  cardBody: {
    height: '55dvh',
    display: 'flex',
    flexDirection: 'column',
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
    border: '1px solid white',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  stock: {
    whiteSpace: 'nowrap',
  },
  cardTitle: {
    margin: '0 0 10px',
    fontSize: 20,
    lineHeight: 1.2,
    fontFamily: "'savior bold', 'sans-serif'",
    fontWeight: 'bold',
  },
  price: {
    margin: 0,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    color: 'silver',
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "'savior bold', 'sans-serif'",
  },
  sidebar: {
    position: 'fixed',
    right: 20,
    top: 120,
    width: 360,
    maxHeight: '70vh',
    overflowY: 'auto',
    padding: 12,
    borderRadius: 12,
    background: 'rgba(15, 23, 42, 0.85)',
    border: '1px solid rgba(255,255,255,0.08)',
    zIndex: 60,
  },
};
