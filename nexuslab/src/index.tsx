// import * as React from 'react'
// import ReactDOM from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom';
// import App from './App'
// import './index.css'

// const rootElement = document.getElementById('root')!

// ReactDOM.createRoot(rootElement).render(
//   <BrowserRouter>
//   <App />
// </BrowserRouter>
// )
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App';
import { SignUp } from './components/SignUp';
// import { ApiTest } from './components/ApiTest';
import reportWebVitals from './reportWebVitals';
import { LoginPage } from './components/LoginPage';
import { ProfilePage } from './components/ProfilePage';
import { CartPage } from './components/CartPage';
import { OrdersPage } from './components/OrdersPage';
import { CatalogSection } from './components/catalog-section';
import { ValidationPage } from './components/ValidationPage';
import { ProductReview } from './components/ProductReview';



const router = createBrowserRouter([
  {
    path: "/",
    element : <App />
  },
    
  {
    path: "/signup",
    element : <SignUp />
  }, 

  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/catalog",
    element : <CatalogSection />
  }, 



  {
    path: "/profile",
    element: <ProfilePage />
  },
  {
 path: "/productReview",
    element: <ProductReview />
  },

  {
    path: "/cart",
    element: <CartPage />
  },

  {
    path: "/orders",
    element: <OrdersPage />
  },
 
  {
    path: "/validation",
    element : <ValidationPage />
  },
  
 
])
const rootElement = document.getElementById('root')!
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

