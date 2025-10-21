import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: "AIzaSyAIJUutwDZ42T4HGkg3jqGKiGDGD2S-HE8"
});


export const generatePitch = async (startupIdea, tone = 'professional') => {
    try {

        const prompt = `
        You are a world-class startup pitch consultant and AI branding strategist.
        
        Your task:
        Generate a complete and investor-ready startup pitch based on the given input below.
        
        ---
        Startup Idea: ${startupIdea}
        Desired Tone: ${tone}
        ---
        
        Please respond **strictly in valid JSON format** following the schema below:
        
        {
          "startupName": "Creative, memorable, and brandable name (max 2 words)",
          "tagline": "Catchy and emotional tagline under 12 words",
          "elevatorPitch": "2-3 sentence pitch that excites investors and explains the concept clearly",
          "problemStatement": "Describe the main pain point or problem the startup solves, in 2-4 sentences",
          "solutionStatement": "Describe the innovative solution, including technology or approach used, in 2-4 sentences",
          "targetAudience": "Define the primary users and audience segments",
          "uniqueValueProposition": "Explain what makes this idea stand out and hard to copy (2 sentences max)",
          "landingPageCopy": {
            "heroTitle": "Main headline that hooks the reader instantly",
            "heroSubtitle": "Short supporting sentence explaining what the startup does",
            "features": [
              "Feature 1 - explain with benefit",
              "Feature 2 - explain with benefit",
              "Feature 3 - explain with benefit"
            ],
            "callToAction": "Short action-oriented phrase (e.g., 'Get Started Today')"
          },
          "colorPalette": [
            "#HEX1 (Primary brand color)",
            "#HEX2 (Accent color)",
            "#HEX3 (Background or secondary color)"
          ],
          "logoConcept": "Describe the logo idea visually and symbolically in one line"
        }
        
        Guidelines:
        - Write with a ${tone} tone.
        - Maintain clarity, positivity, and emotional appeal.
        - Avoid repetition or filler words.
        - All responses must be in **valid JSON** (no markdown, no explanations).
        `;

        const res = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        const jsonMatch = res.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('Invalid response format from AI');
        }
    } catch (error) {
        console.error('Error generating pitch:', error);
        throw error;
    }
};

export const generateLandingPage = async (pitchData) => {
    try {
        const prompt = `
You are a professional web developer. Create a complete, modern, responsive landing page HTML/CSS code for this startup:

Startup Name: ${pitchData.startupName}
Tagline: ${pitchData.tagline}
Hero Title: ${pitchData.landingPageCopy.heroTitle}
Hero Subtitle: ${pitchData.landingPageCopy.heroSubtitle}
Features: ${pitchData.landingPageCopy.features.join(', ')}
Call to Action: ${pitchData.landingPageCopy.callToAction}
Color Palette: ${pitchData.colorPalette.join(', ')}
Problem: ${pitchData.problemStatement}
Solution: ${pitchData.solutionStatement}
Target Audience: ${pitchData.targetAudience}

Create a complete HTML page with:
1. Modern, responsive design, with a responsive navbae
2. Hero section with title, subtitle, and CTA button
3. Features section
4. Problem/Solution section
5. About section
6. Contact/CTA section
7. Professional styling with the provided color palette
8. Mobile-responsive design
9. Smooth animations and transitions
10. Professional typography

Return ONLY the complete HTML code with embedded CSS. Do not include any explanations or markdown formatting.
`;

        const res = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });


        const htmlMatch = res.text.match(/<!DOCTYPE html>[\s\S]*<\/html>/i) || text.match(/<html[\s\S]*<\/html>/i);
        if (htmlMatch) {
            return htmlMatch[0];
        } else {
            return text.trim();
        }
    } catch (error) {
        console.error('Error generating landing page:', error);
        throw error;
    }
};