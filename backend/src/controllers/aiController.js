/**
 * AI Assistant Controller using Google Gemini API
 */

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash'
];

/**
 * Call Google Gemini REST API with fallback models
 */
async function callGeminiApi(apiKey, contents, systemPrompt) {
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const body = {
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.95
        }
      };

      if (systemPrompt) {
        body.systemInstruction = {
          parts: [{ text: systemPrompt }]
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data?.error?.message || `HTTP ${response.status} from Gemini API`;
        // If model not found (404), try next fallback model
        if (response.status === 404) {
          lastError = new Error(errorMsg);
          continue;
        }
        throw new Error(errorMsg);
      }

      const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
      if (!text) {
        throw new Error('Gemini returned an empty response.');
      }

      return { text, model };
    } catch (err) {
      lastError = err;
      if (err.message && err.message.includes('404')) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('All Gemini models failed to generate content.');
}

/**
 * Check Gemini API key availability
 * GET /api/ai/status
 */
exports.getStatus = (req, res) => {
  const hasEnvKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim());
  res.status(200).json({
    success: true,
    hasServerKey: hasEnvKey,
    recommendedModel: 'gemini-2.5-flash'
  });
};

/**
 * Chat with Gemini AI
 * POST /api/ai/chat
 */
exports.chat = async (req, res, next) => {
  try {
    const { prompt, conversationHistory = [], contextData = {}, clientApiKey } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required and cannot be empty.'
      });
    }

    const apiKey = (clientApiKey && clientApiKey.trim()) || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_API_KEY',
        message: 'No Google Gemini API Key found. Please add GEMINI_API_KEY to your environment or provide one in the AI Assistant settings.'
      });
    }

    // Build context-aware system instruction
    let systemInstruction = `You are EMS Copilot, an elite AI workforce intelligence assistant integrated inside the EMS Portal (Employee Management System).
Your role is to assist managers, HR professionals, and team leads with workforce analytics, task delegation, team organization, drafting official communications, performance evaluations, and employee insights.
Always respond in concise, beautifully formatted GitHub Markdown with bullet points, bold highlights, or tables when appropriate.
Keep answers professional, actionable, and structured.`;

    if (contextData && Object.keys(contextData).length > 0) {
      systemInstruction += `\n\nCURRENT EMS PORTAL LIVE CONTEXT:
- Total Employees in Directory: ${contextData.totalEmployees ?? 'N/A'}
- Active Tasks: ${contextData.totalTasks ?? 'N/A'}
- Completed Tasks: ${contextData.completedTasks ?? 'N/A'}
- Pending Tasks: ${contextData.pendingTasks ?? 'N/A'}
- Top Departments: ${Array.isArray(contextData.departments) ? contextData.departments.join(', ') : 'N/A'}
Use this live data accurately when answering queries about the company, workforce, or current workload.`;
    }

    // Format conversation history for Gemini API
    const formattedContents = [];

    if (Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory.slice(-10)) {
        if (!msg.text || !msg.role) continue;
        formattedContents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }

    // Append latest user prompt
    formattedContents.push({
      role: 'user',
      parts: [{ text: prompt.trim() }]
    });

    const { text, model } = await callGeminiApi(apiKey, formattedContents, systemInstruction);

    return res.status(200).json({
      success: true,
      message: 'Generated successfully',
      reply: text,
      modelUsed: model
    });
  } catch (err) {
    console.error('Gemini AI error:', err.message);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to generate response from Gemini AI.'
    });
  }
};
