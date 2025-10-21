import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PitchDisplay from "./PitchDsplay"; // component for 3 views
import { generatePitch, generateLandingPage } from "../services/geminiService";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function CreatePitch() {
    const [idea, setIdea] = useState('');
    const [tone, setTone] = useState('Formal');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedPitch, setGeneratedPitch] = useState(null);

    const savePitchToFirestore = async (combinedData) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not logged in");

            const userPitchDocRef = doc(db, "pitches", user.uid);
            const userPitchDoc = await getDoc(userPitchDocRef);

            let updatedPitches = [];

            if (userPitchDoc.exists()) {
                // Pehle se data hai, usme naya add karo
                const existingData = userPitchDoc.data();
                updatedPitches = existingData.pitches ? [...existingData.pitches, combinedData] : [combinedData];
            } else {
                // Naya document banao
                updatedPitches = [combinedData];
            }

            await setDoc(userPitchDocRef, { pitches: updatedPitches });

            console.log("✅ Pitch saved successfully in array!");
        } catch (err) {
            console.error("❌ Error saving pitch:", err);
        }
    };

    const formSubmitHandler = async (e) => {
        e.preventDefault();
        if (!idea.trim()) return alert("Please apna startup idea likhein!");

        setIsLoading(true);
        try {
            const pitchData = await generatePitch(idea, tone);
            const landingData = await generateLandingPage(pitchData);

            const combinedData = {
                ...pitchData,
                landingPageCopy: landingData.landingPageCopy || pitchData.landingPageCopy,
                htmlCode: landingData.htmlCode || landingData,
                colorPalette: landingData.colorPalette || pitchData.colorPalette,
                logoConcept: landingData.logoConcept || pitchData.logoConcept,
                createdAt: new Date().toISOString(),
            };

            console.log("✅ Combined Data Ready:", combinedData);

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
        <div className="d-flex" style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <div className="bg-dark text-light p-3" style={{ minWidth: 250 }}>
                <h4 className="text-center text-warning fw-bold mb-4">⚡ PitchCraft</h4>
                <ul className="nav flex-column mt-4">
                    <li className="nav-item mb-3">
                        <Link to="/create-pitch" className="nav-link text-light">💡 Create Pitch</Link>
                    </li>
                    <li className="nav-item mb-3">
                        <Link to="/dashboard" className="nav-link text-light">📦 Saved Pitches</Link>
                    </li>
                    <li className="nav-item mb-3">
                        <Link to="#" className="nav-link text-light">⚙️ Settings</Link>
                    </li>
                </ul>
                <div className="text-center small text-secondary">
                    © {new Date().getFullYear()} PitchCraft
                </div>
            </div>

            {/* Main content */}
            <div className="flex-grow-1 bg-light d-flex flex-column">
                <Container className="py-5">
                    <Row className="justify-content-md-center">
                        <Col md={8} lg={7}>
                            {/* Form */}
                            <Card className="shadow-lg p-4 border-0">
                                <Card.Body>
                                    <h2 className="text-center mb-4 text-primary">Naya Pitch Banayein 🚀</h2>
                                    <Form onSubmit={formSubmitHandler}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">Aapka Startup Idea (Detail Mein)</Form.Label>
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

                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold d-block">Pitch Ki Tone Chunain</Form.Label>
                                            <div className="d-flex justify-content-start flex-wrap gap-3">
                                                <Form.Check
                                                    type="radio"
                                                    id="tone-formal"
                                                    label="Formal (Investor)"
                                                    value="Formal"
                                                    checked={tone === 'Formal'}
                                                    onChange={() => setTone('Formal')}
                                                    inline
                                                    name="pitchTone"
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id="tone-fun"
                                                    label="Fun (Social Media)"
                                                    value="Fun"
                                                    checked={tone === 'Fun'}
                                                    onChange={() => setTone('Fun')}
                                                    inline
                                                    name="pitchTone"
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id="tone-creative"
                                                    label="Creative (Unique)"
                                                    value="Creative"
                                                    checked={tone === 'Creative'}
                                                    onChange={() => setTone('Creative')}
                                                    inline
                                                    name="pitchTone"
                                                />
                                            </div>
                                        </Form.Group>

                                        <Button variant="success" type="submit" className="w-100 py-2 mt-3">
                                            {isLoading ? "Generating Pitch... ⏳" : "Generate Pitch ⚡"}
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>

                            {/* Generated Pitch Display */}
                            {generatedPitch && (
                                <div className="mt-5 space-y-5">
                                    {/* 1️⃣ Text View */}
                                    <PitchDisplay storepitch={savePitchToFirestore} pitch={generatedPitch} defaultView="text" />
                                </div>
                            )}

                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}
