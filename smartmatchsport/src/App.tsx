import React, { useEffect, useRef, useState } from 'react';
import { Parallax, ParallaxLayer, IParallax } from '@react-spring/parallax';
import gif from "./image/icons8-collapse-arrow.gif"
import  './App.css';
import styles from './styles_module/styles.module.css';
import { Routes, Route } from 'react-router-dom';
//import components
import { Header } from './components/header';
import { Section1 } from './components/section1';
import { Section2 } from './components/section2';
import { Section3 } from './components/section3';

import {Section4} from './components/section4';
import {Section5, LoadMoreButton} from './components/section5';
import {Section6} from './components/section6';
import {Section7} from './components/section7';
import {Footer} from './components/footer';
import { Link } from "react-router-dom";
import { CatalogSection } from './components/catalog-section';
import Trailer from './components/Trailer';

// import homeStickyBg from './new beta images/home10-img1.webp';
import homeStickyBg from './new beta images/land.png';
import AOS from 'aos';
import 'aos/dist/aos.css';





// interface for mission
interface Mission {
  id: number;
  title: string;
  description: string;
  image: string;
  more: string;
  logo : string;
  alt: string;
  url : string;
   
}

interface Member {
  id: number;
  title : string;
  description: string;
  image : string;
}
interface EventDate {
  date_day : string;
  date_dayNum : string;
  date_monthAndYear : string;
}

interface Event {
  id: number;
  categorie : string;
  image: string;
  title: string;
  date :  EventDate[];
  description: string;
  quote?: string;
  more?: string;
}

const Page = ({ offset, gradient, onClick }: { 
  offset: number; 
  gradient: string; 
  onClick: () => void 
}) => (
  <>
    <ParallaxLayer className='' offset={offset} speed={0} onClick={onClick}>
      <div className={`slopeEnd ${gradient}`} >
      <div className='div-para'>
      <img className='logo-parallax-end-right'   
      src={gif}
        style={{width: '35px', height: '30px' , margin: 'auto auto'}} alt=""></img>
      </div>
      </div>
    </ParallaxLayer>
  </>
);

