package com.email.email_writer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class EmailGeneratorService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public EmailGeneratorService(
            @Value("${gemini.api.url}") String baseUrl,
            @Value("${gemini.api.key}") String geminiApiKey) {

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)                      // e.g. https://generativelanguage.googleapis.com
                .defaultHeader("x-goog-api-key", geminiApiKey)
                .build();
    }

    // Generate Email Reply
    public String generateEmailReply(EmailRequest emailRequest) {
        String prompt = buildPrompt(emailRequest);

        String requestBody = String.format("""
                {
                  "contents": [
                    {
                      "parts": [
                        {
                          "text": "%s"
                        }
                      ]
                    }
                  ]
                }
                """, escapeForJson(prompt));

        String response = restClient.post()
                .uri("/v1beta/models/gemini-2.5-flash:generateContent")
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(String.class);

        return extractResponseContent(response);
    }

    // Improve Existing Reply
    public String improveEmailReply(ImproveRequest improveRequest) {
        String prompt = buildImprovePrompt(improveRequest);

        String requestBody = String.format("""
                {
                  "contents": [
                    {
                      "parts": [
                        {
                          "text": "%s"
                        }
                      ]
                    }
                  ]
                }
                """, escapeForJson(prompt));

        String response = restClient.post()
                .uri("/v1beta/models/gemini-2.5-flash:generateContent")
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(String.class);

        return extractResponseContent(response);
    }

    // --- Helper methods ---

    // Simple escaping so multi-line prompts don't break JSON
    private String escapeForJson(String text) {
        return text
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "");
    }

    private String extractResponseContent(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);
            return root.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (JsonProcessingException | NullPointerException e) {
            throw new RuntimeException("Failed to parse Gemini response: " + response, e);
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        String originalEmail = emailRequest.getEmailContent();
        String tone = emailRequest.getTone();
        if (tone == null) {
            tone = "";
        }
        tone = tone.trim().toLowerCase();

        String toneGuidelines;
        switch (tone) {
            case "professional" -> toneGuidelines = """
                    - Tone: Professional, polite and respectful.
                    - Use clear, concise sentences.
                    - Avoid slang and emojis.
                    - Use proper greetings and sign-offs.
                    """;
            case "casual" -> toneGuidelines = """
                    - Tone: Casual and relaxed, but still respectful.
                    - You can use contractions (I'm, don't, can't).
                    - Use simple, natural language.
                    - Avoid overly formal phrases and buzzwords.
                    """;
            case "friendly" -> toneGuidelines = """
                    - Tone: Warm, positive and friendly.
                    - Show empathy and enthusiasm where appropriate.
                    - Keep it simple and easy to read.
                    - You may add a friendly closing line.
                    """;
            case "short" -> toneGuidelines = """
                    - Tone: Short and direct.
                    - Keep the reply brief (2–5 sentences).
                    - Go straight to the point while staying polite.
                    - Avoid unnecessary details or long explanations.
                    """;
            default -> toneGuidelines = """
                    - Tone: Match the formality of the original email.
                    - Be clear, polite and natural.
                    """;
        }

        String prompt = """
                You are an expert email assistant.
                Write a complete reply to the email below.

                Requirements:
                %s
                - Respond as if you are the recipient of the email.
                - Answer all questions and acknowledge important points.
                - Keep the reply focused on the email content.
                - Do NOT include a subject line.
                - Do NOT explain what you are doing, only output the email text.
                - Do NOT mention that you are an AI.
                - Write the reply in the same language as the original email.

                Original Email:
                %s
                """;

        return String.format(prompt, toneGuidelines, originalEmail);
    }

    // Build Prompt for Improving Reply
    private String buildImprovePrompt(ImproveRequest request) {
        String originalReply = request.getOriginalReply();
        String improvementType = request.getImprovementType();

        if (improvementType == null) {
            improvementType = "general";
        }
        improvementType = improvementType.trim().toLowerCase();

        String improvementGuidelines;
        switch (improvementType) {
            case "grammar" -> improvementGuidelines = """
                    - Fix all grammar and spelling mistakes.
                    - Correct punctuation errors.
                    - Ensure proper sentence structure.
                    - Keep the original meaning and tone.
                    """;
            case "professional" -> improvementGuidelines = """
                    - Make the tone more professional and formal.
                    - Remove casual language and slang.
                    - Use business-appropriate vocabulary.
                    - Maintain proper email etiquette.
                    - Add professional greetings/closings if missing.
                    """;
            case "concise" -> improvementGuidelines = """
                    - Make the email shorter and more direct.
                    - Remove unnecessary words and redundancy.
                    - Keep only essential information.
                    - Maintain clarity and politeness.
                    """;
            case "friendly" -> improvementGuidelines = """
                    - Make the tone warmer and more approachable.
                    - Add friendly expressions where appropriate.
                    - Show empathy and positivity.
                    - Keep it professional but personable.
                    """;
            case "clarity" -> improvementGuidelines = """
                    - Improve clarity and readability.
                    - Simplify complex sentences.
                    - Make the message easy to understand.
                    - Organize information logically.
                    """;
            default -> improvementGuidelines = """
                    - Fix grammar and spelling errors.
                    - Improve clarity and readability.
                    - Enhance professional tone.
                    - Make it more polished overall.
                    """;
        }

        String prompt = """
                You are an expert email editor and writing assistant.
                Improve the email reply below based on these guidelines:

                Improvement Focus:
                %s

                Important Rules:
                - Keep the core message and intent intact.
                - Do NOT change the main points or meaning.
                - Do NOT add new information that wasn't in the original.
                - Do NOT include a subject line.
                - Do NOT explain your changes, only output the improved email.
                - Output ONLY the improved email text, nothing else.
                - Maintain the same language as the original.

                Original Reply to Improve:
                %s
                """;

        return String.format(prompt, improvementGuidelines, originalReply);
    }
}