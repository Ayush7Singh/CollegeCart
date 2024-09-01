import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";


const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>College Cart</h1>
        <p>Customer Satisfaction is our first priority</p>

        <p>Copyrights 2023 &copy; Ayush Singh</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        
        <a href="https://www.instagram.com/_ayush_._05_/"><InstagramIcon className="instagramSvgIcon" /> &nbsp;Instagram</a>
        
        <a href="https://www.youtube.com/@AyushSingh-vs5cu"><YouTubeIcon className="youtubeSvgIcon" /> &nbsp;Youtube</a>
       
      </div>
    </footer>
  );
};

export default Footer;
