import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api
      .get(`/product/${id}`)
      .then((res) => {
        // adapt to your ApiResponse shape
        setProduct(res.data.data || res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <div className="container py-4">Loading...</div>;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-6">
          <img
            src={
              product.productImage && product.productImage.length
                ? product.productImage[0].imageUrl
                : "/placeholder.png"
            }
            className="img-fluid"
            alt={product.name}
          />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <h4>₹{product.price}</h4>
          {/* Add variants selection / add to cart button */}
        </div>
      </div>
    </div>
  );
}
