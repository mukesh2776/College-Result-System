import React, { useEffect, useState } from 'react';
import { getJSON } from '../api';

export default function AllStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const res = await getJSON('/results/all');
      setStudents(res);
      setLoading(false);
    }
    fetchAll();
  }, []);

  return (
    <div className="card">
      <h2>All Students & Grades</h2>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : students.length === 0 ? (
        <p className="muted">No students found</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Dept</th>
              <th>Subjects</th>
              <th>Total</th>
              <th>Average</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i}>
                <td>{s.rollNumber}</td>
                <td>{s.name}</td>
                <td>{s.department}</td>
                <td>{s.subjects}</td>
                <td>{s.total}</td>
                <td>{s.average}</td>
                <td>
                  <span className={`grade ${s.grade.toLowerCase()}`}>
                    {s.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
