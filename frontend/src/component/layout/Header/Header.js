import React, { useState } from "react";
import {MdAccountCircle } from "react-icons/md";
import {MdSearch } from "react-icons/md";
import {MdAddShoppingCart } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { NavLink } from "react-router-dom";



const Header = () => {
  const [showMediaIcons, setShowMediaIcons] = useState(false);
  return (
    <>
      <nav className="main-nav">
        {/* 1st logo part  */}
        <div className="logo">
        <img className="img" src="https://res.cloudinary.com/dhwhucfhy/image/upload/v1690440118/logo_ddrvxd.png" />
       
        </div>

        {/* 2nd menu part  */}
        <div
          className={
            showMediaIcons ? "menu-link mobile-menu-link" : "menu-link"
          }>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/products">Products</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </ul>
        </div>

        {/* 3rd social media links */}
        <div className="social-media">
          <ul className={
            showMediaIcons ? "search social-media-desktop" : "social-media-desktop"}>
            
  
            <li>
            <NavLink to="/login"><MdAccountCircle className="facebook" /></NavLink>
              
            </li>
            <li>
            <NavLink to="/search"><MdSearch className="facebook" /></NavLink>
            </li>
            <li>
            <NavLink to="/cart"><MdAddShoppingCart className="facebook" /></NavLink>
            </li>
          </ul>

          {/* hamburget menu start  */}
          <div className="hamburger-menu">
            <a href="#" onClick={() => setShowMediaIcons(!showMediaIcons)}>
              <GiHamburgerMenu className="ham"/>
            </a>
          </div>
        </div>
      </nav>

     
    </>
  );
};

export default Header;
