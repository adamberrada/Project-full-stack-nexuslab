import { useRef } from 'react';

export function useMousePositionEffect() {
    const ref = useRef<HTMLButtonElement>(null);
    
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ref.current.style.setProperty('--x', `${x}px`);
        ref.current.style.setProperty('--y', `${y}px`);
    }
    
    return { ref, handleMouseMove };
}