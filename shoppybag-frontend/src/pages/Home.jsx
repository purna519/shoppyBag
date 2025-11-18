import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container py-5">
      <div className="jumbotron p-5 bg-white shadow-sm rounded">
        <h1>Welcome to ShoppyBag</h1>
        <p>Your fashion store — clothes, accessories & more.</p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    </div>
  );
}
