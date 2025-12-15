const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Result = require('../models/result');
const calculateGrades = require('../gradeCalculator');


router.post('/results', async (req, res) => {
  try {
    const { rollNumber, name, department, semester, marks } = req.body;
    if (!rollNumber || !name || !department || !Array.isArray(marks)) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    let student = await Student.findOne({ rollNumber });
    if (!student) {
      student = await Student.create({ name, rollNumber, department });
    } else {
      student.name = name;
      student.department = department;
      await student.save();
    }

    const ops = marks.map(m => ({
      updateOne: {
        filter: { studentId: student._id, subject: m.subject, semester },
        update: { $set: { marks: m.marks } },
        upsert: true
      }
    }));

 
    await Result.bulkWrite(ops);

    const studentResults = await Result.find({ studentId: student._id, semester });
    const gradeInfo = calculateGrades(studentResults.map(r => ({ subject: r.subject, marks: r.marks })));

    res.status(201).json({ student, results: studentResults, grade: gradeInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/results/all', async (req, res) => {
  try {
    const students = await Student.find();

    const response = [];

    for (const student of students) {
      const results = await Result.find({ studentId: student._id });

      if (results.length === 0) continue;

      const total = results.reduce((sum, r) => sum + r.marks, 0);
      const average = (total / results.length).toFixed(2);

      let grade = 'Fail';
      if (average >= 85) grade = 'A';
      else if (average >= 70) grade = 'B';
      else if (average >= 50) grade = 'C';

      response.push({
        rollNumber: student.rollNumber,
        name: student.name,
        department: student.department,
        subjects: results.length,
        total,
        average,
        grade
      });
    }

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/results/:rollNumber', async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const student = await Student.findOne({ rollNumber });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const results = await Result.find({ studentId: student._id }).sort({ semester: 1, subject: 1 });
    res.json({ student, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/results/:rollNumber/:subject', async (req, res) => {
  try {
    const { rollNumber, subject } = req.params;
    const { marks, semester } = req.body;
    if (marks === undefined) return res.status(400).json({ message: 'Marks required' });

    const student = await Student.findOne({ rollNumber });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const filter = { studentId: student._id, subject, semester };
    const update = { marks };
    const updated = await Result.findOneAndUpdate(filter, update, { new: true });
    if (!updated) {
    
      const created = await Result.create({ studentId: student._id, subject, marks, semester });
      return res.json({ message: 'Result created', result: created });
    }
    res.json({ message: 'Result updated', result: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/results/:rollNumber', async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const student = await Student.findOne({ rollNumber });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    await Result.deleteMany({ studentId: student._id });
    await Student.deleteOne({ _id: student._id });

    res.json({ message: 'Student and their results deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/grades/calc', (req, res) => {
  try {
    const marks = req.body.marks;
    const grade = calculateGrades(marks || []);
    res.json(grade);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
