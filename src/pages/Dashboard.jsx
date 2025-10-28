import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { doc, getDoc } from "firebase/firestore";
import PitchDisplay from "../componets/PitchDsplay";
import "./Dashboard.css"; // we'll add our styles here

function Dashboard({ logout }) {
  const [user, setUser] = useState(null);
  const [generatedPitch, setGeneratedPitch] = useState(null);
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
    logout(false);
    navigate("/login");
  };

  const fetchPitches = async (uid) => {
    try {
      const userDocRef = doc(db, "pitches", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setSavedPitches(data.pitches || []);
      } else {
        console.log("No pitches found for this user.");
        setSavedPitches([]);
      }
    } catch (error) {
      console.error("Error fetching pitches:", error);
    }
  };

  return (
    <div className="dashboard-container d-flex flex-column flex-md-row min-vh-100">
      {/* Sidebar */}
      <div className="sidebar bg-dark text-light p-3 d-flex flex-column justify-content-between">
        <div>
          <h4 className="text-center text-warning fw-bold mb-4">⚡ PitchCraft</h4>
          <ul className="nav flex-column">
            <li className="nav-item mb-3">
              <Link to="/create-pitch" className="nav-link text-light sidebar-link">
                💡 Create Pitch
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link to="/dashboard" className="nav-link text-light sidebar-link">
                📦 Saved Pitches
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link to="#" className="nav-link text-light sidebar-link">
                ⚙️ Settings
              </Link>
            </li>
          </ul>
        </div>

        <button
          className="btn btn-outline-warning w-100 mt-3 fw-semibold logout-btn"
          onClick={handleLogout}
        >
          🔓 Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content flex-grow-1 bg-light p-4">
        <header className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 border-bottom pb-3">
          <h3 className="fw-bold text-primary">PitchCraft Dashboard</h3>
          {user && <p className="text-muted mt-2 mt-sm-0 m-0">👋 Welcome, {user.email}</p>}
        </header>

        {/* Generated Pitch Section */}
        {generatedPitch && (
          <div className="card shadow-sm p-4 mb-4 border-0 animate-fade-in">
            <h5 className="fw-bold mb-3 text-success">✨ Generated Pitch (Gemini)</h5>
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

        {/* Saved Pitches */}
        <div className="card shadow-sm p-4 border-0">
          <h5 className="fw-bold mb-3 text-dark">📦 Saved Pitches</h5>
          {savedPitches.length === 0 ? (
            <p className="text-muted">No pitches saved yet. Create one to get started!</p>
          ) : (
            savedPitches.map((pitch, index) => (
              <div key={index} className="mb-4 pitch-card animate-fade-in">
                <PitchDisplay pitch={pitch} defaultView="text" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
