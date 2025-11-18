import React from "react";
import { useLocation, Link } from "react-router-dom";

const PaymentSuccess = () => {
  const { state } = useLocation();

  return (
    <div className="container text-center py-5">
      <h2 className="text-success fw-bold">Payment Successful!</h2>
      <p className="mt-3">Thank you for your purchase.</p>

      <div
        className="card shadow p-4 mx-auto mt-3"
        style={{ maxWidth: "500px" }}
      >
        <h5>Payment Details</h5>
        <p>
          <strong>Payment ID:</strong> {state?.razorpay_payment_id}
        </p>
        <p>
          <strong>Order ID:</strong> {state?.razorpay_order_id}
        </p>
        <p>
          <strong>Signature:</strong> {state?.razorpay_signature}
        </p>
      </div>

      <Link to="/" className="btn btn-primary mt-4">
        Go to Home
      </Link>
    </div>
  );
};

export default PaymentSuccess;
