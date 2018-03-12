import React from 'react';
import { Link } from 'react-router-dom';

export const Header = () => (
  <div>
    <header className="blog-header py-3">
      <div className="row flex-nowrap justify-content-between align-items-center">
        <div className="col-4 pt-1 text-center">

        </div>
        <div className="col-4 text-center">
          <a className="blog-header-logo text-dark" href="">HCL-ERS Project</a>
        </div>
        <div className="col-4 d-flex justify-content-end align-items-center">

        </div>
      </div>
    </header>
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
          <li className="nav-item" >
            <Link className="nav-link text-white" to="/">Home</Link>
          </li>
          <li className="nav-item" >
            <Link className="nav-link text-white" to="/train-live-status">Live Status</Link>
          </li>
          <li className="nav-item" >
            <Link className="nav-link text-white" to="/pnr-status">PNR Status</Link>
          </li>
          <li className="nav-item" >
            <Link className="nav-link text-white" to="/train-between-stations">Train Between Station</Link>
          </li>
        </ul>
      </div>
    </nav>
  </div>

)