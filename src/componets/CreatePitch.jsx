import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Offcanvas,
  Navbar,
  Nav,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import PitchDisplay from "./PitchDsplay";
import { generatePitch, generateLandingPage } from "../services/geminiService";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

export default function CreatePitch() {
  const [idea, setIdea] = useState("");
  const [tone, setTone] = useState("Formal");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPitch, setGeneratedPitch] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  // ✅ Save pitch to Firestore
  const savePitchToFirestore = async (combinedData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      const userPitchDocRef = doc(db, "pitches", user.uid);
      const userPitchDoc = await getDoc(userPitchDocRef);

      let updatedPitches = [];
      if (userPitchDoc.exists()) {
        const existingData = userPitchDoc.data();
        updatedPitches = existingData.pitches
          ? [...existingData.pitches, combinedData]
          : [combinedData];
      } else {
        updatedPitches = [combinedData];
      }

      await setDoc(userPitchDocRef, { pitches: updatedPitches });
      console.log("✅ Pitch saved successfully!");
    } catch (err) {
      console.error("❌ Error saving pitch:", err);
    }
  };

  // ✅ Form submission
  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (!idea.trim()) return alert("Please apna startup idea likhein!");

    setIsLoading(true);
    try {
      const pitchData = await generatePitch(idea, tone);
      const landingData = await generateLandingPage(pitchData);

      const combinedData = {
        ...pitchData,
        landingPageCopy:
          landingData.landingPageCopy || pitchData.landingPageCopy,
        htmlCode: landingData.htmlCode || landingData,
        colorPalette: landingData.colorPalette || pitchData.colorPalette,
        logoConcept: landingData.logoConcept || pitchData.logoConcept,
        createdAt: new Date().toISOString(),
      };

      setGeneratedPitch(combinedData);
      const cleanedData = JSON.parse(JSON.stringify(combinedData));
      await savePitchToFirestore(cleanedData);
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Pitch generate karne me error aaya!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row" style={{ minHeight: "100vh" }}>
      {/* Navbar for mobile */}
      <Navbar bg="dark" variant="dark" expand={false} className="d-md-none px-3 py-2">
        <Navbar.Brand className="text-warning fw-bold">⚡ PitchCraft</Navbar.Brand>
        <Button
          variant="outline-warning"
          size="sm"
          onClick={toggleSidebar}
          aria-controls="sidebar"
        >
          ☰ Menu
        </Button>
      </Navbar>

      {/* Sidebar (collapsible on small screens) */}
      <Offcanvas
        show={showSidebar}
        onHide={toggleSidebar}
        responsive="md"
        id="sidebar"
        className="bg-dark text-light"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="text-warning fw-bold">⚡ PitchCraft</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column justify-content-between">
          <Nav className="flex-column mt-4">
            <Nav.Link as={Link} to="/create-pitch" className="text-light mb-2">
              💡 Create Pitch
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard" className="text-light mb-2">
              📦 Saved Pitches
            </Nav.Link>
            <Nav.Link className="text-light mb-2" disabled>
              ⚙️ Settings
            </Nav.Link>
          </Nav>
          <div className="text-center small text-secondary">
            © {new Date().getFullYear()} PitchCraft
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        <Container className="py-5 animate__animated animate__fadeIn">
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              {/* Card Form */}
              <Card
                className="shadow-lg border-0 p-4 mb-4 animate__animated animate__fadeInUp"
                style={{
                  borderRadius: "16px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <Card.Body>
                  <h2 className="text-center mb-4 text-primary fw-bold">
                    Naya Pitch Banayein 🚀
                  </h2>
                  <Form onSubmit={formSubmitHandler}>
                    {/* Startup Idea */}
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">
                        Aapka Startup Idea (Detail Mein)
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="Maslan: Main ek mobile app banana chahta hoon jo students ko online tution aur assignments mein madad kare."
                        required
                      />
                      <Form.Text className="text-muted">
                        Idea jitna clear hoga, pitch utni behtar banegi.
                      </Form.Text>
                    </Form.Group>

                    {/* Tone Selector */}
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold d-block">
                        Pitch Ki Tone Chunain
                      </Form.Label>
                      <div className="d-flex flex-wrap gap-3">
                        {["Formal", "Fun", "Creative"].map((t) => (
                          <Form.Check
                            key={t}
                            type="radio"
                            id={`tone-${t}`}
                            label={`${t} ${
                              t === "Formal"
                                ? "(Investor)"
                                : t === "Fun"
                                ? "(Social Media)"
                                : "(Unique)"
                            }`}
                            value={t}
                            checked={tone === t}
                            onChange={() => setTone(t)}
                            inline
                            name="pitchTone"
                          />
                        ))}
                      </div>
                    </Form.Group>

                    {/* Submit Button */}
                    <Button
                      variant="success"
                      type="submit"
                      className="w-100 py-2 mt-3 fw-bold"
                      style={{
                        borderRadius: "8px",
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      {isLoading ? "Generating Pitch... ⏳" : "Generate Pitch ⚡"}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>

              {/* Generated Pitch Display */}
              {generatedPitch && (
                <div
                  className="mt-5 animate__animated animate__fadeInUp"
                  style={{
                    animationDuration: "0.8s",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  <PitchDisplay
                    storepitch={savePitchToFirestore}
                    pitch={generatedPitch}
                    defaultView="text"
                  />
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
