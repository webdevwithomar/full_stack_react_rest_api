import React from 'react';

const Header = () => {
  return (
    <div className="header">
      <div className="bounds">
        <h1 className="header--logo">Courses</h1>
        <nav><span>Welcome Joe Smith!</span><a className="signout" href="index.html">Sign Out</a></nav>
      </div>
    </div>
  )
}

export default Header;