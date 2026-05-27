package com.hireorbit.resumeanalyzer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class NimApiService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${nvidia.api.key.parse}")
    private String parseApiKey;

    @Value("${nvidia.api.key.analyze}")
    private String analyzeApiKey;

    @Value("${minimax.api.key}")
    private String minimaxApiKey;

    private static final String NIM_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

    public String callModel(String modelName, String systemPrompt, String userPrompt) {
        String apiKey;
        if (modelName.equals("nemotron-parse")) {
            apiKey = parseApiKey;
        } else if (modelName.equals("nvidia/llama-3.3-nemotron-super-49b-v1")) {
            apiKey = analyzeApiKey;
        } else if (modelName.equals("minimaxai/minimax-m2.7")) {
            apiKey = minimaxApiKey;
        } else {
            throw new IllegalArgumentException("Unknown model: " + modelName);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> requestBody = Map.of(
                "model", modelName,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userPrompt)
                ),
                "temperature", 0.2,
                "max_tokens", 4096
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        try {
            Map<String, Object> response = restTemplate.postForObject(NIM_API_URL, entity, Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            throw new RuntimeException("Failed to call NIM API for model " + modelName + ": " + e.getMessage(), e);
        }
    }
}
