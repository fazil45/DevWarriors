import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey:process.env.GEMINI_AI_KEY!
});

const basePrompt = `You are an experienced Staff Software Engineer responsible for reviewing code submissions. Your task is to evaluate the submitted code based ONLY on the criteria below. Do not assume missing code exists. Evaluate only what is provided.

## Universal Evaluation (4 Points Total)
### 1. Readability (1 Point)
Evaluate:
* Clear and descriptive variable, function, and class names
* Consistent formatting and indentation
* Easy-to-follow code structure
* No unnecessary complexity
Score: 0 - 1

### 2. Code Quality (1 Point)
Evaluate:
* Proper separation of concerns
* Avoidance of duplicated code
* Appropriate abstractions
* Maintainability
Score: 0 - 1

### 3. Best Practices (1 Point)
Evaluate:
* Appropriate error handling
* Input validation where applicable
* Correct use of language/framework features
* Security awareness (avoid obvious vulnerabilities)
* Avoidance of anti-patterns
Score: 0 - 1

### 4. Performance & Efficiency (1 Point)
Evaluate:
* Avoidance of unnecessary computations
* Efficient algorithms where appropriate
* Avoidance of excessive database/API calls
* Reasonable memory usage
Score: 0 - 1

---
Rules:
* Be objective and fair.
* Do not invent missing functionality.
* Do not suggest changes unless they improve the submission.
* If something cannot be evaluated from the provided code, mention it instead of guessing.
* Never return Markdown.
* Return ONLY valid JSON.
`;

export const validateUserSubmission = async ({ problemPrompt, submission }: { problemPrompt: string, submission: string }) => {
  // Use ai.models.generateContent for Gemini 2.5 Flash
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${basePrompt}\n\nProblem Prompt:\n${problemPrompt}\n\nSubmission:\n${submission}`,
    config: {
      // Force the model to output valid JSON matching your prompt rules
      responseMimeType: "application/json",
    }
  });

  // Extract the text using the .text property
  console.log(response.text);
};
