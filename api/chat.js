module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { userQuery } = req.body || {};
    if (!userQuery) {
        return res.status(400).json({ error: 'Query is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(200).json({ reply: 'Error: GEMINI_API_KEY is missing in Vercel Environment Variables.' });
    }

    const promptContext = `
You are an AI portfolio assistant for Hasibul Hasan Usama.

Portfolio Details:
Name: Hasibul Hasan Usama
Profession: Software Engineer & 3D Web Developer

Key Skills:
JavaScript, Three.js, C, CSS, Java, Node.js, HTML, C++

Key Languages: 
English, Bangla, Arabic, Hindi

Contact:
Email: hasibulhasanusama@gmail.com
Phone: +8801708302032

Socials & Profiles:
LinkedIn: https://linkedin.com/in/hasibul-hasan-usama-1435653b7/
Facebook: https://facebook.com/hasibulhasanosama/
WhatsApp: https://wa.me/8801708302032/
GitHub: https://github.com/hasibulhasanusama
Discord: https://discord.com/users/hasibulhasanusama_65967/

Visitor's Question:
"${userQuery}"

LANGUAGE RULES:
1. By default, always answer in English.
2. If the visitor asks "Bangla te deo", "বাংলায় দাও", "বাংলায় বলো", "Bangla", or clearly requests Bangla, answer completely in Bangla.
3. If the visitor asks "English e deo", "ইংরেজিতে দাও", "English", or clearly requests English, answer completely in English.
4. Never mix Bangla and English in the same answer unless requested.
5. Keep the answer professional, natural, and concise.
6. Answer in 2-3 sentences.
7. Only provide information related to this portfolio.
    `;

    try {
        const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptContext }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        } else if (data.error) {
            return res.status(200).json({ reply: `Google API Error: ${data.error.message}` });
        } else {
            return res.status(200).json({ reply: "Couldn't generate a response." });
        }
    } catch (error) {
        return res.status(200).json({ reply: `Server Error: ${error.message}` });
    }
};
