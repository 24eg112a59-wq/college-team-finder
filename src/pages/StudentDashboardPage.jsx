import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import SkillBadge from '../components/SkillBadge';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowRight, Bell, FolderKanban, Plus, Search, UsersRound, Wrench } from 'lucide-react';

export default function StudentDashboardPage() {
  const { auth } = useAuth();
  const [user, setUser] = useState(auth);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [requests, setRequests] = useState([]);
  const [recommendedTeammates, setRecommendedTeammates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiService.users.getById(auth.id),
      apiService.projects.getAll(),
      apiService.teamRequests.received(auth.id),
      apiService.teamRequests.sent(auth.id),
    ]).then(([userResponse, projectResponse, receivedResponse, sentResponse]) => {
      const ownedProjects = projectResponse.data.filter((project) => project.ownerId === auth.id);
      const teams = projectResponse.data.filter((project) => project.ownerId === auth.id || project.teamMembers.some((member) => member.id === auth.id));
      setUser(userResponse.data);
      setProjects(ownedProjects);
      setTeams(teams);
      setRequests([...receivedResponse.data, ...sentResponse.data].filter((request) => request.status === 'PENDING'));
      if (ownedProjects.length) {
        apiService.projects.matches(ownedProjects[0].id).then(({ data }) => {
          setRecommendedTeammates(data.slice(0, 4).map((match) => ({ ...match.student, match: match.matchPercentage })));
        }).catch(() => {});
      }
    }).catch((requestError) => setError(requestError.response?.data?.message || 'Could not load your dashboard.'))
      .finally(() => setLoading(false));
  }, [auth.id]);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;

  return (
    <div className="container py-4">
      <div className="dashboard-welcome d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <span className="page-eyebrow">YOUR WORKSPACE</span>
          <h2 className="mb-1">Welcome back, {user.name?.split(' ')[0] || 'student'}.</h2>
          <p className="page-subtitle">Your skills, projects, and collaborators in one place.</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link className="btn btn-outline-primary" to="/student/find-teammates"><Search size={15} /> Find teammates</Link>
          <Link className="btn btn-primary" to="/student/projects/create"><Plus size={16} /> New project</Link>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4 summary-grid">
        <div className="col-md-3">
          <div className="card stat-card h-100">
            <div className="card-body">
              <span className="stat-icon"><Wrench size={18} /></span>
              <div className="stat-value">{user.skills?.length || 0}</div>
              <div className="stat-label">Skills on your profile</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card h-100">
            <div className="card-body">
              <span className="stat-icon stat-icon-blue"><FolderKanban size={18} /></span>
              <div className="stat-value">{projects.length}</div>
              <div className="stat-label">Projects created</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card h-100">
            <div className="card-body">
              <span className="stat-icon stat-icon-amber"><Bell size={18} /></span>
              <div className="stat-value">{requests.length}</div>
              <div className="stat-label">Pending invitations</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card h-100">
            <div className="card-body">
              <span className="stat-icon stat-icon-green"><UsersRound size={18} /></span>
              <div className="stat-value">{teams.length}</div>
              <div className="stat-label">Teams joined</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <div className="section-card-heading"><div><span className="page-eyebrow">PROFILE</span><h5 className="card-title mb-0">Your skills</h5></div><Link to="/student/skills" className="text-link">Manage <ArrowRight size={13} /></Link></div>
              <div className="d-flex flex-wrap gap-2">
                {(user.skills || []).map((skill) => (
                  <SkillBadge key={skill} skill={skill} variant="primary" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <div className="section-card-heading"><div><span className="page-eyebrow">SKILL MATCHES</span><h5 className="card-title mb-0">Potential teammates</h5></div>{projects.length > 0 && <span className="text-muted small">For your first project</span>}</div>
              <div className="row g-3">
                {recommendedTeammates.map((student) => (
                  <div className="col-md-6" key={student.id}>
                    <MatchCard student={student} matchPercent={student.match} />
                  </div>
                ))}
              </div>
              {projects.length === 0 && <p className="text-muted small mt-3 mb-0">Create a project to see students whose skills match its requirements.</p>}
              {projects.length > 0 && recommendedTeammates.length === 0 && <p className="text-muted small mt-3 mb-0">No skill matches found for your project yet.</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div><span className="page-eyebrow">PROJECTS</span><h4 className="mb-0">Your recent projects</h4></div>
          <Link className="btn btn-outline-primary btn-sm" to="/student/projects">View all <ArrowRight size={14} /></Link>
        </div>
        <div className="row g-3">
          {projects.slice(0, 2).map((project) => (
            <div className="col-md-6" key={project.id}>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between gap-2 align-items-start"><h5>{project.title}</h5><span className={`badge status-badge status-${(project.status || 'open').toLowerCase()}`}>{project.status || 'OPEN'}</span></div>
                  <p className="text-muted small">{project.category} · Team {project.teamSize} / {project.maxTeamSize}</p>
                  <div className="d-flex flex-wrap gap-2">
                    {project.requiredSkills.map((skill) => (
                      <SkillBadge key={skill} skill={skill} variant="secondary" />
                    ))}
                  </div>
                  <Link className="text-link mt-3" to={`/student/projects/${project.id}`}>Open project <ArrowRight size={13} /></Link>
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && <div className="col-12"><div className="empty-state"><span className="empty-state-icon"><FolderKanban size={22} /></span><h3>Your project space is ready</h3><p>Create a project to start finding collaborators with the skills you need.</p><Link className="btn btn-primary btn-sm" to="/student/projects/create"><Plus size={14} /> Create a project</Link></div></div>}
        </div>
      </div>
    </div>
  );
}
