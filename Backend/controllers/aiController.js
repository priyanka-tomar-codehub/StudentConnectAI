import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  console.log(
    "Gemini API Key Loaded:",
    Boolean(process.env.GEMINI_API_KEY)
  );
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
};

export const generateInterview = async (req, res) => {
  try {
    const {
      role,
      company,
      domain,
      difficulty = "beginner",
      previousQuestions = [],
    } = req.body;

    if (!role || !domain) {
      return res.status(400).json({
        success: false,
        message: "Role and interview domain are required",
      });
    }

    const allowedDifficulties = [
      "beginner",
      "intermediate",
      "advanced",
    ];

    if (!allowedDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty level",
      });
    }

    const prompt = `
You are an experienced technical interviewer.

Generate exactly 5 interview questions.

Candidate details:
Job Role: ${role}
Domain: ${domain}
Company: ${company || "General Software Company"}
Difficulty: ${difficulty}

Instructions:
1. Generate questions strictly relevant to the selected role and domain.
2. Do not assume the candidate is applying for a Full Stack role.
3. Beginner: Test fundamentals and basic concepts.
4. Intermediate: Test practical knowledge and problem solving.
5. Advanced: Test complex scenarios and deeper technical understanding.
6. Use simple, clear interview language.
7. Generate different questions, not repeated versions of the same question.

Previously asked questions:
${previousQuestions.length
  ? previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")
  : "No previous questions."
}

Do not repeat or closely rephrase any previously asked question.

Return ONLY a numbered list containing exactly 5 questions.
`;

    const ai = getAI();

   const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    
  });

    if (!response.text) {
      return res.status(502).json({
        success: false,
        message: "AI returned an empty response. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      data: response.text,
    });

  } catch (error) {
    console.error("GEMINI ERROR DETAILS:", {
      message: error.message,
      status: error.status,
      code: error.code,
    });
 

    const status = Number(error.status || error.code);

    if (status === 503 || status === 429) {
      return res.status(status).json({
        success: false,
        message:
          status === 503
            ? "AI service is temporarily busy. Please try again shortly."
            : "AI request limit reached. Please try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to generate interview questions.",
    });
  }
};


export const evaluateAnswer = async (req, res) => {
  try {
    const {
      question,
      answer,
    } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required",
      });
    }

    const prompt = `
You are a technical interview evaluator.

Question: ${question}

Candidate Answer: ${answer}

Evaluate briefly.

Return:
Score: X/10
Strengths: Mention 2 points.
Weaknesses: Mention 2 points.
Improvement: Give one practical suggestion.

Keep feedback simple, specific and concise.
`;
    const ai = getAI();
    const response = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",
  contents: prompt,
  config: {
    temperature: 0.3,
    maxOutputTokens: 300,
  },
});

    return res.status(200).json({
      success: true,
      data: response.text,
    });
 } catch (error) {
  console.error("Gemini API Error:", error);
  

  const status = error.status || error.code;

  if (status === 503 || status === 429) {
    return res.status(status).json({
      success: false,
      message:
        status === 503
          ? "AI service is temporarily busy. Please try again shortly."
          : "AI request limit reached. Please try again later.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Unable to process your AI request.",
  });
}
};