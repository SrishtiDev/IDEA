const axios = require('axios');

const NIM_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

async function callNimApi(modelName, systemPrompt, userPrompt, apiKey) {
    const response = await axios.post(NIM_API_URL, {
        model: modelName,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 4096
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
    });

    return response.data.choices[0].message.content;
}

module.exports = {
    callNimApi
};
