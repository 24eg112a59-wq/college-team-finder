import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Mail, UserRound } from 'lucide-react';
import { getMatchPercentage } from '../services/api';

export default function StudentCard({ student, project, onInvite, canInvite = true, inviting = false }) {
  const navigate = useNavigate();
  const match = project ? getMatchPercentage(project.requiredSkills || [], student.skills || []) : null;

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title mb-1">{student.name}</h5>
            <small className="text-muted">{[student.branch, student.year ? `Year ${student.year}` : null].filter(Boolean).join(' · ') || 'Student'}</small>
          </div>
          {match !== null && (
            <span className="badge bg-success rounded-pill">{match}% Match</span>
          )}
        </div>

        {student.bio && <p className="mt-3 mb-2 text-muted small student-bio">{student.bio}</p>}

        <div className="d-flex flex-wrap gap-2 mb-3">
          {(student.skills || []).slice(0, 6).map((skill) => (
            <span key={skill} className={`badge skill-chip ${project?.requiredSkills?.some((required) => required.toLowerCase() === skill.toLowerCase()) ? 'skill-chip-match' : ''}`}>{skill}</span>
          ))}
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => navigate(`/student/users/${student.id}`)}><UserRound size={14} /> Profile <ArrowUpRight size={13} /></button>
          <button className="btn btn-primary btn-sm" type="button" disabled={!canInvite || inviting} onClick={() => onInvite?.(student)}>
            <Mail size={14} /> {inviting ? 'Sending...' : 'Invite'}
          </button>
        </div>
      </div>
    </div>
  );
}
