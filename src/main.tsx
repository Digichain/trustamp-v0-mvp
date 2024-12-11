import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

console.log("Starting app initialization...");

// Initialize Buffer for browser environment
if (typeof window !== 'undefined') {
  console.log("Setting up Buffer polyfill...");
  window.Buffer = window.Buffer || require('buffer').Buffer;
}

// Create a client
console.log("Creating QueryClient...");
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

console.log("Starting React render...");
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
console.log("React render initiated.");