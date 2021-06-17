import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import {Link} from 'react-router-dom';
class Nav extends Component {

  render() {

    return (
  <div class="navigation-bar w-100" style={{fontSize: "20px", marginTop: "-30px"}}>
  <div class="mx-auto" style={{width: "1080px"}}>
    <nav class="navbar navbar-expand-lg navbar-light ">
      <Link style={{ textDecoration: 'none' }} to="/" onClick={() => {window.location.href="/"}} ><a class="navbar-brand" href="#" style={{fontFamily: '"Sansita Swashed", cursive', fontSize: 'xx-large'}}>Heirloom</a><span class="badge badge-primary" >beta</span></Link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="nav navbar-nav ml-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">Home</a>
          </li>
          <li class="nav-item">
            <Link style={{ textDecoration: 'none' }} to="/projects"><a class="nav-link" href="#">Projects</a></Link> 
          </li>
          <li class="nav-item">
            <Link style={{ textDecoration: 'none' }} to="/nfts"><a class="nav-link" href="#">NFTs</a></Link> 
          </li>
          <li class="nav-item">
            <Link style={{ textDecoration: 'none' }} to="/profile"><a class="nav-link" href="#">Profile</a></Link> 
          </li>
          <li class="nav-item">
            <Link style={{ textDecoration: 'none' }} to="/mint"><a class="nav-link" href="#">Mint</a></Link> 
          </li>
        </ul>
        </div>
    </nav>
  </div>
</div>
    );
  }
}

export default Nav;