require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY not found in .env');
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ---------------------------
// Generate summary
// ---------------------------
async function generateContent(text) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following text in 2-3 sentences WITHOUT any formatting or markdown:\n\n${text}`,
    });
    return response?.text?.trim() || 'No summary generated';
  } catch (err) {
    console.error('Error generating summary:', err);
    return 'Error generating summary';
  }
}

// Generate tags

async function generateTags(text) {
  try {
    const prompt = `
      Generate 5 short tags (1-2 words each) for the following text.
      Return ONLY a valid JSON array of strings. No explanations, no markdown.
      Text: """${text}"""
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const tags = JSON.parse(response.text);
    return Array.isArray(tags) ? tags.map(t => t.trim()) : [];
  } catch (err) {
    console.error('Error generating tags:', err);
    return [];
  }
}



// Semantic search using Gemini scoring

async function semanticSearch(query, docs) {
  try {
    const scoredDocs = [];

    for (const doc of docs) {
      const prompt = `
        On a scale from 0 to 1, how relevant is the following document to the query? 
        Only respond with a decimal number between 0 (not relevant) and 1 (fully relevant).

        Query: "${query}"
        Document: """${doc.content}"""
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      let score = parseFloat(response?.text?.trim());
      if (isNaN(score)) score = 0; // handle invalid AI output
      if (score > 0) {
        scoredDocs.push({ doc, score });
      }
    }

    scoredDocs.sort((a, b) => b.score - a.score);
    return scoredDocs.slice(0, 10); // top 10 relevant docs only
  } catch (err) {
    console.error('Error in semanticSearch:', err);
    return [];
  }
}



// Q&A based on documents

async function answerQuestion(question, docs) {
  try {
    const combinedText = docs.map(d => d.content).join('\n\n');
    const prompt = `
      Answer the question based ONLY on the following documents.
      If the answer is not present, say "Answer not found".

      Documents:
      ${combinedText}

      Question: ${question}
      Answer:
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response?.text?.trim() || 'No answer found';
  } catch (err) {
    console.error('Error generating answer:', err);
    return 'Error generating answer';
  }
}

// Export functions

module.exports = {
  generateContent,
  generateTags,
  semanticSearch,
  answerQuestion,
};
