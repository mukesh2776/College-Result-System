import React, { useState } from 'react';
import { postJSON } from '../api';

export default function AddResult() {
  const [rollNumber, setRollNumber] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState(1);
  const [subjects, setSubjects] = useState([{ subject: '', marks: '' }]);
  const [response, setResponse] = useState(null);

  function addSubject() {
    setSubjects(s => [...s, { subject: '', marks: '' }]);
  }
  function removeSubject(i) {
    setSubjects(s => s.filter((_, idx) => idx !== i));
  }
  function updateSubject(i, key, value) {
    setSubjects(s => s.map((it, idx) => idx === i ? { ...it, [key]: value } : it));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      rollNumber, name, department, semester: Number(semester),
      marks: subjects.map(s => ({ subject: s.subject, marks: Number(s.marks) }))
    };
    const res = await postJSON('/results', payload);
    setResponse(res);
  }

  return (
    <div className="card">
      <h2>Add / Update Student Result</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input placeholder="Roll Number" value={rollNumber} onChange={e => setRollNumber(e.target.value)} required />
          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
          <input placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} required />
          <input className="small" type="number" min="1" placeholder="Semester" value={semester} onChange={e => setSemester(e.target.value)} required />
        </div>

        <div>
          <h4>Subjects</h4>
          {subjects.map((s, i) => (
            <div key={i} className="form-row">
              <input placeholder="Subject" value={s.subject} onChange={e => updateSubject(i, 'subject', e.target.value)} required />
              <input placeholder="Marks" type="number" min="0" max="100" value={s.marks} onChange={e => updateSubject(i, 'marks', e.target.value)} required />
              <button type="button" className="button" onClick={() => removeSubject(i)}>Remove</button>
            </div>
          ))}
          <button type="button" className="button" onClick={addSubject}>Add Subject</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="button">Submit</button>
        </div>
      </form>

      {response && response.student && (
  <div className="card" style={{ marginTop: 20 }}>
    <h3>Result Added Successfully ✅</h3>

    <p><strong>Name:</strong> {response.student.name}</p>
    <p><strong>Roll No:</strong> {response.student.rollNumber}</p>
    <p><strong>Department:</strong> {response.student.department}</p>

    <h4 style={{ marginTop: 10 }}>Subject-wise Marks</h4>
    <table className="table">
      <thead>
        <tr>
          <th>Subject</th>
          <th>Marks</th>
        </tr>
      </thead>
      <tbody>
        {response.results.map((r) => (
          <tr key={r._id}>
            <td>{r.subject}</td>
            <td>{r.marks}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h4 style={{ marginTop: 10 }}>Overall Performance</h4>
    <p><strong>Total:</strong> {response.grade.total}</p>
    <p><strong>Average:</strong> {response.grade.average}</p>
    <p><strong>Grade:</strong> 
      <span style={{ color: "green", fontWeight: "bold" }}>
        {" "}{response.grade.grade}
      </span>
    </p>
  </div>
)}

    </div>
  );
}
