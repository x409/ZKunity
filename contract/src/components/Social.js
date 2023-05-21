import React from 'react'
import { FaInstagram, FaTwitter, FaSpotify } from 'react-icons/fa'
import 'bootstrap/dist/css/bootstrap.min.css'

const Social = () => {
  return (
    <div className='social'>
      <div className="socialBtns">
        <a href='https://www.marcebassy.com/about' target="_blank" rel="noreferrer noopener">
          <span className="spin">ABOUT</span>
        </a>
        <a  href= '/' target="_blank" rel="noreferrer noopener">
          <span className="spin">ROADMAP</span>
        </a>
        <a href='https://discord.gg/hUmjvUDF' target="_blank" rel="noreferrer noopener">
          <span className="spin">DISCORD</span>
        </a>
      </div>
      <div className="socialIcons">
        <a href='https://www.instagram.com/marcebassy/?hl=en' target="_blank" rel="noreferrer noopener">
         <FaInstagram className="icon"/>
        </a>
        <a  href= 'https://twitter.com/marcebassy' target="_blank" rel="noreferrer noopener">
          <FaTwitter className="icon"/>
        </a>
        <a href='https://open.spotify.com/artist/3tQx1LPXbsYjE9VwN1Peaa?autoplay=true&v=A' target="_blank" rel="noreferrer noopener">
          <FaSpotify className="icon"/>
        </a>
      </div>
    </div>
  )
}

export default Social