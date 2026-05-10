import React, { useEffect } from 'react';
import '../styles_module/trailer.css';

export default function Trailer() {
  useEffect(() => {
    const trailer = document.getElementById('trailer');
    const icon = document.getElementById('trailer-icon');
    if (!trailer) return;

    const animateTrailer = (e: MouseEvent | TouchEvent, interacting: boolean) => {
      const event = (e as MouseEvent);
      const x = event.clientX - trailer.offsetWidth / 2;
      const y = event.clientY - trailer.offsetHeight / 2;

      const keyframes = {
        transform: `translate(${x}px, ${y}px) scale(${interacting ? 8 : 1})`,
      } as Keyframe;

      // @ts-ignore animate is available on Element
      (trailer as any).animate(keyframes, {
        duration: 800,
        fill: 'forwards',
      });
    };

    const getTrailerClass = (type: string) => {
      switch (type) {
        case 'video':
          return 'fa-solid fa-play';
        default:
          return 'fa-solid fa-arrow-up-right';
      }
    };

    const onMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactable = target && target.closest ? (target.closest('.interactable') as HTMLElement | null) : null;
      const interacting = interactable !== null;

      animateTrailer(e, interacting);

      if (interacting) {
        trailer.dataset.type = interactable!.dataset.type || '';
        if (icon) icon.className = getTrailerClass(interactable!.dataset.type || '');
      } else {
        trailer.dataset.type = '';
      }
    };

    window.addEventListener('mousemove', onMove);

    return () => {
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div id="trailer">
      <i id="trailer-icon" className="fa-solid fa-arrow-up-right" />
    </div>
  );
}
