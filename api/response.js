 export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const { message, language = "auto" } = req.body || {};

  if (!message) {
    return res.status(400).json({
      error: "Message is required"
    });
  }

  try {
    const prompt = `
You are STAR AI, a multilingual AI assistant by STAR GLOBAL TECH.

Founder: Jemi Angelin Selvaraj
Tagline: Think Beyond. Create Beyond.

Instructions:
- Reply clearly and accurately.
- Support all languages supported by Gemini.
- Detect the user's language automatically.
- Reply in the selected language.
- Be friendly, helpful and professional.

Selected language: ${language}
User message: ${message}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Gemini API failed"
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("") || "Please try again.";

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({
      error: "Server connection failed"
    });
  }
}
