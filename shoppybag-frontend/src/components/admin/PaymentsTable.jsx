// Payments Table Component
import React from 'react';

const PaymentsTable = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>No recent payments</p>;
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Order ID</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>#{payment.id}</td>
              <td>#{payment.orderId}</td>
              <td>₹{payment.amount}</td>
              <td>{payment.paymentMethod}</td>
              <td>
                <span className={`status-badge ${payment.paymentStatus?.toLowerCase()}`}>
                  {payment.paymentStatus}
                </span>
              </td>
              <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsTable;
