import React, { useEffect, useRef, useState } from 'react'
// import Player2 from '../V/official trailer.mp4' // or correct relative path
// styles
import '../styles_module/section5.css';


// section5 typeScript

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
  
  interface Section5Props {
    onContentLoad?: (height: number) => void;
    allEvents: Event[];
    setAllEvents: (events: Event[]) => void;
    displayedEvents: Event[];
    setDisplayedEvents: (events: Event[]) => void;
    startingIndex: number;
    setStartingIndex: (index: number) => void;
    isExpanded : boolean;
    setIsExpanded : (isExpanded : boolean) => void;
    loading : boolean;
    setLoading : (loading : boolean) => void;
    error : string | null ;
    setError : (error : string) => void;
  }
  
  export function Section5( {
    onContentLoad,
    allEvents,
    setAllEvents,
    displayedEvents,
    setDisplayedEvents,
    startingIndex,
    setStartingIndex,
    isExpanded,
    setIsExpanded,
    loading,
    setLoading,
    error,
    setError
  } 
    : Section5Props ) {
  
    const containerRef = useRef<HTMLDivElement>(null);
  
   
  
    // const displayData = ()
  
    useEffect(() => {
      if (containerRef.current && onContentLoad) {
        const calculateHeight = () => {
          const height = containerRef.current?.scrollHeight || 0;
          onContentLoad(height);
        };
    
        const observer = new ResizeObserver(calculateHeight);
        observer.observe(containerRef.current);
        
        // Initial calculation
        calculateHeight();
        
        return () => observer.disconnect();
      }
    }, []); // Re-run when content changes
  
   
   
    // useEffect(() => {
    //   fetch('/events.json')
    //     .then(response => {
    //       if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //       }
    //       return response.json();
    //     })
    //     .then((data: { data: Event[] }) => {
    //       setAllEvents(data.data);
    //       setDisplayedEvents(data.data.slice(0, 3));
    //       setLoading(false);
    //     })
    //     .catch((error: Error) => {
    //       setError(error.message);
    //       setLoading(false);
    //     });
    // }, [])
  
  
  
  
    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error}</div>;
    // if (!allEvents) return <div>No events found</div>;
  
    return (
      <div 
      ref={containerRef} 
      className='section5-container'
      // style={{ minHeight: `${Math.max(300, (displayedEvents.length / 3) * 100)}vh` }}
      >
        <div className='header-inside-section5' data-aos="fade-up">
          <div>
            <p className='p1_child_section5'>Upcoming Events</p>
            <h1>Discover Our Latest Events</h1>
            <p>Discover our milestones, achievements, and the collaborative spirit that drives our success.</p>
          </div>
        </div>
        
        <div className={`header2-inside-section5 ${isExpanded ? 'expanded' : ''}`}>
          {/* <div className='div-child-header2-section5'> */}
            {/* {displayedEvents.map((event) => (
              <div className="event-card" key={event.id}>
                { event.date.length > 0 &&  (
                <div className='event-date'>
                  <div className='day'>{event.date[0].date_day}</div>
                  <div className='num'>{event.date[0].date_dayNum}</div>
                  <div className='monthYear'>{event.date[0].date_monthAndYear}</div>
                </div>
                  )}
                <img src={event.image} alt={event.title} />
                <div className="div-child-header2-section5-inside">
                  <div className='event-categorie'>{event.categorie}</div>
                  <p className='event-header'>{event.title}</p>
                  
                  <p className='event-decription'>{event.description}</p>
                  {event.quote && <div className="event-quote">"{event.quote}"</div>}
                  <div className='event-more'>{event.more}</div>
                </div>
              </div>
              
            ))} */}
          {/* </div> */}
       
        </div>
        
      
        
      <div>
      <hr className='hr1'></hr>
      <div data-aos="fade-up">Our Club </div>
      </div>
      </div>
    );
  
  
  }
  
  export function LoadMoreButton(
    {loadMoreEvents,
      hasMoreEvents
    } :
     {
      loadMoreEvents: () => void;
      hasMoreEvents: boolean;
     }) {
    return (
      <div className='section5-footer' >
      {hasMoreEvents && (
        <button className='section5-footer-button btn-5' onClick={loadMoreEvents}>See all events</button>
      )}
         <div className='header3-inside-section5' data-aos="fade-up">
       
          <div>
            <p>
            Enactus FSBM, fondée en mars 2014 par Abderazak Bouhram, est
        l'héritière d'initiatives lancées en 2009 sous l'appellation SIFE. Depuis sa
        création, l’équipe développe des projets à impact social et économique,
        mobilisant chaque année 50 à 100 membres. Enactus FSBM a récemment
        été classée parmi le top 12 du Maroc et a été demi-finaliste lors des
        compétitions 2023-2024.
            </p>
        <span className='span_header5' >Learn more</span>
          </div>
        <video  className='video_trailer'  
         autoPlay
         loop
         muted
         playsInline
          >
          <source 
          // src={Player2}
           type="video/mp4" />
        </video>
        </div> 
    </div>
    )
  }