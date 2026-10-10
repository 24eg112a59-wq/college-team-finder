export default function SkillBadge({ skill, variant = 'primary' }) {
  return <span className={`badge bg-${variant} rounded-pill`}>{skill}</span>;
}
