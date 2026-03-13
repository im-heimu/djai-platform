import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [health, setHealth] = useState("loading");

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (!response.ok) {
          throw new Error("Health check failed");
        }

        const data = await response.json();
        setHealth(data.status === "ok" ? "ok" : "error");
      } catch (healthError) {
        setHealth("error");
      }
    };

    checkHealth();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setError("Введите сообщение.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = await response.json();
      setReply(data.reply);
    } catch (requestError) {
      setReply("");
      setError("Не удалось получить ответ от backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h1>DJAI Platform</h1>
            <p className="subtitle">Pre-alpha vertical scaffold</p>
          </div>
          <span className={`health health-${health}`}>
            Backend: {health === "ok" ? "ok" : health === "loading" ? "..." : "error"}
          </span>
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <label htmlFor="message">Сообщение</label>
          <textarea
            id="message"
            rows="5"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Введите тестовое сообщение"
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Отправка..." : "Отправить"}
          </button>
        </form>

        <div className="response-block">
          <h2>Ответ</h2>
          {error ? <p className="error">{error}</p> : null}
          {reply ? <pre>{reply}</pre> : <p className="muted">Ответ пока не получен.</p>}
        </div>

        <p className="api-note">API base URL: {API_BASE_URL}</p>
      </section>
    </main>
  );
}

export default App;
