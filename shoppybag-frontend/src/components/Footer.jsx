// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-light text-center text-muted py-4 mt-5">
      <div className="container">
        <small>
          &copy; {new Date().getFullYear()} ShoppyBag. All rights reserved.
        </small>
      </div>
    </footer>
  );
}
