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

async function streamNimApi(modelName, systemPrompt, userPrompt, apiKey, onChunk) {
    const response = await fetch(NIM_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: modelName,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.2,
            max_tokens: 4096,
            stream: true
        })
    });

    if (!response.ok) {
        throw new Error(`NIM API error: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        // NIM SSE format: data: {"id":..., "choices":[{"delta":{"content":"..."}}]}
        const lines = chunk.split('\n');
        for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                try {
                    const data = JSON.parse(line.slice(6));
                    const content = data.choices[0]?.delta?.content;
                    if (content) onChunk(content);
                } catch (e) {
                    // Ignore malformed JSON chunks
                }
            }
        }
    }
}

module.exports = {
    callNimApi,
    streamNimApi
};
