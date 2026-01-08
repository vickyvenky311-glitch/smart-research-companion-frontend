import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!url) return;
    setLoading(true);
    setSummary("");

    try {
      const res = await fetch(
        `http://localhost:8080/api/summarize?url=${encodeURIComponent(url)}`
      );
      const text = await res.text();
      setSummary(text);
    } catch (err) {
      setSummary("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Smart Research Companion</h1>
        <p className="subtitle">
          Paste a research article or webpage URL to get an AI-powered summary
        </p>

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button onClick={handleSummarize} disabled={loading}>
          {loading ? "Summarizing..." : "Summarize"}
        </button>

        {summary && (
          <div className="summary">
            <h3>Summary</h3>
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

