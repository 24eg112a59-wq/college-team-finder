import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { UsersRound } from 'lucide-react';

export default function ManageStudentsPage() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiService.admin.students().then(({ data }) => setStudents(data))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load students.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading students..." />;
  return (
    <div className="container py-4">
      <div className="page-header"><span className="page-eyebrow">ADMINISTRATION</span><h2>Students</h2><p>Registered students and their academic details.</p></div>
      {error && <div className="alert alert-danger">{error}</div>}
      {!error && students.length === 0 && <div className="empty-state"><span className="empty-state-icon"><UsersRound size={22} /></span><h3>No students registered</h3><p>New student accounts will appear here after registration.</p></div>}
      {students.length > 0 && <div className="table-caption">{students.length} {students.length === 1 ? 'student' : 'students'}</div>}
      {students.length > 0 &&
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Branch</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.branch}</td>
                <td>{student.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
}
