import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";

const statusLabels = {
  pending: "Order received",
  confirmed: "Confirmed",
  dispatched: "Dispatched",
  in_transit: "In transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const getTrackingSteps = (shipmentStatus) => {
  const statusKey = shipmentStatus || "pending";
  const rank = {
    pending: 0,
    confirmed: 1,
    dispatched: 2,
    in_transit: 3,
    delivered: 4,
    cancelled: 0,
  }[statusKey] ?? 0;

  const steps = [
    { label: "Order Confirmed", done: rank >= 1 },
    { label: "Order Packed", done: rank >= 2 },
    { label: "Package Shipped", done: rank >= 3 },
    { label: "Out For Delivery", done: rank >= 4 },
    { label: "Order Delivered", done: rank >= 5 },
  ];

  return steps;
};

const formatAddress = (address) => {
  if (!address) return "Address not provided";

  const parts = [address.line1, address.city, address.state, address.postalCode]
    .filter(Boolean);

  return parts.join(", ");
};

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("dhaaga-token") || localStorage.getItem("dhaaga-token");
    if (!token) {
      navigate("/auth?mode=login", { replace: true });
      setIsLoading(false);
      setError("Please sign in to view your orders.");
      return;
    }

    apiRequest("/support/customer")
      .then((result) => setOrders(result.requests || []))
      .catch((requestError) => {
        setError(requestError.message || "Please sign in to view your orders.");
        if (requestError.message?.toLowerCase().includes("authorized") || requestError.message?.toLowerCase().includes("token") || requestError.message?.toLowerCase().includes("invalid")) {
          sessionStorage.removeItem("dhaaga-token");
          localStorage.removeItem("dhaaga-token");
          localStorage.removeItem("dhaaga-user");
          navigate("/auth?mode=login", { replace: true });
        }
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  return (
    <main style={{ maxWidth: "980px", margin: "0 auto", padding: "55px 20px", color: "#3d2314" }}>
      <p className="eyebrow">YOUR DHAAGA ORDERS</p>
      <h1 style={{ marginTop: 0, marginBottom: "8px" }}>Track your orders</h1>
      <p style={{ marginTop: 0, color: "#5b4338" }}>Follow the delivery progress of the handcrafted work you have requested.</p>

      {isLoading && <p>Loading your orders...</p>}
      {error && <p style={{ color: "#a12622" }}>{error}. Please sign in to view your orders.</p>}
      {!isLoading && !error && orders.length === 0 && <p>No orders found for this account.</p>}

      <div style={{ display: "grid", gap: "18px", marginTop: "28px" }}>
        {orders.map((order) => {
          const statusText = statusLabels[order.shipmentStatus] || order.shipmentStatus || "Order received";
          const craftName = order.artisan?.craftType || order.craftType || "Handcrafted item";
          const customerName = order.contactName || "Not provided";
          const customerEmail = order.contactEmail || "Not provided";
          const customerPhone = order.contactPhone || "Not provided";
          const customerAddress = formatAddress(order.deliveryAddress);
          const trackingSteps = getTrackingSteps(order.shipmentStatus);

          return (
            <article
              key={order._id}
              style={{
                border: "1px solid #d8c7b0",
                background: "#f2ebdf",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(61,35,20,0.05)",
              }}
            >
              <div style={{
                background: "#3a3a3a",
                color: "#fff",
                fontWeight: 700,
                padding: "16px 20px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: "18px",
              }}>
                Follow your order
              </div>

              <div style={{ padding: "20px 26px 26px" }}>
                <div style={{ marginBottom: "18px" }}>
                  <p style={{ margin: 0, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#7b5a40" }}>Order</p>
                  <h2 style={{ margin: "6px 0 0 0", fontSize: "26px", lineHeight: 1.2 }}>{craftName}</h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0", marginTop: "8px" }}>
                  {trackingSteps.map((step, index) => {
                    const isActive = step.done;
                    const isLast = index === trackingSteps.length - 1;

                    return (
                      <div key={step.label} style={{ display: "flex", alignItems: "center", minHeight: "58px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "42px" }}>
                          <div
                            style={{
                              width: "22px",
                              height: "22px",
                              borderRadius: "50%",
                              background: isActive ? "#2fbf71" : "#d9d2c8",
                              border: isActive ? "3px solid #7ae2a3" : "3px solid #b7ad9c",
                              boxShadow: isActive ? "0 0 0 2px rgba(47,191,113,0.14)" : "none",
                              position: "relative",
                              zIndex: 2,
                            }}
                          >
                            {isActive && (
                              <span style={{ display: "block", color: "#fff", fontSize: "12px", lineHeight: "18px", textAlign: "center" }}>✓</span>
                            )}
                          </div>
                          {!isLast && (
                            <div
                              style={{
                                width: "3px",
                                height: "32px",
                                background: isActive ? "#2fbf71" : "#d9d2c8",
                                marginTop: "2px",
                                borderRadius: "999px",
                              }}
                            />
                          )}
                        </div>

                        <div
                          style={{
                            marginLeft: "14px",
                            fontSize: "18px",
                            color: isActive ? "#1d2f20" : "#7a6656",
                            fontWeight: isActive ? 600 : 500,
                          }}
                        >
                          {step.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px", marginTop: "26px" }}>
                  <div>
                    <p style={{ margin: "0 0 8px 0", fontSize: "16px" }}><strong>Customer name:</strong> {customerName}</p>
                    <p style={{ margin: "0 0 8px 0", fontSize: "16px" }}><strong>Email:</strong> {customerEmail}</p>
                    <p style={{ margin: 0, fontSize: "16px" }}><strong>Phone:</strong> {customerPhone}</p>
                  </div>

                  <div>
                    <p style={{ margin: "0 0 8px 0", fontSize: "16px" }}><strong>Address:</strong> {customerAddress}</p>
                    <p style={{ margin: "0 0 8px 0", fontSize: "16px" }}><strong>Ordered on:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p style={{ margin: 0, fontSize: "16px" }}><strong>Artisan:</strong> {order.artisan?.name || "Not provided"}</p>
                  </div>
                </div>

                {order.deliveryPartner && (
                  <p style={{ marginBottom: 0, marginTop: "18px", fontSize: "16px" }}><strong>Delivery partner:</strong> {order.deliveryPartner}</p>
                )}
                {order.trackingNumber && (
                  <p style={{ marginTop: "8px", marginBottom: 0, fontSize: "16px" }}><strong>Tracking number:</strong> {order.trackingNumber}</p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

export default Orders;
