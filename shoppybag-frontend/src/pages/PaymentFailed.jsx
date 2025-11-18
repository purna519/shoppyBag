import React from "react";
import { Link } from "react-router-dom";

const PaymentFailed = () => {
  return (
    <div className="container text-center py-5">
      <h2 className="text-danger fw-bold">Payment Failed!</h2>
      <p className="mt-3">Something went wrong. Please try again.</p>

      <Link to="/checkout" className="btn btn-primary mt-4">
        Try Again
      </Link>
    </div>
  );
};

export default PaymentFailed;
