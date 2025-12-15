import React, { useState } from 'react';
import { getJSON } from '../api';

export default function ViewResult() {
  const [roll, setRoll] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Calculate overall grade
  function calculateOverallGrade(results) {
    const total = results.reduce((sum, r) => sum + r.marks, 0);
    const average = total / results.length;

    let grade = "F";
    if (average >= 90) grade = "A+";
    else if (average >= 80) grade = "A";
    else if (average >= 70) grade = "B";
    else if (average >= 60) grade = "C";

    return {
      total,
      average: average.toFixed(2),
      grade
    };
  }

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setData(null);
    try {
      const res = await getJSON(`/results/${roll}`);
      setData(res);
    } catch (err) {
      setData({ error: 'Fetch error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>View Student Results</h2>

      <form onSubmit={handleSearch} className="form-row">
        <input
          placeholder="Roll Number"
          value={roll}
          onChange={e => setRoll(e.target.value)}
          required
        />
        <button className="button">Search</button>
      </form>

      {loading && <p className="muted">Loading...</p>}
      {data && data.error && <p className="muted">Error: {data.error}</p>}

      {data && data.student && (
        <div style={{ marginTop: 12 }}>

          {/* 🔹 Student Info */}
          <div className="card">
            <h3>
              {data.student.name}
              <span className="muted"> ({data.student.rollNumber})</span>
            </h3>
            <p className="muted">{data.student.department}</p>
          </div>

          {/* 🔹 Subject-wise Results */}
          <div className="card">
            <h4>Subject-wise Results</h4>
            <table className="table">
              <thead>
                <tr>
                  <th>Semester</th>
                  <th>Subject</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {data.results.map((r, idx) => (
                  <tr key={idx}>
                    <td>{r.semester}</td>
                    <td>{r.subject}</td>
                    <td>{r.marks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔹 Overall Grade */}
          {data.results.length > 0 && (() => {
            const overall = calculateOverallGrade(data.results);
            return (
              <div className="card">
                <h3>Overall Performance</h3>
                <p><strong>Total Marks:</strong> {overall.total}</p>
                <p><strong>Average:</strong> {overall.average}</p>
                <p>
                  <strong>Grade:</strong>{" "}
                  <span style={{
                    fontWeight: "bold",
                    color:
                      overall.grade === "A+" ? "green" :
                      overall.grade === "A" ? "blue" :
                      overall.grade === "B" ? "orange" :
                      "red"
                  }}>
                    {overall.grade}
                  </span>
                </p>
              </div>
            );
          })()}

        </div>
      )}
    </div>
  );
}
