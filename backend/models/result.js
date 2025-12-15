const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: true },
  subject: { type: String, required: true },
  marks: { type: Number, required: true },
  semester: { type: Number, required: true }
}, { timestamps: true });

ResultSchema.index({ studentId: 1, subject: 1, semester: 1 }, { unique: false });

module.exports = mongoose.model('result', ResultSchema);
