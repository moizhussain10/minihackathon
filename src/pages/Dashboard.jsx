import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { doc, getDoc } from "firebase/firestore";
import PitchDisplay from '../componets/PitchDsplay';



// const pitchSchema = {
//   type: "object",
//   properties: {
//     name: { type: "string", description: "A creative startup name." },
//     tagline: { type: "string", description: "A catchy, short tagline." },
//     elevatorPitch: {
//       type: "string",
//       description: "A concise elevator pitch (max 50 words).",
//     },
//   },
//   required: ["name", "tagline", "elevatorPitch"],
// };

function Dashboard() {
  const [user, setUser] = useState(null);
  const [generatedPitch, setGeneratedPitch] = useState(null);
  const [landingPageCode, setLandingPageCode] = useState(null)
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
      const userDocRef = doc(db, "pitches", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setSavedPitches(data.pitches || []); // array of pitches
      } else {
        console.log("No pitches found for this user.");
        setSavedPitches([]);
      }
    } catch (error) {
      console.error("Error fetching pitches:", error);
    }
  };



  return (
    <div
      className="dashboard-container d-flex"
      style={{ minHeight: "100vh", width: "95vw" }}
    >
      <div
        className="sidebar bg-dark text-light p-3 d-flex flex-column justify-content-between"
        style={{ minWidth: "250px" }}
      >
        <div>
          <h4 className="text-center text-warning fw-bold">⚡ PitchCraft</h4>
          <ul className="nav flex-column mt-4">
            <li className="nav-item mb-3">
              <Link to="/create-pitch" className="nav-link text-light">
                💡 Create Pitch
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link to="dashboard" className="nav-link text-light">
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
          {savedPitches.map((pitch, index) => (
            <div key={index} className="mb-5">
              <PitchDisplay pitch={pitch} defaultView="text" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;