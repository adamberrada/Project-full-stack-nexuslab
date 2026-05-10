import React, { useEffect, useRef, useState } from 'react'
import useMeasure from 'react-use-measure';
import { useDrag } from 'react-use-gesture';
import clamp from 'lodash.clamp';
// import arrow from '../image/previous.png';
// styles
import '../styles_module/section4.css';
import styles from '../styles_module/styles.module.css';
import brown from '../V/megaV1.mp4';
// import blue from '../V/megaV2.mp4';
import fire from '../V/megaV3.mp4';


//dont forget to add comment for better code understanding

//creating initerface for for member
  interface Member {
      id: number;
      title : string;
      description: string;
      image : string;
    }

    interface PropsMember {
        allMember : Member[];
        
        setAllMember : (mission : Member[]) => void;
        displayedMember : Member[];
        setDisplayedMember : (member :  Member[]) => void;
        
        error : string | null ;
        setError : (error : string) => void;
      }

    export function Section4({
        allMember,
        setAllMember,
        displayedMember,
        setDisplayedMember,
        error,
        setError
      } : PropsMember ) {
  
    const index = useRef(0)
    const [ref, { width }] = useMeasure()
    const [positions, setPositions] = useState(() =>
      displayedMember.map((_, i) => ({
        x: i * width,
        scale: 1,
        opacity: 1, // New: control opacity
        zIndex:  displayedMember.length - i, // New: reverse z-index
        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
      }))
    );
        const [isDragging, setIsDragging] = useState(false)
          const velocity = useRef(0)
          // const animationRef = useRef()
        
          useEffect(() => {
            fetch('/member.json')
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then((data: { data: Member[] }) => {
                setAllMember(data.data);
                setDisplayedMember(data.data);
                // setLoading(false);
              })
              .catch((error: Error) => {
                setError(error.message);
                // setLoading(false);
              });
          }, [setAllMember, setDisplayedMember, setError]);
          
          const bind = useDrag(({ active, movement: [mx], direction: [xDir], distance, cancel, velocity: vx }) => {
            if (active) {
              if (distance > width / 2) {
                index.current = clamp(index.current + (xDir > 0 ? -1 : 1), 0,  displayedMember.length - 1)
                cancel()
              }
              velocity.current = vx * xDir
              setIsDragging(true)
            } else {
              setIsDragging(false)
              // Apply momentum based on swipe velocity
              if (Math.abs(velocity.current) > 0.2) {
                index.current = clamp(index.current - Math.sign(velocity.current), 0,  displayedMember.length - 1)
              }
            }
          // if (loading) return <div>Loading...</div>;
            if (error) return <div>Error: {error}</div>;
            if (!allMember) return <div>No events found</div>;
          setPositions(positions.map((pos, i) => {
            const x = (i - index.current) * width + (active ? mx : 0);
            const scale = active ? 1 - distance / width / 3 : 1; // Reduced scale effect
            const opacity = Math.min(1, 1.5 - Math.abs(i - index.current) * 0.3); // Gradual opacity
            return { 
              x, 
              scale, 
              opacity,
              zIndex:  displayedMember.length - Math.abs(i - index.current), // Dynamic z-index
              transition: active ? 'none' : 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
            };
          }));
        });
        const handleNextClick = () => {
          // Update index (same logic as your drag threshold)
          index.current = clamp(index.current + 1, 0,  displayedMember.length - 1);
          
          // Manually trigger position updates (like drag release)
          setPositions( displayedMember.map((_, i) => ({
            x: (i - index.current) * width, // No mx (not dragging)
            scale: 1, // Reset scale (not dragging)
            opacity: Math.min(1, 1.5 - Math.abs(i - index.current) * 0.3),
            zIndex:  displayedMember.length ,
            transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)', // Smooth transition
          })));
        };
        const handlePrevClick = () => {
          // Update index (same logic as your drag threshold)
          index.current = clamp(index.current - 1, 0,  displayedMember.length - 1);
          
          // Manually trigger position updates (like drag release)
          setPositions( displayedMember.map((_, i) => ({
            x: (i - index.current) * width, // No mx (not dragging)
            scale: 1, // Reset scale (not dragging)
            opacity: Math.min(1, 1.5 - Math.abs(i - index.current) * 0.3),
            zIndex:  displayedMember.length ,
            transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)', // Smooth transition
          })));
        };
        
        useEffect(() => {
          setPositions( displayedMember.map((_, i) => ({
            x: i * width,
            scale: 1,
            opacity: 1,
            zIndex:  displayedMember.length - i,
            transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
          })));
        }, [width,  displayedMember]);
  
    return (
            <div className='section4-container'>
               {/* <video   className='section4_video'
                        autoPlay
                        loop
                        muted
                        playsInline 
                        >
                          <source src={blue} type="video/mp4" />
                      </video> */}
              <div className='header-inside-section4' data-aos="fade-up">
                <div>
                <p className='p1_child_section4'>TEAM</p>
                  <h1 className="p1-inside-section4-header">Innovators at Work: Meet the Enactus Team</h1>
                  <p className='p2_child_section4'>Behind every success is a team of visionaries. Meet the leaders and game-changers.</p>
                </div>
                <div>
                    <a style={{textDecoration: "none", color:"black"}} href='https://enactus-morocco.org/'>
                      <button className='btn-5'>Discover more</button>
                    </a>
                </div>
              </div>
              <button
                onClick={handleNextClick}
                className={styles.nextButton}
                aria-label="Next item"
                >
                  <img 
                  // src={arrow}
                   alt=''/>/
                  </button>
                  <button
                onClick={handlePrevClick}
                className={styles.prevButton}
                aria-label="Next item"
                >
                  <img 
                  // src={arrow}
                   alt=''/>
                </button>
            <div ref={ref} className={styles.wrapper}>
            {positions.map(({ x, scale, opacity, zIndex, transition }, i) => (
  
          <div
              {...bind()}
                  key={displayedMember[i].id}
                  className={styles.page}
                  style={{
                  display: opacity ? 'block' : 'none',
                  transform: `translateX(${x}px)`,
                  zIndex,
                  transition,
            }}
            >
                <div
                  style={{
                  // backgroundImage: `url(${pages[i]})`,
                  transform: `scale(${scale})`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out',
              }}
            >
                  <div className='header2-inside-section4'>
                    <div className="card" data-aos="fade-up"
                    style={{
                      // '--hover-logo': `url(${displayedMission[i].logo})`
                    } as React.CSSProperties}>
                      <span style={{color: "white"}}>
                      </span>
                    <div className="card-inner">
                    <div className="card-front">
                      <img src={displayedMember[i].image} alt='' />
                  </div>
                    <div className="card-back hvr-sweep-to-right">
                    <div>{displayedMember[i].title}</div>
                    <p>{displayedMember[i].description}</p>
                     </div>
                  {/* <a href={displayedMission[i].url}>{displayedMission[i].more}</a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>
    )
  }
