import React, { useState } from 'react';
import { delJSON } from '../api';

export default function DeleteStudent() {
  const [roll, setRoll] = useState('');
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleDelete(e) {
    e.preventDefault();

    if (!window.confirm(`Delete student ${roll} and all results?`)) return;

    setLoading(true);
    setResp(null);

    try {
      const res = await delJSON(`/results/${encodeURIComponent(roll)}`);
      setResp(res);
      setRoll('');
    } catch (err) {
      setResp({ error: 'Server error while deleting student' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Delete Student & Results</h2>

      <form onSubmit={handleDelete} className="form-row">
        <input
          placeholder="Roll Number"
          value={roll}
          onChange={e => setRoll(e.target.value)}
          required
        />
        <button className="button danger" disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </form>

      {/* ✅ SUCCESS MESSAGE */}
      {resp && resp.message && (
        <div className="alert success">
          ✅ {resp.message}
        </div>
      )}

      {/* ❌ ERROR MESSAGE */}
      {resp && resp.error && (
        <div className="alert error">
          ❌ {resp.error}
        </div>
      )}
    </div>
  );
}
