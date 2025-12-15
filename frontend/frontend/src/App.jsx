import React, { useState } from 'react';
import AddResult from './pages/AddResult';
import ViewResult from './pages/ViewResult';
import UpdateMarks from './pages/UpdateMarks';
import DeleteStudent from './pages/DeleteStudent';
import AllStudents from './pages/AllStudents';

export default function App() {
  const [page, setPage] = useState('add');

  return (
    <div className="container">
      <div className="header">
        <h1>College Result System</h1>

        <div className="nav">
          <button className="button" onClick={() => setPage('add')}>
            Add Result
          </button>

          <button className="button" onClick={() => setPage('view')}>
            View Result
          </button>

          <button className="button" onClick={() => setPage('update')}>
            Update Marks
          </button>

          <button className="button" onClick={() => setPage('delete')}>
            Delete Student
          </button>

          {/* ✅ NEW BUTTON */}
          <button className="button" onClick={() => setPage('all')}>
            All Students
          </button>
        </div>
      </div>

      {/* ✅ PAGE RENDERING */}
      {page === 'add' && <AddResult />}
      {page === 'view' && <ViewResult />}
      {page === 'update' && <UpdateMarks />}
      {page === 'delete' && <DeleteStudent />}
      {page === 'all' && <AllStudents />}
    </div>
  );
}
