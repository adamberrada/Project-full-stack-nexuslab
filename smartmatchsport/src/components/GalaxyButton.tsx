import React, { useEffect, useRef } from 'react';
import '../styles_module/galaxy-button.css';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
};

export default function GalaxyButton({ text , className = '', ...rest }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const stars = Array.from(root.querySelectorAll('.star')) as HTMLElement[];
    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

    stars.forEach((p) => {
      p.style.setProperty('--angle', String(rand(0, 360)));
      p.style.setProperty('--duration', String(rand(6, 20)));
      p.style.setProperty('--delay', String(rand(1, 10)));
      p.style.setProperty('--alpha', String(rand(40, 90) / 100));
      p.style.setProperty('--size', String(rand(2, 6)));
      p.style.setProperty('--distance', String(rand(40, 200)));
    });
  }, []);

  return (
    <div className={`galaxy-button ${className}`} ref={rootRef}>
      <button {...rest}>
        <span className="spark" />
        <span className="backdrop" />
        <span className="galaxy__container">
          <span className="star star--static" />
          <span className="star star--static" />
          <span className="star star--static" />
          <span className="star star--static" />
        </span>
        <span className="galaxy">
          <span className="galaxy__ring">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} className="star" />
            ))}
          </span>
        </span>
        <span className="text">{text}</span>
      </button>
      <div className="bodydrop" />
    </div>
  );
}
