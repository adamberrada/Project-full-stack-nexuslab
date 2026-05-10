import React from 'react'
// import Player from '../V/Stripes_2.mp4' // or correct relative path
// styles
import '../styles_module/section2.css';
import ImageLogo from "../image/soccerStdImage.png";
import { ReactComponent as Draw} from '../image/draw.svg'



export function Section2() {

  const logoUrl = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/logo.svg` : '/logo.svg';
  const logoUrl1 = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/logo.svg` : '/soccerStd.svg';








    return (
      <div className='section2-container'>
        <div className='wrapper'>
        <div data-aos="fade-left">
          <div className='tag'>
          <div className='dot-tag'></div>
          <span className='tagS'>Incredible features</span>
        </div>
          <div className='tag-header'>Premium Game Pack </div>
        </div>
        
        <div className='P2'>
          <div className='P2-inside' data-aos="fade-up">
          <div className='S2_C1_CC'>

            <div className='c1 N'>
            <svg width="164" height="164" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <path d="M12 20L28 4H52C54.2091 4 56 5.79086 56 8V36L40 52H16C13.7909 52 12 50.2091 12 48V20Z" stroke="#8b5cf6" stroke-width="3" filter="url(#glow-purple)"/>
  <circle cx="44" cy="16" r="3" fill="#8b5cf6"/>
  <path d="M28 32L36 40M36 32L28 40" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round" filter="url(#glow-purple)"/>
</svg>
             
            </div>
                    <div className='cc1'>
                  <div className='hc1' >EXCLUSIVE DISCOUNTS</div>
                  <div className='hc2' >Why pay full price? Get up to 70% off the latest AAA titles. Our system scans the market to guarantee you the lowest price, every single day.</div>
                </div>
          </div>
          </div>

        <div className='P2-inside' data-aos="fade-up">
          <div className='S2_C1_CC'>

            <div className='c1 N'>
            <svg width="164" height="164" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <path d="M32 8L20 28H32L28 48L44 24H32L36 8H32Z" stroke="#8b5cf6" stroke-width="3" stroke-linejoin="round" filter="url(#glow-purple)"/>
  <path d="M40 36C44 36 48 40 48 44C48 48 44 52 40 52C36 52 32 48 32 44C32 40 36 36 40 36Z" stroke="#8b5cf6" stroke-width="3" filter="url(#glow-purple)"/>
  <path d="M40 52V56M36 56H44" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round" filter="url(#glow-purple)"/>
</svg>


            </div>
                    <div className='cc1'>
                  <div className='hc1'>ACTIVATE IN 1 CLICK</div>
                  <div className='hc2'>No waiting. Receive your game key via email seconds after purchase. Start playing immediately—no delays, no hassle.</div>
                </div>
          </div>
          </div>
        <div className='P2-inside' data-aos="fade-up" >
          <div className='S2_C1_CC'>

            <div className='c1 N'>
          <svg width="164" height="164" viewBox="-10 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <path d="M32 8L52 16V32C52 44 44 54 32 58C20 54 12 44 12 32V16L32 8Z" stroke="#8b5cf6" stroke-width="3" filter="url(#glow-purple)"/>
  <path d="M24 32L30 38L42 26" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow-purple)"/>
</svg>
            </div>
                    <div className='cc1'>
                  <div className='hc1'>100% SAFE & GUARANTEED</div>
                  <div className='hc2'>Buy with confidence. Encrypted transactions and guaranteed keys. If a code fails, we replace it or refund you instantly. Zero risk.</div>
                </div>
          </div>
          </div>


             <div className='P2-inside'  data-aos="fade-down">
          <div className='S2_C1_CC'>

            <div className='c1 N'>
             <svg width="164" height="164" viewBox="-4 -5 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <rect x="12" y="8" width="40" height="12" rx="2" stroke="#8b5cf6" stroke-width="3" filter="url(#glow-purple)"/>
  <text x="16" y="17" font-family="monospace" font-size="6" fill="#8b5cf6">GAME 01</text>
  <rect x="12" y="22" width="40" height="12" rx="2" stroke="#8b5cf6" stroke-width="3" filter="url(#glow-purple)"/>
  <text x="16" y="31" font-family="monospace" font-size="6" fill="#8b5cf6">GAME 02</text>
  <rect x="12" y="36" width="40" height="12" rx="2" stroke="#8b5cf6" stroke-width="3" filter="url(#glow-purple)"/>
  <text x="16" y="45" font-family="monospace" font-size="6" fill="#8b5cf6">GAME 03</text>
  <path d="M52 8V48" stroke="#8b5cf6" stroke-width="3" filter="url(#glow-purple)"/>
  <path d="M12 8V48" stroke="#8b5cf6" stroke-width="3" filter="url(#glow-purple)"/>
</svg>
             
            </div>
                    <div className='cc1'>
                  <div className='hc1' >THOUSANDS OF GAMES</div>
                  <div className='hc2' >From retro classics to the latest blockbusters. FPS, RPG, Strategy, Indie—we have the largest selection of digital keys at the best prices.</div>
                </div>
          </div>
          </div>
</div>


















        
        </div>
         {/* <video   
          autoPlay
          loop
          muted
          playsInline 
          >
            <source 
            // src={Player}
             type="video/mp4" />
        </video> */}
      </div>
    )
  
  }