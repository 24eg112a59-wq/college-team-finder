import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FolderKanban } from 'lucide-react';

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiService.admin.projects().then(({ data }) => setProjects(data))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load projects.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading projects..." />;
  return (
    <div className="container py-4">
      <div className="page-header"><span className="page-eyebrow">ADMINISTRATION</span><h2>Projects</h2><p>Project status, ownership, and current capacity.</p></div>
      {error && <div className="alert alert-danger">{error}</div>}
      {!error && projects.length === 0 && <div className="empty-state"><span className="empty-state-icon"><FolderKanban size={22} /></span><h3>No projects created</h3><p>Student projects will appear here when they are published.</p></div>}
      {projects.length > 0 &&
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Project</th>
              <th>Category</th>
              <th>Status</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{project.category}</td>
                <td><span className={`badge status-badge status-${(project.status || 'open').toLowerCase().replaceAll('_', '-')}`}>{project.status || 'OPEN'}</span></td>
                <td>{project.ownerName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
}
