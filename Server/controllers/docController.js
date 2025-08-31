const Document = require('../models/Document');
const { generateContent, generateTags, semanticSearch, answerQuestion } = require('../utils/gemini.js');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// Create Document
exports.createDoc = async (req, res) => {
  try {
    const { title, content } = req.body;

    const summary = await generateContent(content);
    const tags = await generateTags(content);

    const doc = await Document.create({
      title,
      content,
      summary,
      tags,
      createdBy: req.user._id,
      // Do NOT set updatedBy here
    });

    let populatedDoc = await Document.findById(doc._id)
      .populate('createdBy', 'name email role')
      .populate('updatedBy', 'name email role');

    // Remove updatedBy and updatedAt if not set
    const docResponse = populatedDoc.toObject();
    if (!docResponse.updatedBy) {
      delete docResponse.updatedBy;
      delete docResponse.updatedAt;
    }

    res.status(201).json(docResponse);
  } catch (err) {
    console.error("Create Doc Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update Document
exports.updateDoc = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Doc not found' });

    if (req.user.role !== 'admin' && !doc.createdBy.equals(req.user._id))
      return res.status(403).json({ message: 'Forbidden' });

    const { title, content } = req.body;
    doc.title = title || doc.title;
    doc.content = content || doc.content;
    doc.summary = await generateContent(doc.content);
    doc.tags = await generateTags(doc.content);
    doc.updatedBy = req.user._id; // Set updatedBy only on update

    await doc.save();

    let updatedDoc = await Document.findById(doc._id)
      .populate('createdBy', 'name email role')
      .populate('updatedBy', 'name email role');

    const docResponse = updatedDoc.toObject();
    if (!docResponse.updatedBy) delete docResponse.updatedBy;

    res.json(docResponse);
  } catch (err) {
    console.error("Update Doc Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all Documents
exports.getDocs = async (req, res) => {
  try {
    let docs = await Document.find()
      .populate('createdBy', 'name email role')
      .populate('updatedBy', 'name email role');

    if (req.query.q) docs = await semanticSearch(req.query.q, docs);

    res.json(docs);
  } catch (err) {
    console.error("Get Docs Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get single Document
exports.getDoc = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('updatedBy', 'name email role');

    if (!doc) return res.status(404).json({ message: 'Doc not found' });

    res.json(doc);
  } catch (err) {
    console.error("Get Doc Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete Document
exports.deleteDoc = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Doc not found' });

    if (req.user.role !== 'admin' && !doc.createdBy.equals(req.user._id))
      return res.status(403).json({ message: 'Forbidden' });

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doc removed' });
  } catch (err) {
    console.error("Delete Doc Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Ask Question
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

    const answer = docs[0].content; // return best matching doc content
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



// ✅ Summarize
exports.summarizeDoc = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "No content provided" });
    }

    const prompt = `Summarize the following text in simple, clear points:\n\n${content}`;
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({ summary });
  } catch (error) {
    console.error("❌ Error summarizing:", error);
    res.status(500).json({ message: "Error generating summary" });
  }
};

// ✅ Generate Tags
exports.generateTags = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "No content provided" });
    }

    const prompt = `Extract 5-7 relevant, short tags (single words or small phrases) for the following text:\n\n${content}`;
    const result = await model.generateContent(prompt);
    const tagsText = result.response.text();

    // Convert output to array
    const tags = tagsText
      .split(/[,;\n]/)
      .map(t => t.trim())
      .filter(Boolean);

    res.json({ tags });
  } catch (error) {
    console.error("❌ Error generating tags:", error);
    res.status(500).json({ message: "Error generating tags" });
  }
};

// ✅ Document History
exports.getDocHistory = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Doc not found" });

    // For now: return past versions from DB if you track them
    // Or use AI to generate a "history" from current content
    const prompt = `Write a short chronological history of the main events/topics discussed in this text:\n\n${doc.content}`;
    const result = await model.generateContent(prompt);
    const historyText = result.response.text();

    // Mock structure
    res.json({
      history: [
        { at: doc.createdAt, by: doc.createdBy, action: "Created", snapshot: doc },
        { action: "AI Generated History", snapshot: historyText }
      ]
    });
  } catch (error) {
    console.error("❌ Error fetching history:", error);
    res.status(500).json({ message: "Error fetching history" });
  }
};
