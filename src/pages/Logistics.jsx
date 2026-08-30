import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

const statuses = ["pending", "confirmed", "dispatched", "in_transit", "delivered", "cancelled"];

function Logistics() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadRequests = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await apiRequest("/support/logistics");
      setRequests(result.requests || []);
    } catch (requestError) {
      setError(requestError.message.includes("authorized")
        ? "Admin access required. Sign in with an admin account, then open this page again."
        : requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateRequest = async (request, field, value) => {
    try {
      const result = await apiRequest(`/support/${request._id}/logistics`, {
        method: "PATCH",
        body: JSON.stringify({
          shipmentStatus: field === "shipmentStatus" ? value : request.shipmentStatus || "pending",
          deliveryPartner: field === "deliveryPartner" ? value : request.deliveryPartner || "",
          trackingNumber: field === "trackingNumber" ? value : request.trackingNumber || "",
        }),
      });
      setRequests((previous) => previous.map((item) => item._id === request._id ? { ...item, ...result.request } : item));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "55px 20px", color: "#3d2314" }}>
      <p className="eyebrow">ADMIN OPERATIONS</p>
      <h1>Logistics tracking</h1>
      <p>Manage customer orders and delivery progress for artisan work.</p>
      {error && <p style={{ color: "#a12622" }}>{error}</p>}
      {isLoading && <p>Loading orders...</p>}
      {!isLoading && !error && requests.length === 0 && <p>No customer orders yet.</p>}
      <div style={{ display: "grid", gap: "18px", marginTop: "28px" }}>
        {requests.map((request) => (
          <article key={request._id} style={{ border: "1px solid #dfcfbb", background: "#eee3d2", padding: "22px", borderRadius: "8px" }}>
            <h2 style={{ marginTop: 0 }}>{request.artisan?.craftType || "Craft order"}</h2>
            <p><strong>Artisan:</strong> {request.artisan?.name || "Unknown"}</p>
            <p><strong>Customer:</strong> {request.contactName || request.customer?.name || "Visitor"}</p>
            <p><strong>Phone:</strong> {request.contactPhone || "Not provided"}</p>
            <p><strong>Address:</strong> {request.deliveryAddress ? `${request.deliveryAddress.line1}, ${request.deliveryAddress.city}, ${request.deliveryAddress.state} ${request.deliveryAddress.postalCode}` : "Not provided"}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
              <label>Status<select value={request.shipmentStatus || "pending"} onChange={(event) => updateRequest(request, "shipmentStatus", event.target.value)}>{statuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}</select></label>
              <label>Delivery partner<input value={request.deliveryPartner || ""} onChange={(event) => updateRequest(request, "deliveryPartner", event.target.value)} onBlur={(event) => updateRequest(request, "deliveryPartner", event.target.value)} placeholder="Courier name" /></label>
              <label>Tracking number<input value={request.trackingNumber || ""} onChange={(event) => setRequests((previous) => previous.map((item) => item._id === request._id ? { ...item, trackingNumber: event.target.value } : item))} onBlur={(event) => updateRequest(request, "trackingNumber", event.target.value)} placeholder="Tracking ID" /></label>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export default Logistics;
