import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { skillCatalog } from '../utils/sampleData';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { FolderPlus } from 'lucide-react';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    status: 'OPEN',
    maxTeamSize: 4,
    requiredSkills: ['Java', 'React.js'],
  });

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiService.projects.create({ ...form, maxTeamSize: Number(form.maxTeamSize), ownerId: auth.id });
      navigate('/student/projects');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not create project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="page-header"><span className="page-eyebrow">PROJECT WORKSPACE</span><h2>Create a project</h2><p>Describe the work and skills your team needs.</p></div>
      <div className="card">
        <div className="card-body">
          <div className="form-section-heading"><span className="form-section-icon"><FolderPlus size={18} /></span><div><h3>Project details</h3><p>Set up the basics before you invite your team.</p></div></div>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Project Title</label>
                <input name="title" className="form-control" value={form.title} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <input name="category" className="form-control" value={form.category} onChange={handleChange} />
              </div>
              <div className="col-md-12">
                <label className="form-label">Description</label>
                <textarea name="description" rows="4" className="form-control" value={form.description} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Project Status</label>
                <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                  <option>OPEN</option>
                  <option>IN_PROGRESS</option>
                  <option>COMPLETED</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Maximum Team Size</label>
                <input name="maxTeamSize" type="number" min="2" className="form-control" value={form.maxTeamSize} onChange={handleChange} />
              </div>
              <div className="col-md-12">
                <label className="form-label">Required Skills</label>
                <div className="d-flex flex-wrap gap-2">
                  {skillCatalog.map((skill) => (
                    <button key={skill} type="button" className={`tag-button ${form.requiredSkills.includes(skill) ? 'selected' : ''}`} aria-pressed={form.requiredSkills.includes(skill)} onClick={() => setForm((prev) => ({ ...prev, requiredSkills: prev.requiredSkills.includes(skill) ? prev.requiredSkills.filter((item) => item !== skill) : [...prev.requiredSkills, skill] }))}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-4" disabled={saving}>{saving ? 'Saving...' : 'Create project'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