export default function App() {
  
const parallax = useRef<IParallax>(null);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([]);
  const [startingIndex, setStartingIndex] = useState(0);
  const [hasMoreEvents, setHasMoreEvents] = useState(true);
  const [totalPages, setTotalPages] = useState(6.1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded,setIsExpended] = useState(false);
  const [allMission, setAllMission] = useState<Mission[]>([]);
  const [allMember, setAllMember] = useState<Member[]>([]);
  const [displayedMission, setDisplayedMission] = useState<Mission[]>([]);
  const [displayedMember, setDisplayedMember] = useState<Member[]>([]);
  const [isHeaderDimmed, setIsHeaderDimmed] = useState(true);

  // Smooth mouse-wheel scrolling (roller) for the Parallax container.
  useEffect(() => {
    const parallaxAny = parallax.current as any;
    const container: HTMLElement | undefined = parallaxAny?.container?.current;
    if (!container) return;

    const updateHeaderOpacity = () => {
      setIsHeaderDimmed(container.scrollTop < window.innerHeight);
    };

    updateHeaderOpacity();

    let targetScrollTop = container.scrollTop;
    let rafId: number | null = null;

    const isInsideNestedScrollable = (eventTarget: EventTarget | null) => {
      if (!(eventTarget instanceof HTMLElement)) return false;
      let el: HTMLElement | null = eventTarget;
      while (el && el !== container) {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
          return true;
        }
        el = el.parentElement;
      }
      return false;
    };

    const animate = () => {
      rafId = null;
      const current = container.scrollTop;
      const diff = targetScrollTop - current;

      // easing factor: higher = snappier, lower = smoother
      const EASE = 0.12;

      if (Math.abs(diff) < 0.5) {
        container.scrollTop = targetScrollTop;
        return;
      }

      container.scrollTop = current + diff * EASE;
      rafId = window.requestAnimationFrame(animate);
    };

    const onWheel = (e: WheelEvent) => {
      // Let browser handle pinch-zoom and nested scroll areas.
      if (e.ctrlKey || isInsideNestedScrollable(e.target)) return;

      e.preventDefault();

      const maxScrollTop = container.scrollHeight - container.clientHeight;
      const speedFactore = 1;
      targetScrollTop = Math.max(0, Math.min(maxScrollTop, targetScrollTop + e.deltaY * speedFactore));

      if (rafId === null) {
        rafId = window.requestAnimationFrame(animate);
      }
    };

    const onScroll = () => {
      updateHeaderOpacity();
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      container.removeEventListener('wheel', onWheel as EventListener);
      container.removeEventListener('scroll', onScroll as EventListener);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
  // Initialize AOS on mount
  AOS.init({
    duration: 1000,        // Animation duration in ms
    once: false,           // Trigger animation every time element comes into view
    offset: 100,           // Offset from viewport bottom (pixels)
    delay: 0,              // Delay before animation starts
    easing: 'ease-in-out'  // Easing function
  });

  // Refresh AOS on scroll
  window.addEventListener('scroll', () => {
    AOS.refresh();
  });

  return () => {
    window.removeEventListener('scroll', () => {
      AOS.refresh();
    });
  };
}, []);

        const scroll = (to: number) => {
          parallax.current?.scrollTo(to);
        };

      // When Section5 content loads
      const handleContentLoad = (contentHeight: number) => {
        const contentPages = contentHeight / window.innerHeight;
        setTotalPages(6 + Math.max(1, contentPages));
      }

      // const loadMoreEvents = () => {
      //   const newStartingIndex = startingIndex + 3;
      //   const newEndingIndex = startingIndex + 6;
        
      //   const newEvents = allEvents.slice(newStartingIndex, newEndingIndex);
      //   setDisplayedEvents([...displayedEvents, ...newEvents]);
      //   setStartingIndex(newStartingIndex);
        
      //   // Check if we've loaded all events
      //   if (newEndingIndex >= allEvents.length) {
      //     setHasMoreEvents(false);
      //   }
      // };
  // Function to scroll to a specific offset
  const scrollToSection = (offset: number) => {
    parallax.current?.scrollTo(offset);
  };
        

  return (
<div className='root-hole'>
  <Trailer />
  <Header scrollToSection={scrollToSection} isDimmed={isHeaderDimmed} />
  <Parallax  ref={parallax} pages={totalPages} >

      {/* Sticky background for sections AFTER Section1 (exclude slider) */}
      <ParallaxLayer
        sticky={{ start: 1, end: Math.max(1, Math.ceil(totalPages) - 1) }}
        style={{
          backgroundImage: `url(${homeStickyBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          pointerEvents: 'none',
          opacity: 0.9,
          zIndex: -1,
        }}
      />
    
      {/* PAGE 0 - Unique content */}
        { /* the offest is essential for page uniqueness */}

            <ParallaxLayer offset={0} speed={0} style={{ zIndex: 1 }}> 
              <Section1 /> 
            
          </ParallaxLayer>
          <div className='pageOffset' >
          {/* <Page offset={0} gradient="" onClick={() => scroll(1)}  /> */}
          </div>
           

      {/* PAGE 1 - Unique content */}

          <ParallaxLayer offset={1} speed={0} style={{ zIndex: 1 }}>
            <Section2 />
          </ParallaxLayer>
           <div className='pageOffset'>
            {/* <Page offset={1} gradient="" onClick={() => scroll(2)} /> */}
              </div>

              <ParallaxLayer  offset={2} speed={0} style={{ zIndex: 1 }}>
                 <div >
            <Section3 />
            </div>
          </ParallaxLayer>
           <div className='pageOffset' >
            {/* <Page offset={2} gradient="" onClick={() => scroll(3)} /> */}
              </div>

               <ParallaxLayer offset={3}   speed={0} style={{ zIndex: 1 }}>
            <Section6 />
          </ParallaxLayer>
           <div className='pageOffset' >
            {/* <Page offset={3} gradient="" onClick={() => scroll(4)} /> */}
              </div>

                 <ParallaxLayer offset={4}  speed={0} style={{ zIndex: 1 }}>
                   <Section7 />
          </ParallaxLayer>
           <div className='pageOffset' >
            <Page offset={4} gradient="" onClick={() => scroll(0)} />
              </div>
 <ParallaxLayer offset={5}style={{backgroundColor:'black', zIndex: 1}}  speed={0}>
            <Footer />
                  
          </ParallaxLayer>
           <div className='pageOffset' >
            <Page offset={5} gradient="" onClick={() => scroll(0)} />
              </div>



          {/* <ParallaxLayer style={{backgroundColor:'green'}} offset={2} speed={0.3}>
            < FlipclubNum/>
          </ParallaxLayer> */}
          {/* <Page offset={2} gradient="teal" onClick={() => scroll(3)} /> */}

      {/* PAGE 3 - Unique content */}

        {/* <ParallaxLayer offset={3} speed={0.4}>
              <Section3 
                allMission={allMission}
                setAllMission={setAllMission}
                displayedMission={displayedMission}
                setDisplayedMission={setDisplayedMission}
                error={error}
                setError={setError}
              />
                <div className={styles.container}>
                </div>
        </ParallaxLayer> */}
        {/* <Page offset={2} gradient="tomato" onClick={() => scroll(4)} /> */}

      {/* PAGE 4 - Unique content */}

        {/* <ParallaxLayer offset={4} speed={0.5}>
              <Section4 
                allMember={allMember}
                setAllMember={setAllMember}
                displayedMember={displayedMember}
                setDisplayedMember={setDisplayedMember}
                error={error}
                setError={setError}
                />
        </ParallaxLayer> */}
         {/* <div className='pageOffset'>
        <Page offset={4} gradient=''  onClick={() => scroll(5)} />
      </div> */}
      {/* PAGE 5 - Unique content */}

        {/* <ParallaxLayer offset={5} speed={0.6}>
              <Section5 
                onContentLoad={handleContentLoad}
                allEvents={allEvents}
                setAllEvents={setAllEvents}
                displayedEvents={displayedEvents}
                setDisplayedEvents={setDisplayedEvents}
                startingIndex={startingIndex}
                setStartingIndex={setStartingIndex}
                loading={loading}
                setLoading={setLoading}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpended}
                error={error}
                setError={setError}
              />
          </ParallaxLayer>
           <div className='pageOffset'>
          <Page offset={5}  gradient='' onClick={() => scroll(7)} />
            </div> */}
      {/* page6 footer for button */}
      
          {/* <ParallaxLayer className='load' offset={6} speed={0.6} // Slightly below content
            // Scrolls slower than content
                factor={0.2} // Takes 20% of vertical space
                style={{
                pointerEvents: 'auto',
                zIndex: 20,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                paddingBottom: '5vh'
            }}>
            <LoadMoreButton 
              loadMoreEvents={loadMoreEvents}
              hasMoreEvents={hasMoreEvents}
            />
          </ParallaxLayer> */}
        {/* <Page offset={6} gradient="gold" onClick={() => scroll()} /> */}

      {/* PAGE 5 - Unique content */}
          {/* <ParallaxLayer offset={7} speed={0.7}>
            <Section6 />
          </ParallaxLayer>
           <div className='pageOffset'>
            <Page offset={7} gradient='' onClick={() => scroll(8)} />
            </div> */}
      {/* PAGE 6 - Unique content */}
          {/* <ParallaxLayer offset={8} speed={0.2}>
            <Footer />
          </ParallaxLayer>
           <div className='pageOffset'>
            <Page offset={8} gradient='' onClick={() => scroll(0)} />
            </div> */}
      </Parallax>
    </div>
  );
}