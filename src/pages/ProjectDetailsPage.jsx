import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import SkillBadge from '../components/SkillBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiService.projects.getById(id)
      .then(({ data }) => setProject(data))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load project.'));
  }, [id]);

  if (!project && !error) return <LoadingSpinner label="Loading project..." />;
  if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container py-4">
      <div className="page-header"><Link className="text-link mb-3" to="/student/projects"><ArrowLeft size={14} /> Back to projects</Link><span className="page-eyebrow">PROJECT DETAILS</span><h2>{project.title}</h2><p>{project.category} · Led by {project.ownerName}</p></div>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start gap-3">
            <div><span className="profile-section-label">Project overview</span><p className="mb-0">{project.description}</p></div>
            <span className={`badge status-badge status-${(project.status || 'open').toLowerCase().replaceAll('_', '-')}`}>{project.status || 'OPEN'}</span>
          </div>

          <div className="mt-4">
            <h5 className="profile-section-label">Required skills</h5>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {project.requiredSkills.map((skill) => (
                <SkillBadge key={skill} skill={skill} variant="primary" />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h5 className="profile-section-label d-flex align-items-center gap-2"><UsersRound size={15} /> Project team <span className="badge capacity-badge">{project.teamSize} / {project.maxTeamSize}</span></h5>
            <ul className="list-group">
              <li className="list-group-item">{project.ownerName} • Project owner</li>
              {project.teamMembers.map((member) => (
                <li key={member.id} className="list-group-item">
                  {member.name} • {member.branch} • Year {member.year}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
