const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.OLLAMA_API_KEY;
const HOST = process.env.OLLAMA_BASE_URL || 'https://ollama.com';

async function testCloud() {
    console.log("Testing Ollama Cloud Connectivity...");
    console.log("URL:", `${HOST}/api/tags`);
    console.log("Key:", API_KEY ? "Present (Starts with " + API_KEY.slice(0, 5) + "...)" : "Missing");

    try {
        const res = await axios.get(`${HOST}/api/tags`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        console.log("✅ Models found:", res.data.models.map(m => m.name).join(', '));

        console.log("\n2. Testing Generation (gpt-oss:120b)...");
        const genRes = await axios.post(`${HOST}/api/chat`, {
            model: "gpt-oss:120b",
            messages: [{ role: 'user', content: 'hi' }],
            stream: false
        }, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        console.log("✅ Generation Success!");
        console.log("Response:", genRes.data.message.content);

    } catch (err) {
        console.error("❌ Cloud Test Failed!");
        console.error("Status:", err.response ? err.response.status : "No response");
        console.error("Data:", err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
    }
}

testCloud();
