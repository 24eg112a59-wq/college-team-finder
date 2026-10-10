import SkillBadge from './SkillBadge';

export default function MatchCard({ student, matchPercent }) {
  return (
    <div className="card match-card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">{student.name}</h5>
          <span className="badge bg-success">{matchPercent}% Match</span>
        </div>
        <p className="text-muted mt-2 mb-3">{[student.branch, student.year ? `Year ${student.year}` : null].filter(Boolean).join(' · ') || 'Student'}</p>
        <div className="d-flex flex-wrap gap-2">
          {(student.skills || []).map((skill) => (
            <SkillBadge key={skill} skill={skill} variant="light" />
          ))}
        </div>
        <div className="match-meter" role="progressbar" aria-valuenow={matchPercent} aria-valuemin="0" aria-valuemax="100" aria-label={`${matchPercent}% skill match`}><span style={{ width: `${matchPercent}%` }} /></div>
      </div>
    </div>
  );
}
