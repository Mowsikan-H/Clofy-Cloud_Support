import React, { createContext, useContext, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { api } from '../services/api';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', autoHide = true) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type, autoHide }]);
    
    if (autoHide) {
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    }
  };

  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const value = {
    addToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1060 }}>
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            onClose={() => removeToast(toast.id)} 
            bg={toast.type}
            className="text-white"
          >
            <Toast.Header closeButton>
              <strong className="me-auto">{toast.type === 'success' ? 'Success' : toast.type === 'danger' ? 'Error' : 'Notification'}</strong>
            </Toast.Header>
            <Toast.Body>{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}
