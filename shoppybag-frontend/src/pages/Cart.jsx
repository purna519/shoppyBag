import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    api
      .get("/cart") // your endpoint to fetch cart
      .then((res) => setCart(res.data.data || res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!cart) return <div className="container py-4">Cart is empty.</div>;

  return (
    <div className="container py-4">
      <h3>Your Cart</h3>
      <div className="list-group">
        {cart.items &&
          cart.items.map((item) => (
            <div
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <div>
                  <strong>
                    {item.productVariant?.product?.name || item.product?.name}
                  </strong>
                </div>
                <div>Qty: {item.quantity}</div>
              </div>
              <div>
                <strong>₹{item.price * item.quantity}</strong>
              </div>
            </div>
          ))}
      </div>

      <div className="mt-4">
        <Link className="btn btn-success" to="/checkout">
          Checkout
        </Link>
      </div>
    </div>
  );
}
