import React from 'react'
// styles
import '../styles_module/section3.css';




export function Section3() {

  const logoUrl = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/logo.svg` : '/logo.svg';
  const logoUrl1 = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/logo.svg` : '/soccerStd.svg';








    return (
      <div className='section3-container'>
        <div className='pillerss3 p1'></div>
        <div className='pillerss3 p2'></div>
        <div className='pillerss3 a1'></div>
        <div className='pillerss3 a2'></div>
        <div className='wrappers3'>
        <div className='insdie-wrapper3' data-aos="fade-right">
          <div className='tags3'>
          <div className='dot-tag'></div>
          <span className='dottags3'>Start your game</span>
        </div>
          <div className='tags3-header'>unlock you favourite games gems</div>
        </div>
        <div className='insdie-wrapper3' data-aos="fade-up" data-aos-delay="200">
          <div className='contents3'>Discover hidden indie treasures and AAA blockbusters at unbeatable prices. 
        Instant keys, secure delivery, and a library curated for true gamers.</div>
          <button  type="button" className="btn-epic" 
          // onClick={() => addToCart(activeProduct.id)}
          >
                <div>
                  <span>Order your game </span>
                  <span>Order your game </span>
                </div>
              </button>
        </div>
      

        </div>
       
      </div>
    )
  
  }