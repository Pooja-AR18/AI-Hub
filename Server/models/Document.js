const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  action: String,
  by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  snapshot: Object,
  at: { type: Date, default: Date.now }
}, { _id: false });

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String },
  tags: [{ type: String }],
  embedding: {
    type: [Number], 
    default: []
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Required for $text search
documentSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Document', documentSchema);
