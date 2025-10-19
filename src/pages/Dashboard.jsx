import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = "AIzaSyAIJUutwDZ42T4HGkg3jqGKiGDGD2S-HE8";

const pitchSchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "A creative startup name." },
    tagline: { type: "string", description: "A catchy, short tagline." },
    elevatorPitch: {
      type: "string",
      description: "A concise elevator pitch (max 50 words).",
    },
  },
  required: ["name", "tagline", "elevatorPitch"],
};

function Dashboard() {
  const [user, setUser] = useState(null);
  const [idea, setIdea] = useState("");
  const [generatedPitch, setGeneratedPitch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedPitches, setSavedPitches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchPitches(currentUser.uid);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const fetchPitches = async (uid) => {
    try {
      const q = query(collection(db, "pitches"), where("userId", "==", uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSavedPitches(data);
    } catch (error) {
      console.error("Error fetching pitches:", error);
    }
  };

  const handleGeneratePitch = async (e) => {
    e.preventDefault();

    if (!idea.trim()) {
      alert("Please enter your startup idea!");
      return;
    }

    setIsLoading(true);
    setGeneratedPitch(null);

    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const promptText = `Startup Idea: ${idea}. Generate a creative name, tagline, and elevator pitch also give a app features and app preview.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        config: {
          systemInstruction:
            "You are PitchCraft, an expert startup pitch generator. Respond strictly in JSON format.",
          responseMimeType: "application/json",
          responseSchema: pitchSchema,
          temperature: 0.7,
        },
      });

      console.log(response)

      const responseText = response.text.trim();
      const resultData = JSON.parse(responseText);
      setGeneratedPitch(resultData);

      if (user) {
        await addDoc(collection(db, "pitches"), {
          userId: user.uid,
          name: resultData.name,
          tagline: resultData.tagline,
          elevatorPitch: resultData.elevatorPitch,
          idea: idea,
          createdAt: new Date().toISOString(),
        });
        alert("Pitch saved successfully ");
        fetchPitches(user.uid);
      }

      setIdea("");
    } catch (error) {
      console.error("Gemini API Error:", error);
      alert(`Error generating pitch: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="dashboard-container d-flex"
      style={{ minHeight: "100vh", width: "100vw" }}
    >
      <div
        className="sidebar bg-dark text-light p-3 d-flex flex-column justify-content-between"
        style={{ minWidth: "250px" }}
      >
        <div>
          <h4 className="text-center text-warning fw-bold">⚡ PitchCraft</h4>
          <ul className="nav flex-column mt-4">
            <li className="nav-item mb-3">
              <Link to="#" className="nav-link text-light">
                💡 Create Pitch
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link to="#" className="nav-link text-light">
                📦 Saved Pitches
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link to="#" className="nav-link text-light">
                ⚙️ Settings
              </Link>
            </li>
          </ul>
        </div>
        <button
          className="btn btn-outline-warning w-100 mt-auto"
          onClick={handleLogout}
        >
          🔓 Logout
        </button>
      </div>

      <div className="main-content flex-grow-1 bg-light p-4">
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-primary">PitchCraft Dashboard</h3>
          {user && <p className="text-muted m-0">👋 Welcome, {user.email}</p>}
        </header>

        <div className="card shadow-sm p-4 mb-4">
          <h5 className="fw-bold mb-3">🎯 Create Your Startup Pitch</h5>
          <p className="text-muted">
            Enter your startup idea and let Gemini generate a name, tagline, and
            pitch instantly.
          </p>
          <form onSubmit={handleGeneratePitch}>
            <textarea
              className="form-control mb-3"
              rows="4"
              placeholder="Example: I want to build an app that connects students with mentors."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              disabled={isLoading}
              required
            ></textarea>
            <button className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? "Generating Pitch... ⏳" : "Generate Pitch ⚡"}
            </button>
          </form>
        </div>

        {generatedPitch && (
          <div className="card shadow-lg p-4 mb-4 border-success">
            <h5 className="fw-bold mb-3 text-success">
              ✨ Generated Pitch (Gemini)
            </h5>
            <div className="p-3 bg-white rounded border">
              <p className="mb-1">
                <strong>Startup Name:</strong> {generatedPitch.name}
              </p>
              <p className="mb-1">
                <strong>Tagline:</strong> {generatedPitch.tagline}
              </p>
              <p className="mb-0">
                <strong>Elevator Pitch:</strong> {generatedPitch.elevatorPitch}
              </p>
            </div>
          </div>
        )}

        <div className="card shadow-sm p-4">
          <h5 className="fw-bold mb-3">📦 Saved Pitches</h5>
          <div className="bg-white p-3 rounded border">
            {savedPitches.length === 0 ? (
              <p>No saved pitches yet.</p>
            ) : (
              savedPitches.map((pitch) => (
                <div key={pitch.id} className="border-bottom pb-2 mb-2">
                  <p className="mb-1">
                    <strong>{pitch.name}</strong> — {pitch.tagline}
                  </p>
                  <small className="text-muted">{pitch.elevatorPitch}</small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;