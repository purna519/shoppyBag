import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api
      .get("/product/fetchallProducts")
      .then((res) => {
        if (res?.data?.data) setProducts(res.data.data);
        else setProducts(res.data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container py-4">
      <h3>Products</h3>
      <div className="row">
        {products.map((p) => (
          <div className="col-md-4 mb-3" key={p.id}>
            <div className="card h-100">
              <img
                src={
                  p.productImage && p.productImage.length
                    ? p.productImage[0].imageUrl
                    : "/placeholder.png"
                }
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text text-truncate">{p.description}</p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <strong>₹{p.price}</strong>
                  <Link
                    to={`/product/${p.id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
