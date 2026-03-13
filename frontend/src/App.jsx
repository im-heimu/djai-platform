import { useEffect, useRef, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function isAbortError(error) {
  return error?.name === "AbortError";
}

async function parseErrorResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await response.json();
    return data.detail || "Chat request failed";
  }

  const text = await response.text();
  return text || "Chat request failed";
}

async function requestChatFallback(messages, signal) {
  const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const data = await response.json();
  return data.reply;
}

function getHealthMeta(health) {
  if (health === "ok") {
    return { label: "Backend: ok", tone: "ok" };
  }

  if (health === "loading") {
    return { label: "Backend: ...", tone: "loading" };
  }

  return { label: "Backend: error", tone: "error" };
}

function App() {
  const abortControllerRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [health, setHealth] = useState("loading");
  const [runtime, setRuntime] = useState(null);
  const [runtimeError, setRuntimeError] = useState("");

  const formatRuntimeValue = (value, suffix = "") => {
    if (value === null || value === undefined || value === "") {
      return "—";
    }

    return `${value}${suffix}`;
  };

  const healthMeta = getHealthMeta(health);
  const runtimeItems = runtime
    ? [
        {
          label: "Статус",
          value: runtime.runtime_ready ? "ready" : "not ready",
          tone: runtime.runtime_ready ? "ready" : "error",
        },
        {
          label: "Model",
          value: formatRuntimeValue(runtime.model_name),
        },
        {
          label: "Timeout",
          value: formatRuntimeValue(runtime.model_timeout_seconds, "s"),
        },
        {
          label: "System prompt",
          value: runtime.system_prompt_enabled ? "enabled" : "disabled",
        },
        {
          label: "Temperature",
          value: formatRuntimeValue(runtime.model_temperature),
        },
        {
          label: "Max tokens",
          value: formatRuntimeValue(runtime.model_max_tokens),
        },
      ]
    : [];

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

  useEffect(() => {
    const loadRuntime = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/runtime`);
        if (!response.ok) {
          throw new Error("Runtime diagnostics request failed");
        }

        const data = await response.json();
        setRuntime(data);
        setRuntimeError("");
      } catch (runtimeFetchError) {
        setRuntimeError("Не удалось загрузить runtime diagnostics.");
      }
    };

    loadRuntime();
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
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
    setStatusMessage("");
    setMessage("");

    const userMessage = { role: "user", content: trimmedMessage };
    const requestMessages = [...messages, userMessage];
    setMessages([...requestMessages, { role: "assistant", content: "" }]);
    const controller = new AbortController();
    abortControllerRef.current = controller;
    let accumulatedReply = "";

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({ messages: requestMessages }),
      });

      if (!response.ok) {
        throw new Error(await parseErrorResponse(response));
      }

      if (!response.body) {
        const fallbackReply = await requestChatFallback(requestMessages, controller.signal);
        setMessages([...requestMessages, { role: "assistant", content: fallbackReply }]);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

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
      if (isAbortError(requestError)) {
        setStatusMessage("Генерация остановлена.");
        if (accumulatedReply) {
          setMessages([...requestMessages, { role: "assistant", content: accumulatedReply }]);
        } else {
          setMessages(requestMessages);
        }
        return;
      }

      setMessages(requestMessages);
      setError(requestError.message || "Не удалось получить ответ от backend.");
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsSubmitting(false);
    }
  };

  const handleStopStreaming = () => {
    abortControllerRef.current?.abort();
  };

  const handleClearChat = () => {
    abortControllerRef.current?.abort();
    setMessages([]);
    setMessage("");
    setError("");
    setStatusMessage("");
  };

  return (
    <main className="app-shell">
      <section className="app-frame">
        <header className="app-header">
          <div className="app-header-copy">
            <p className="eyebrow">DJAI Platform</p>
            <h1>Минимальный chat UI</h1>
            <p className="subtitle">
              Pre-alpha интерфейс для проверки текущего chat flow, streaming и runtime
              конфигурации.
            </p>
          </div>
          <div className="status-group">
            <span className={`status-pill status-pill-${healthMeta.tone}`}>
              {healthMeta.label}
            </span>
            {runtime ? (
              <span
                className={`status-pill ${
                  runtime.runtime_ready ? "status-pill-ready" : "status-pill-error"
                }`}
              >
                Runtime: {runtime.runtime_ready ? "ready" : "not ready"}
              </span>
            ) : null}
          </div>
        </header>

        <div className="app-layout">
          <section className="chat-column">
            <div className="panel-block transcript-panel">
              <div className="section-heading">
                <div>
                  <h2>Диалог</h2>
                  <p className="muted">
                    История хранится только в памяти текущей страницы.
                  </p>
                </div>
                <span className="section-badge">
                  {messages.length ? `сообщений: ${messages.length}` : "пусто"}
                </span>
              </div>

              {error ? (
                <p className="feedback feedback-error" role="alert">
                  {error}
                </p>
              ) : null}

              {statusMessage ? (
                <p className="feedback feedback-muted" role="status">
                  {statusMessage}
                </p>
              ) : null}

              <div className="transcript" aria-live="polite" aria-busy={isSubmitting}>
                {messages.length ? (
                  <div className="message-list">
                    {messages.map((item, index) => {
                      const isStreamingMessage =
                        isSubmitting &&
                        item.role === "assistant" &&
                        index === messages.length - 1;

                      return (
                        <article
                          key={`${item.role}-${index}`}
                          className={`message-row message-row-${item.role}`}
                        >
                          <div className={`message-bubble message-bubble-${item.role}`}>
                            <div className="message-meta">
                              <span className="message-role">
                                {item.role === "user" ? "Вы" : "DJAI"}
                              </span>
                              {isStreamingMessage ? (
                                <span className="message-state">Генерация...</span>
                              ) : null}
                            </div>
                            <pre className="message-content">
                              {item.content || (isStreamingMessage ? "..." : "")}
                            </pre>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <h3>Диалог пока пуст</h3>
                    <p className="muted">
                      Отправьте первое сообщение, чтобы проверить текущий chat flow.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <form className="panel-block composer-panel" onSubmit={handleSubmit}>
              <div className="section-heading section-heading-compact">
                <div>
                  <label className="composer-label" htmlFor="message">
                    Сообщение
                  </label>
                  <p className="muted composer-note">
                    Новый запрос отправляется вместе с текущей историей диалога.
                  </p>
                </div>
              </div>

              <textarea
                id="message"
                rows="5"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Введите тестовое сообщение"
              />

              <div className="composer-footer">
                <p className="muted composer-hint">
                  {isSubmitting
                    ? "Идёт генерация ответа. При необходимости можно остановить поток."
                    : "Ответ появляется постепенно по мере генерации модели."}
                </p>

                <div className="form-actions">
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Генерация..." : "Отправить"}
                  </button>
                  {isSubmitting ? (
                    <button
                      type="button"
                      className="stop-button"
                      onClick={handleStopStreaming}
                    >
                      Stop
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={handleClearChat}
                    disabled={isSubmitting || messages.length === 0}
                  >
                    Очистить чат
                  </button>
                </div>
              </div>
            </form>
          </section>

          <aside className="support-column">
            <section className="panel-block runtime-panel">
              <div className="section-heading section-heading-compact">
                <div>
                  <h2>Runtime</h2>
                  <p className="muted">Сводка по текущей конфигурации backend.</p>
                </div>
              </div>

              {runtimeError ? (
                <p className="feedback feedback-muted">{runtimeError}</p>
              ) : null}

              {!runtime && !runtimeError ? (
                <p className="muted">Загрузка runtime...</p>
              ) : null}

              {runtime ? (
                <>
                  <dl className="runtime-list">
                    {runtimeItems.map((item) => (
                      <div key={item.label} className="runtime-item">
                        <dt>{item.label}</dt>
                        <dd
                          className={
                            item.tone
                              ? `runtime-value runtime-value-${item.tone}`
                              : "runtime-value"
                          }
                        >
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  {runtime.configuration_error ? (
                    <p className="feedback feedback-error runtime-warning">
                      {runtime.configuration_error}
                    </p>
                  ) : null}
                </>
              ) : null}

              <div className="runtime-footer">
                <p className="muted runtime-note">
                  Diagnostics остаётся вторичным блоком и не влияет на chat flow.
                </p>
                <p className="api-note">API base URL: {API_BASE_URL}</p>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default App;
