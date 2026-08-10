module.exports = async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({
                error: "Method not allowed"
            });
        }

        const { userQuery } = req.body || {};

        if (!userQuery) {
            return res.status(400).json({
                error: "Query is required"
            });
        }

        // API key comes ONLY from Vercel Environment Variables
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "GEMINI_API_KEY is missing"
            });
        }

const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
    {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: userQuery
                        }
                    ]
                }
            ]
        })
    }
);

        const data = await response.json();

        console.log("Gemini response:", data);

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.error?.message || "Gemini API error"
            });
        }

        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) {
            return res.status(500).json({
                error: "No response received from Gemini"
            });
        }

        return res.status(200).json({
            reply: reply
        });

    } catch (error) {
        console.error("Function error:", error);

        return res.status(500).json({
            error: error.message || "Server error"
        });
    }
};