import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setError("");
    setSummary("");
    setLoading(true);

    try {
      // ----------------------------
      // PRIORITY 1: PDF
      // ----------------------------
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await fetch(
          "http://localhost:8080/api/summarize-pdf",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to summarize PDF");
        }

        const data = await response.text();
        setSummary(data);
        return;
      }

      // ----------------------------
      // PRIORITY 2: URL
      // ----------------------------
      if (url.trim() !== "") {
        const response = await fetch(
          `http://localhost:8080/api/summarize?url=${encodeURIComponent(url)}`
        );

        if (!response.ok) {
          throw new Error("Failed to summarize URL");
        }

        const data = await response.text();
        setSummary(data);
        return;
      }

      // ----------------------------
      // NOTHING PROVIDED
      // ----------------------------
      setError("Please enter a URL or upload a PDF.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>Smart Research Companion</h1>
        <p>Paste a research article URL or upload a PDF to get an AI summary</p>

        {/* URL INPUT */}
        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        {/* FILE INPUT */}
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        {/* SINGLE BUTTON */}
        <button onClick={handleSummarize} disabled={loading}>
          {loading ? "Summarizing..." : "Summarize"}
        </button>

        {/* ERROR */}
        {error && <p className="error">{error}</p>}

        {/* SUMMARY */}
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

