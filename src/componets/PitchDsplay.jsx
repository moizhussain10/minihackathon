import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PitchDisplay({ pitch, storepitch }) {
  const [view, setView] = useState("text");
  const iframeRef = useRef(null);

  if (!pitch) return null;

  // Inject HTML into iframe when switching to "web" view
  useEffect(() => {
    if (view === "web" && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      doc.open();
      doc.write(
        pitch.htmlCode ||
          pitch.landingPageCopy?.htmlCode ||
          "<!-- HTML code not available -->"
      );
      doc.close();
    }
  }, [view, pitch]);

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">
        {/* View Toggle Buttons */}
        <div className="btn-group mb-4" role="group" aria-label="View options">
          <button
            onClick={() => setView("text")}
            className={`btn ${
              view === "text" ? "btn-primary" : "btn-outline-secondary"
            }`}
          >
            Text View
          </button>

          <button
            onClick={() => setView("code")}
            className={`btn ${
              view === "code" ? "btn-primary" : "btn-outline-secondary"
            }`}
          >
            Code View
          </button>

          <button
            onClick={() => setView("web")}
            className={`btn ${
              view === "web" ? "btn-primary" : "btn-outline-secondary"
            }`}
          >
            Web Preview
          </button>
        </div>

        {/* Text View */}
        {view === "text" && (
          <div className="bg-light p-4 rounded border">
            <h4 className="fw-bold text-primary">{pitch.startupName}</h4>
            <p className="fst-italic text-secondary mb-2">{pitch.tagline}</p>
            <p>
              <strong>Elevator Pitch:</strong> {pitch.elevatorPitch}
            </p>
            <p>
              <strong>Problem:</strong> {pitch.problemStatement}
            </p>
            <p>
              <strong>Solution:</strong> {pitch.solutionStatement}
            </p>
          </div>
        )}

        {/* Code View */}
        {view === "code" && (
          <div
            className="bg-dark text-light p-3 rounded overflow-auto"
            style={{ maxHeight: "500px", maxWidth: "100%", fontSize: "0.9rem" }}
          >
            <pre className="m-0">
              {pitch.htmlCode ||
                pitch.landingPageCopy?.htmlCode ||
                "<!-- HTML code not available -->"}
            </pre>
          </div>
        )}

        {/* Web Preview */}
        {view === "web" && (
          <div className="border rounded overflow-hidden">
            <iframe
              ref={iframeRef}
              title="Web Preview"
              style={{
                width: "100%",
                height: "500px",
                border: "none",
                borderRadius: "8px",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
