import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function parseErrorResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await response.json();
    return data.detail || "Chat request failed";
  }

  const text = await response.text();
  return text || "Chat request failed";
}

async function requestChatFallback(messages) {
  const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const data = await response.json();
  return data.reply;
}

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
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
    setMessage("");

    const userMessage = { role: "user", content: trimmedMessage };
    const requestMessages = [...messages, userMessage];
    setMessages([...requestMessages, { role: "assistant", content: "" }]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: requestMessages }),
      });

      if (!response.ok) {
        throw new Error(await parseErrorResponse(response));
      }

      if (!response.body) {
        const fallbackReply = await requestChatFallback(requestMessages);
        setMessages([...requestMessages, { role: "assistant", content: fallbackReply }]);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedReply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        accumulatedReply += decoder.decode(value, { stream: true });
        setMessages([...requestMessages, { role: "assistant", content: accumulatedReply }]);
      }

      accumulatedReply += decoder.decode();
      setMessages([...requestMessages, { role: "assistant", content: accumulatedReply }]);

      if (!accumulatedReply) {
        throw new Error("Model не вернул текст ответа.");
      }
    } catch (requestError) {
      setMessages(requestMessages);
      setError(requestError.message || "Не удалось получить ответ от backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setMessage("");
    setError("");
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
          <div className="form-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Генерация..." : "Отправить"}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={handleClearChat}
              disabled={isSubmitting || messages.length === 0}
            >
              Очистить чат
            </button>
          </div>
        </form>

        <div className="response-block">
          <h2>Диалог</h2>
          {error ? <p className="error">{error}</p> : null}
          {messages.length ? (
            <div className="message-list">
              {messages.map((item, index) => (
                <div
                  key={`${item.role}-${index}`}
                  className={`message-card message-card-${item.role}`}
                >
                  <div className="message-role">
                    {item.role === "user" ? "Вы" : "DJAI"}
                  </div>
                  <pre>{item.content || (isSubmitting && index === messages.length - 1 ? "..." : "")}</pre>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">Диалог пока пуст.</p>
          )}
        </div>

        <p className="api-note">API base URL: {API_BASE_URL}</p>
      </section>
    </main>
  );
}

export default App;
