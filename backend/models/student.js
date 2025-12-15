const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  department: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('student', StudentSchema);
