exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    try {
        const { imageBase64, mimeType } = JSON.parse(event.body);

        if (!imageBase64 || !mimeType) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No image provided" }),
            };
        }

        const groqResponse = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-4-scout-17b-16e-instruct",
                    max_tokens: 1024,
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: `data:${mimeType};base64,${imageBase64}`,
                                    },
                                },
                                {
                                    type: "text",
                                    text: `You are a medical imaging AI assistant. Analyze this medical image (X-Ray or MRI) and respond ONLY in the following JSON format, no extra text:
{
  "modality": "X-Ray or MRI",
  "region": "body region visible",
  "findings": ["finding 1", "finding 2", "finding 3"],
  "impression": "brief overall impression in 1-2 sentences",
  "confidence": "low | medium | high",
  "disclaimer": "This analysis is AI-generated and not a substitute for professional medical diagnosis."
}`,
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        const groqData = await groqResponse.json();
        const raw = groqData.choices?.[0]?.message?.content || "{}";

        let parsed;
        try {
            const cleaned = raw.replace(/```json|```/g, "").trim();
            parsed = JSON.parse(cleaned);
        } catch {
            parsed = { error: "Failed to parse AI response", raw };
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
};