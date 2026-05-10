import React, { useState } from "react";

const API_BASE = "";

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      (data && data.message) ||
      (data && data.error) ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export  function ApiTest() {
  const [email, setEmail] = useState("test@estore.com");
  const [password, setPassword] = useState("password");
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || "");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const run = async (fn) => {
    setError("");
    setResult(null);
    try {
      const data = await fn();
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  const login = () =>
    run(async () => {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (data?.userId) {
        localStorage.setItem("userId", String(data.userId));
        setUserId(String(data.userId));
      }
      return data;
    });

  const loadCategories = () => run(() => api("/api/categories"));
  const loadProducts = () => run(() => api("/api/products"));
  const loadProductDetail = () => run(() => api("/api/products/1"));

  const loadCart = () =>
    run(() => {
      if (!userId) throw new Error("Login first to get a userId");
      return api(`/api/cart/${userId}`);
    });

  const addToCart = () =>
    run(() => {
      if (!userId) throw new Error("Login first to get a userId");
      return api("/api/cart/add", {
        method: "POST",
        body: JSON.stringify({
          userId: Number(userId),
          productId: 1,
          quantity: 1,
        }),
      });
    });

  const placeOrder = () =>
    run(() => {
      if (!userId) throw new Error("Login first to get a userId");
      return api("/api/orders", {
        method: "POST",
        body: JSON.stringify({ userId: Number(userId) }),
      });
    });

  const loadOrders = () =>
    run(() => {
      if (!userId) throw new Error("Login first to get a userId");
      return api(`/api/orders/user/${userId}`);
    });

  const createReview = () =>
    run(() =>
      api("/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          productId: 1,
          userId: Number(userId || 1),
          authorName: "React Tester",
          rating: 5,
          comment: "Great product",
        }),
      })
    );

  const loadReviews = () => run(() => api("/api/reviews/product/1"));

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h1>E-Store API Test</h1>
      <p>Use this page to verify backend data before building the real UI.</p>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h2>Login</h2>
          <div style={{ display: "grid", gap: 8 }}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
            />
            <button onClick={login}>Login</button>
            <div>Current userId: {userId || "none"}</div>
          </div>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h2>Catalog</h2>
          <div style={{ display: "grid", gap: 8 }}>
            <button onClick={loadCategories}>Load categories</button>
            <button onClick={loadProducts}>Load products</button>
            <button onClick={loadProductDetail}>Load product 1 detail</button>
          </div>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h2>Cart and Orders</h2>
          <div style={{ display: "grid", gap: 8 }}>
            <button onClick={addToCart}>Add product 1 to cart</button>
            <button onClick={loadCart}>Load cart</button>
            <button onClick={placeOrder}>Place order</button>
            <button onClick={loadOrders}>Load orders</button>
          </div>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h2>Mongo Reviews</h2>
          <div style={{ display: "grid", gap: 8 }}>
            <button onClick={createReview}>Create review for product 1</button>
            <button onClick={loadReviews}>Load reviews for product 1</button>
          </div>
          <p style={{ fontSize: 12, color: "#666" }}>
            Reviews require the backend to run with the mongo profile.
          </p>
        </div>
      </div>

      {error ? (
        <pre style={{ marginTop: 24, background: "#ffecec", color: "#a40000", padding: 16, borderRadius: 8 }}>
          {error}
        </pre>
      ) : null}

      {result ? (
        <pre style={{ marginTop: 24, background: "#f6f8fa", padding: 16, borderRadius: 8, overflowX: "auto" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}