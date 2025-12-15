import React, { useState } from 'react';
import { putJSON } from '../api';

export default function UpdateMarks() {
  const [roll, setRoll] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState(1);
  const [marks, setMarks] = useState('');
  const [response, setResponse] = useState(null);

  async function handleUpdate(e) {
    e.preventDefault();
    const res = await putJSON(`/results/${encodeURIComponent(roll)}/${encodeURIComponent(subject)}`, { marks: Number(marks), semester: Number(semester) });
    setResponse(res);
  }

  return (
    <div className="card">
      <h2>Update Subject Marks</h2>
      <form onSubmit={handleUpdate}>
        <div className="form-row">
          <input placeholder="Roll Number" value={roll} onChange={e => setRoll(e.target.value)} required />
          <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} required />
          <input className="small" placeholder="Semester" type="number" min="1" value={semester} onChange={e => setSemester(e.target.value)} required />
          <input placeholder="Marks" type="number" min="0" max="100" value={marks} onChange={e => setMarks(e.target.value)} required />
        </div>
        <button className="button">Update</button>
      </form>

      {response && response.result && (
  <div className="card" style={{ marginTop: 20 }}>
    <h3>Marks Updated Successfully ✨</h3>
    <p><strong>Subject:</strong> {response.result.subject}</p>
    <p><strong>Updated Marks:</strong> {response.result.marks}</p>
    <p><strong>Semester:</strong> {response.result.semester}</p>
  </div>
)}

    </div>
  );
}
