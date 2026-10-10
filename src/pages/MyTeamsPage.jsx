import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { UsersRound } from 'lucide-react';

export default function MyTeamsPage() {
  const { auth } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiService.projects.getAll()
      .then(({ data }) => setProjects(data.filter((project) => project.ownerId === auth.id || project.teamMembers.some((member) => member.id === auth.id))))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load teams.'))
      .finally(() => setLoading(false));
  }, [auth.id]);

  if (loading) return <LoadingSpinner label="Loading teams..." />;

  return (
    <div className="container py-4">
      <div className="page-header"><span className="page-eyebrow">COLLABORATION</span><h2>My teams</h2><p>Project teams you lead or have joined.</p></div>
      {error && <div className="alert alert-danger">{error}</div>}
      {!error && projects.length === 0 && <div className="empty-state"><span className="empty-state-icon"><UsersRound size={22} /></span><h3>Your team list is empty</h3><p>Accept an invitation or start your own project to form a team.</p><Link className="btn btn-outline-primary btn-sm" to="/student/find-teammates">Find teammates</Link></div>}
      {projects.map((project) => (
        <div key={project.id} className="card shadow-sm border-0 mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h5>{project.title}</h5>
              <span className="badge capacity-badge">Team: {project.teamSize} / {project.maxTeamSize}</span>
            </div>
            <ul className="list-group list-group-flush mt-3">
              <li className="list-group-item px-0">{project.ownerName} • Project owner</li>
              {project.teamMembers.map((member) => (
                <li key={member.id} className="list-group-item px-0">
                  {member.name}{member.branch ? ` · ${member.branch}` : ''}{member.year ? ` · Year ${member.year}` : ''}
                </li>
              ))}
            </ul>
            <Link className="btn btn-outline-primary btn-sm mt-3" to={`/student/projects/${project.id}`}>Project details</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
