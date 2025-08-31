const Document = require('../models/Document');

exports.askQuestion = async (req, res) => {
  const { question } = req.body;

  if (!question) return res.status(400).json({ message: 'Question is required' });

  try {
    const docs = await Document.find(
      { $text: { $search: question } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } }).limit(5);

    if (docs.length === 0) {
      return res.json({ answer: 'No relevant document found.', sources: [] });
    }

    const answer = docs[0].content; 
    const sources = docs.map(doc => ({
      _id: doc._id,
      title: doc.title,
      score: doc.score
    }));

    res.json({ answer, sources });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
