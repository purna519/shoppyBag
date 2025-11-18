import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    api
      .get("/orders/my") // change to your endpoint
      .then((res) => setOrders(res.data.data || res.data))
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className="container py-4">
      <h3>My Orders</h3>
      {orders.length === 0 && <div>No orders yet.</div>}
      {orders.map((o) => (
        <div className="card mb-2" key={o.id}>
          <div className="card-body d-flex justify-content-between">
            <div>Order #{o.id}</div>
            <div>
              Status: <strong>{o.status}</strong>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
