import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { FolderPlus, Plus } from 'lucide-react';

export default function MyProjectsPage() {
  const { auth } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiService.projects.getAll()
      .then(({ data }) => setProjects(data.filter((project) => project.ownerId === auth.id)))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load projects.'))
      .finally(() => setLoading(false));
  }, [auth.id]);

  if (loading) return <LoadingSpinner label="Loading projects..." />;

  return (
    <div className="container py-4">
      <div className="page-header d-flex flex-wrap justify-content-between align-items-end gap-3">
        <div><span className="page-eyebrow">YOUR WORKSPACE</span><h2>My projects</h2><p>Projects you own and the teams you’re building.</p></div>
        <Link className="btn btn-primary" to="/student/projects/create"><Plus size={16} /> Create project</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {!error && projects.length === 0 && <div className="empty-state"><span className="empty-state-icon"><FolderPlus size={22} /></span><h3>No projects yet</h3><p>Start a project, describe the skills you need, and invite classmates to join your team.</p><Link className="btn btn-primary btn-sm" to="/student/projects/create"><Plus size={14} /> Create your first project</Link></div>}

      <div className="row g-3">
        {projects.map((project) => (
          <div className="col-lg-6" key={project.id}>
            <ProjectCard project={project} onSelect={() => { window.location.href = `/student/projects/${project.id}`; }} />
          </div>
        ))}
      </div>
    </div>
  );
}
