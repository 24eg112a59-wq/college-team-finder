import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService, getMatchPercentage } from '../services/api';
import StudentCard from '../components/StudentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, UserRoundSearch } from 'lucide-react';

export default function FindTeammatesPage() {
  const { auth } = useAuth();
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('All');
  const [skill, setSkill] = useState('All');
  const [year, setYear] = useState('All');
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [invitingId, setInvitingId] = useState(null);

  useEffect(() => {
    apiService.projects.getAll()
      .then(({ data }) => setProjects(data.filter((project) => project.ownerId === auth.id)))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load your projects.'))
      .finally(() => setLoading(false));
  }, [auth.id]);

  useEffect(() => {
    const params = {
      name: search || undefined,
      branch: branch === 'All' ? undefined : branch,
      skill: skill === 'All' ? undefined : skill,
      year: year === 'All' ? undefined : Number(year),
    };
    apiService.users.search(params)
      .then(({ data }) => setStudents(data.filter((student) => student.id !== auth.id)))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not search students.'))
  }, [auth.id, search, branch, skill, year]);

  const currentProject = projects.find((project) => project.id === Number(projectId));
  const eligibleStudents = currentProject
    ? students
        .filter((student) => getMatchPercentage(currentProject.requiredSkills, student.skills) > 0)
        .sort((left, right) => getMatchPercentage(currentProject.requiredSkills, right.skills) - getMatchPercentage(currentProject.requiredSkills, left.skills))
    : students;

  const inviteStudent = async (student) => {
    if (!currentProject) return;
    setInvitingId(student.id);
    setError('');
    setMessage('');
    try {
      await apiService.teamRequests.create({
        projectId: currentProject.id,
        senderId: auth.id,
        receiverId: student.id,
      });
      setMessage(`Invitation sent to ${student.name}.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not send invitation.');
    } finally {
      setInvitingId(null);
    }
  };

  if (loading) return <LoadingSpinner label="Loading teammate finder..." />;

  return (
    <div className="container py-4">
      <div className="page-header"><span className="page-eyebrow">TEAM DISCOVERY</span><h2>Find teammates</h2><p>Search students and compare their skills with your project requirements.</p></div>

      <div className="search-panel mb-4">
        <div>
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          <div className="row g-3">
            <div className="col-md-12">
              <label className="form-label">Invite to project</label>
              {projects.length ? (
                <select className="form-select" value={projectId} onChange={(event) => setProjectId(event.target.value)}>
                  <option value="">Select one of your projects</option>
                  {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
                </select>
              ) : <p className="text-muted mb-0">Create a project before inviting teammates. <Link to="/student/projects/create">Create project</Link></p>}
            </div>
            <div className="col-md-4">
              <label className="form-label">Search by name</label>
              <div className="input-with-icon"><Search size={16} /><input className="form-control" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name" /></div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Filter by branch</label>
              <select className="form-select" value={branch} onChange={(e) => setBranch(e.target.value)}>
                <option>All</option>
                <option>Computer Science</option>
                <option>Information Technology</option>
                <option>AI & ML</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Skill</label>
              <select className="form-select" value={skill} onChange={(e) => setSkill(e.target.value)}>
                <option>All</option>
                <option>Java</option>
                <option>React.js</option>
                <option>MySQL</option>
                <option>Python</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Year</label>
              <select className="form-select" value={year} onChange={(e) => setYear(e.target.value)}>
                <option>All</option>
                {[1, 2, 3, 4, 5].map((value) => <option key={value}>{value}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {eligibleStudents.map((student) => (
          <div className="col-lg-4" key={student.id}>
            <StudentCard
              student={student}
              project={currentProject}
              onInvite={inviteStudent}
              canInvite={Boolean(currentProject) && currentProject.teamSize < currentProject.maxTeamSize}
              inviting={invitingId === student.id}
            />
          </div>
        ))}
      </div>
      {eligibleStudents.length === 0 && <div className="empty-state mt-3"><span className="empty-state-icon"><UserRoundSearch size={22} /></span><h3>No matching students found</h3><p>Try widening your filters or choosing a different project.</p></div>}
    </div>
  );
}
