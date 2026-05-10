import React, { useEffect, useState } from 'react';
import { RatingStars } from './RatingStars';
import '../styles_module/ProductReview.css';

type ReviewResponse = {
  id: string;
  productId: number;
  userId: number;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type Props = {
  productId: number;
  allowReview?: boolean;
  forceOpen?: boolean;
};

export function ProductReviewsContent({ productId, allowReview = true, forceOpen = false }: Props) {
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState<ReviewResponse[] | null>(null);
  const [message, setMessage] = useState('');

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const getNumericUserId = () => {
    const raw = localStorage.getItem('userId');
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const getAuthorName = () => {
    const first = (localStorage.getItem('firstName') || '').trim();
    const last = (localStorage.getItem('lastName') || '').trim();
    const full = `${first} ${last}`.trim();
    return full || 'Anonymous';
  };

  const loadReviews = async () => {
    setMessage('');

    try {
      const response = await fetch(`/api/reviews/product/${productId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setMessage('Reviews are disabled. Start backend with profile "mongo".');
          setReviews([]);
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        setMessage(errorData.message || 'Failed to load reviews');
        setReviews([]);
        return;
      }

      const data = (await response.json()) as ReviewResponse[];
      setReviews(data);
    } catch {
      setMessage('Cannot reach backend (http://localhost:8080)');
      setReviews([]);
    }
  };

  useEffect(() => {
    if (!open || reviews !== null) return;

    loadReviews();
  }, [open, reviews]);

  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  const toggle = () => {
    setOpen((current) => !current);
    setMessage('');
  };

  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    const numericUserId = getNumericUserId();
    const authorName = getAuthorName();

    if (!numericUserId) {
      setMessage('Login first to add a review.');
      return;
    }

    const cleanComment = comment.trim();
    if (!cleanComment) {
      setMessage('Write a comment.');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userId: numericUserId,
          authorName,
          rating,
          comment: cleanComment,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          setMessage('Reviews are disabled. Start backend with profile "mongo".');
          setReviews([]);
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        setMessage(errorData.message || 'Failed to submit review');
        setReviews([]);
        return;
      }

      setComment('');
      await loadReviews();
      setMessage('Review added.');
    } catch {
      setMessage('Cannot reach backend (http://localhost:8080)');
      setReviews([]);
    }
  };

  return (
     <div className="review-widget">
  <button type="button" className="toggle-btn" onClick={toggle}>
    {open ? 'Hide Reviews' : '★ Reviews / Rating'}
  </button>

  {open && (
    <div className="review-panel">
      {message && <div className="review-message">{message}</div>}

      {allowReview ? (
        <form onSubmit={submitReview} className="review-form">
          <label className="rating-label">
            <span>Rating</span>
            <span className="rating-value">{rating}/5</span>
          </label>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="rating-select"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 ? 's' : ''}
              </option>
            ))}
          </select>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a review..."
            className="review-textarea"
            rows={3}
          />

          <button type="submit" className="submit-review-btn">
            Add Review
          </button>
        </form>
      ) : (
        <div className="empty-text">You can add a review only for products you purchased and validated.</div>
      )}

      {reviews === null ? (
        <div className="loading-text">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="empty-text">No reviews yet.</div>
      ) : (
        <div className="reviews-list">
          {reviews.map((r) => (
            <div key={r.id} className="review-item">
              <div className="review-item-header">
                <strong className="review-author">{r.authorName}</strong>
                <span className="review-meta">
                  <RatingStars value={r.rating} />{' '}
                  {Number.isFinite(Number(r.rating)) ? Number(r.rating) : 0}/5
                </span>
              </div>
              <p className="review-comment">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</div>

  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    marginTop: 10,
  },
  toggleBtn: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(15, 23, 42, 0.78)',
    color: '#fff',
    cursor: 'pointer',
  },
  panel: {
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(15, 23, 42, 0.55)',
  },
  message: {
    marginBottom: 10,
    color: '#e2e8f0',
    fontSize: 13,
  },
  form: {
    display: 'grid',
    gap: 8,
    marginBottom: 10,
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    color: '#cbd5e1',
    fontSize: 12,
  },
  ratingValue: {
    padding: '2px 8px',
    borderRadius: 999,
    background: 'rgba(245, 158, 11, 0.16)',
    color: '#fbbf24',
    fontSize: 12,
  },
  select: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(15, 23, 42, 0.78)',
    color: '#fff',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(15, 23, 42, 0.78)',
    color: '#fff',
    outline: 'none',
    resize: 'vertical',
  },
  submitBtn: {
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(245, 158, 11, 0.16)',
    color: '#fbbf24',
    cursor: 'pointer',
  },
  list: {
    display: 'grid',
    gap: 8,
  },
  item: {
    padding: 10,
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(15, 23, 42, 0.78)',
  },
  itemTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 8,
    color: '#f8fafc',
    fontSize: 13,
    marginBottom: 4,
  },
  smallText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
};
