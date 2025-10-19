import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { PencilSquare, ArrowRepeat, Save, Share } from 'react-bootstrap-icons'; 

// Dummy Data: Yeh woh data hai jo aapko AI (Gemini/OpenAI) se milega.
const initialPitchData = {
    name: "MentorMate",
    tagline: "Guidance Meets Growth.",
    elevatorPitch: "A dynamic platform connecting aspiring learners with seasoned industry mentors for personalized career guidance and skill development.",
    problemSolution: "Problem: Students often lack real-world guidance. Solution: MentorMate provides 1-on-1 access to professionals, filling the guidance gap.",
};

function GeneratedPitch() {
    // 1. STATE: AI se aaye data ko editable banane ke liye state use karein
    const [pitchData, setPitchData] = useState(initialPitchData);
    const [isEditing, setIsEditing] = useState(null); // Kis field ko edit kar rahe hain ('name', 'tagline', etc.)

    // State update karne ka simple function
    const handleEditChange = (field, value) => {
        setPitchData({ ...pitchData, [field]: value });
    };

    // 2. Button Handlers
    const handleSave = () => {
        // **TODO: Yahan data ko Supabase/Firebase database mein save kiya jayega.**
        setIsEditing(null);
        alert("Pitch saved to your Dashboard!");
    };
    
    const handleRegenerate = () => {
        // **TODO: Yahan AI ko dobara call kiya jayega naye inputs ke saath.**
        alert("Regenerating pitch with new options...");
    };

    return (
        <Container className="my-5">
            <h2 className="mb-4 text-center">Your Generated Pitch is Ready! ✨</h2>
            
            <Row className="mb-4 justify-content-center">
                {/* Action Buttons */}
                <Col xs="auto" className="d-flex gap-2">
                    <Button variant="outline-primary" onClick={() => handleRegenerate()}>
                        <ArrowRepeat className="me-2" /> Regenerate
                    </Button>
                    <Button variant="success" onClick={handleSave}>
                        <Save className="me-2" /> Save to Dashboard
                    </Button>
                    <Button variant="info" href="/export">
                        <Share className="me-2" /> Export / Share
                    </Button>
                </Col>
            </Row>

            {/* AI Generated Elements */}
            <Row className="g-4">
                {/* 1. Startup Name Card */}
                <Col md={12}>
                    <PitchItem
                        title="Startup Name"
                        field="name"
                        value={pitchData.name}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        handleChange={handleEditChange}
                    />
                </Col>

                {/* 2. Tagline Card */}
                <Col md={12}>
                    <PitchItem
                        title="Tagline"
                        field="tagline"
                        value={pitchData.tagline}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        handleChange={handleEditChange}
                        isShort={true}
                    />
                </Col>

                {/* 3. Elevator Pitch Card */}
                <Col md={12}>
                    <PitchItem
                        title="Elevator Pitch (Main Pitch)"
                        field="elevatorPitch"
                        value={pitchData.elevatorPitch}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        handleChange={handleEditChange}
                        isLong={true}
                    />
                </Col>

                {/* 4. Problem/Solution Statement Card (Optional) */}
                <Col md={12}>
                    <PitchItem
                        title="Problem / Solution Statement"
                        field="problemSolution"
                        value={pitchData.problemSolution}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        handleChange={handleEditChange}
                        isLong={true}
                    />
                </Col>
            </Row>
        </Container>
    );
}

// -------------------------------------------------------------
// Helper Component: Har Pitch item ko dikhane ke liye
// -------------------------------------------------------------
const PitchItem = ({ title, field, value, isEditing, setIsEditing, handleChange, isLong }) => {
    const activeEdit = isEditing === field;

    return (
        <Card className="shadow-sm">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0 text-secondary">{title}</Card.Title>
                    <Button 
                        variant="light" 
                        size="sm" 
                        onClick={() => setIsEditing(activeEdit ? null : field)}
                        className="border"
                    >
                        <PencilSquare className="me-1" /> {activeEdit ? 'Stop Editing' : 'Edit'}
                    </Button>
                </div>
                
                {activeEdit ? (
                    // Editing Mode
                    <Form.Control
                        as={isLong ? "textarea" : "input"}
                        rows={isLong ? 4 : 1}
                        value={value}
                        onChange={(e) => handleChange(field, e.target.value)}
                    />
                ) : (
                    // Display Mode
                    <p className={`mb-0 ${isLong ? 'text-wrap' : 'fw-bold fs-4'}`}>
                        {value}
                    </p>
                )}
            </Card.Body>
        </Card>
    );
};

export default GeneratedPitch;