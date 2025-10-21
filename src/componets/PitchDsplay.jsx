import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
export default function PitchDisplay({ pitch , storepitch}) {
  const [view, setView] = useState("text");
  const iframeRef = useRef(null);

  if (!pitch) return null;

  // Inject HTML into iframe when view is "web"
  useEffect(() => {
    if (view === "web" && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      doc.open();
      doc.write(pitch.htmlCode || pitch.landingPageCopy?.htmlCode || "<!-- HTML code not available -->");
      doc.close();
    }
  }, [view, pitch]);

  return (
    <div className="mt-6">
      {/* Buttons for Text / Code / Web */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setView("text")}
          className={`btn ${view === "text" ? "btn-primary shadow" : "btn-outline-secondary"}`}
          style={{ minWidth: "120px" }}
        >
          Text View
        </button>

        <button
          onClick={() => setView("code")}
          className={`btn ${view === "code" ? "btn-primary shadow" : "btn-outline-secondary"}`}
          style={{ minWidth: "120px" }}
        >
          Code View
        </button>

        <button
          onClick={() => setView("web")}
          className={`btn ${view === "web" ? "btn-primary shadow" : "btn-outline-secondary"}`}
          style={{ minWidth: "120px" }}
        >
          Web Preview
        </button>
      </div>


      {/* Text View */}
      {view === "text" && (
        <div className="bg-white p-4 rounded shadow space-y-2">
          <h2 className="text-xl font-bold">{pitch.startupName}</h2>
          <p className="italic text-gray-600">{pitch.tagline}</p>
          <p><strong>Elevator Pitch:</strong> {pitch.elevatorPitch}</p>
          <p><strong>Problem:</strong>{pitch.problemStatement}</p>
          <p><strong>Solution:</strong>{pitch.solutionStatement}</p>
        </div>
      )}

      {/* Code View */}
      {view === "code" && (
        <pre className="bg-black text-white p-4 rounded overflow-x-auto" style={{ maxHeight: "500px", maxWidth:"70vw"}}>
          {pitch.htmlCode || pitch.landingPageCopy?.htmlCode || "<!-- HTML code not available -->"}
        </pre>
      )}

      {/* Web Preview via iframe */}
      {view === "web" && (
        <iframe
          ref={iframeRef}
          title="Web Preview"
          style={{
            width: "100%",
            height: "500px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />
      )}

      </div>
  );
}
