const Document = require('../models/Document');
const { semanticSearch, answerQuestion } = require('../utils/gemini');

// -------------------- SEARCH DOCS --------------------
exports.searchDocs = async (req, res) => {
  try {
    const { query, tags, mode } = req.body;

    if (!query?.trim()) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const tagArray = Array.isArray(tags) ? tags : [];
    const filter = tagArray.length ? { tags: { $in: tagArray } } : {};

    let results = [];

    if (mode === 'text') {
      results = await Document.find({ ...filter, $text: { $search: query } }, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .limit(10);
    } else if (mode === 'semantic') {
      const allDocs = await Document.find(filter);
      const scoredDocs = await semanticSearch(query, allDocs);
      results = scoredDocs.map(d => ({ ...d.doc.toObject(), score: d.score }));
    }

    res.json({ results });
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// -------------------- Q&A --------------------
exports.answerQuestion = async (req, res) => {
  try {
    const { question, tags } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({ message: 'Question is required' });
    }

    const tagArray = Array.isArray(tags) ? tags : [];
    const filter = tagArray.length ? { tags: { $in: tagArray } } : {};

    const allDocs = await Document.find(filter);
    const answer = await answerQuestion(question, allDocs);

    res.json({ answer });
  } catch (error) {
    console.error('Answer Q&A Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
