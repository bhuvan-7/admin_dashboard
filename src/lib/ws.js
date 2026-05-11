export function createAuthedWebSocket() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  if (import.meta.env.VITE_WS_BASE_URL) {
    return new WebSocket(`${import.meta.env.VITE_WS_BASE_URL}?token=${encodeURIComponent(token)}`);
  }
  const proto = window.location.protocol === "https:" ? "wss" : "ws";
  return new WebSocket(`${proto}://${window.location.host}/ws?token=${encodeURIComponent(token)}`);
}

