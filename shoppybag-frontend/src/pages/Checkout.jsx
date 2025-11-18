import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Extract order details passed from Cart page
  const orderId = state?.orderId;
  const amount = state?.amount;

  useEffect(() => {
    if (!orderId || !amount) {
      alert("Invalid Order! Redirecting...");
      navigate("/cart");
    }
  }, [orderId, amount, navigate]);

  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => alert("Razorpay SDK failed to load.");
    document.body.appendChild(script);

    script.onload = async () => {
      const options = {
        key: "rzp_test_xxxxxxxx", // Replace with your Razorpay Key
        amount: amount * 100,
        currency: "INR",
        name: "ShoppyBag",
        description: "Order Payment",
        order_id: orderId,
        image: "/logo.png",

        handler: function (response) {
          navigate("/payment-success", { state: response });
        },

        prefill: {
          name: "Purna (User)",
          email: "purna@example.com",
          contact: "9999999999",
        },

        theme: {
          color: "#0d6efd",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    };
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0">
            <div className="card-body text-center p-4">
              <h3 className="mb-3 fw-bold text-primary">Checkout</h3>

              <p className="text-muted">
                Confirm your order and proceed to secure payment.
              </p>

              {/* Order Summary */}
              <div className="mt-4 mb-4">
                <h5 className="fw-semibold">Order Summary</h5>
                <div className="d-flex justify-content-between mt-3">
                  <span>Order ID:</span>
                  <strong>{orderId}</strong>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span>Total Amount:</span>
                  <strong>₹ {amount}</strong>
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg w-100 mt-3"
                onClick={loadRazorpay}
              >
                Pay ₹{amount} Securely
              </button>

              <button
                className="btn btn-outline-secondary w-100 mt-3"
                onClick={() => navigate("/cart")}
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
