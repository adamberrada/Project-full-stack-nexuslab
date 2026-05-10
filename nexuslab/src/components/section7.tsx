import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlay } from '@fortawesome/free-brands-svg-icons';
// styles
import '../styles_module/section7.css';
import manimge from '../new beta images/man-with-phone.webp';




export function Section7() {
    return (
      <div className='section7-container'>
        <img className='manimage' src={manimge} data-aos="fade-left" />
        <div className='pillerss7 p71'></div>
        <div className='pillerss7 p72'></div>
        <div className='pillerss7 a71'></div>
        <div className='pillerss7 a72'></div>

        <div className='wrappers7'>
        <div className='insdie-wrapper7' data-aos="fade-up">
          <div className='tags7'>
          <div className='dot-tag'></div>
          <span className='dottags3'>Download Now</span>
        </div>
          <div className='tags7-header'>Manage to play your favourite games from mobile device</div>
        </div>
        <div className='insdie-wrapper7' data-aos="fade-up" data-aos-delay="200">
          <div className='contents7'>Play On The Go. Don’t be tied to your desk. Our mobile-optimized platform lets you browse, buy, and activate keys instantly from any device. Manage your collection and start playing in seconds, whether you’re commuting or relaxing at home.</div>
          <div className='button-content7'>
            <FontAwesomeIcon className='iconPlayStore' icon={faGooglePlay} />
            <div className='playStoreFont'>Play Store</div>
          </div>
        </div>
      

        </div>
       
      </div>
    )
  
  }