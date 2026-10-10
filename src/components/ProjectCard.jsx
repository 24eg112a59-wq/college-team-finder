import SkillBadge from './SkillBadge';
import { ArrowUpRight, UsersRound } from 'lucide-react';

export default function ProjectCard({ project, onSelect }) {
  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="card-title">{project.title}</h5>
          <span className={`badge status-badge status-${(project.status || 'open').toLowerCase().replaceAll('_', '-')}`}>{project.status || 'OPEN'}</span>
        </div>

        <p className="text-muted small mt-2 mb-2">{project.category || 'Project'}{project.ownerName ? ` · by ${project.ownerName}` : ''}</p>
        <p className="card-text project-description">{project.description || 'No description provided.'}</p>

        <div className="d-flex flex-wrap gap-2 mb-3">
          {(project.requiredSkills || []).map((skill) => (
            <SkillBadge key={skill} skill={skill} variant="secondary" />
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <small className="project-capacity"><UsersRound size={14} /> {project.teamSize || 1} / {project.maxTeamSize || 1}</small>
          <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => onSelect?.(project)}>
            View details <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
