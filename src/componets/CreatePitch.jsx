import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';

function CreatePitch() {
    // 1. STATE: Hum do cheezein save karenge jo user input karega.
    const [idea, setIdea] = useState(''); // Startup idea ko save karne ke liye
    const [tone, setTone] = useState('Formal'); // Pitch ki tone save karne ke liye

    // 2. FUNCTION: Jab user 'Generate Pitch' button dabayega
    const handleSubmit = (e) => {
        e.preventDefault(); // Form ko refresh hone se rokein

        // Validation: Agar idea box khaali hai toh alert do
        if (idea.trim() === '') {
            alert("Please apna startup idea likhein!");
            return;
        }

        // Yahan aapka actual AI call hoga. Abhi ke liye, hum sirf console mein data dikha rahe hain.
        console.log("Input Data Ready for AI:");
        console.log(`Idea: ${idea}`);
        console.log(`Tone: ${tone}`);

        // Zaroori: Agar aap React Router use kar rahe hain, toh yahan redirect hoga.
        // window.location.href = "/generated-pitch"; // Example redirect

        alert(`Pitch generate ho rahi hai! Tone: ${tone}. Check console for data.`);
    };

    return (
        // Poore page ko beech mein laane ke liye Container aur Row/Col use karein
        <Container className="my-5">
            <Row className="justify-content-md-center">
                <Col md={8} lg={7}>
                    <Card className="shadow-lg p-4">
                        <Card.Body>
                            <h2 className="text-center mb-4 text-primary">Naya Pitch Banayein 🚀</h2>
                            <p className="text-muted text-center mb-4">
                                Apna idea detail mein likhein. PitchCraft baaki sab khud kar dega.
                            </p>

                            {/* Poora Form yahan hai */}
                            <Form onSubmit={handleSubmit}>

                                {/* 1. Main Idea Input - Zaroori Input */}
                                <Form.Group className="mb-4" controlId="startupIdea">
                                    <Form.Label className="fw-bold">Aapka Startup Idea (Detail Mein)</Form.Label>
                                    <Form.Control
                                        as="textarea" // Textarea taaki lamba input de saken
                                        rows={6}
                                        value={idea}
                                        // Har baar user type karega toh 'idea' state update hogi
                                        onChange={(e) => setIdea(e.target.value)}
                                        placeholder="Maslan: Main ek mobile app banana chahta hoon jo students ko online tution aur assignments mein madad kare."
                                        required // Yeh field bharna zaroori hai
                                    />
                                    <Form.Text className="text-muted">
                                        Idea jitna clear hoga, pitch utni behtar banegi.
                                    </Form.Text>
                                </Form.Group>

                                {/* 2. Pitch Tone Selector - Optional Feature */}
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold d-block">Pitch Ki Tone Chunain</Form.Label>
                                    <div className="d-flex justify-content-start">
                                        {/* Formal Tone */}
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
                                        {/* Fun Tone */}
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
                                        {/* Creative Tone */}
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

                                {/* Submission Button */}
                                <Button
                                    variant="success"
                                    type="submit"
                                    className="w-100 py-2 mt-3"
                                >
                                    Generate Pitch
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default CreatePitch;