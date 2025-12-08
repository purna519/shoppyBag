import React from 'react';
import { useNotification } from '../hooks/useNotification';
import Toast from './Toast';

const ToastContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="toast-container">
      {notifications.map(notification => (
        <Toast
          key={notification.id}
          {...notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
