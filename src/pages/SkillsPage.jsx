import { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import SkillBadge from '../components/SkillBadge';
import { skillCatalog } from '../utils/sampleData';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sparkles } from 'lucide-react';

export default function SkillsPage() {
  const { auth, login } = useAuth();
  const [selectedSkills, setSelectedSkills] = useState(auth.skills || []);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([apiService.skills.getAll(), apiService.users.getById(auth.id)])
      .then(([skillsResponse, userResponse]) => {
        setAvailableSkills(skillsResponse.data);
        setSelectedSkills(userResponse.data.skills || []);
        login(userResponse.data);
      })
      .catch((error) => setMessage(error.response?.data?.message || 'Could not load skills.'))
      .finally(() => setLoading(false));
  }, [auth.id, login]);

  const addSkill = async () => {
    if (!newSkill) return;
    try {
      let skill = availableSkills.find((entry) => entry.name.toLowerCase() === newSkill.toLowerCase());
      if (!skill) {
        const response = await apiService.skills.create({ name: newSkill.trim() });
        skill = response.data;
        setAvailableSkills((current) => [...current, skill]);
      }
      const { data } = await apiService.skills.addToUser(auth.id, skill.id);
      setSelectedSkills(data.skills || []);
      login(data);
      setNewSkill('');
      setMessage('Skill added.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not add skill.');
    }
  };

  const removeSkill = async (skillName) => {
    const skill = availableSkills.find((entry) => entry.name === skillName);
    if (!skill) return;
    try {
      const { data } = await apiService.skills.removeFromUser(auth.id, skill.id);
      setSelectedSkills(data.skills || []);
      login(data);
      setMessage('Skill removed.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not remove skill.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading skills..." />;

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="page-header"><span className="page-eyebrow">YOUR PROFILE</span><h2>Manage skills</h2><p>Keep your technical strengths current for better teammate matches.</p></div>
          {message && <div className={`alert ${message.startsWith('Skill ') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
          <div className="row g-3 align-items-end">
            <div className="col-md-8">
              <label className="form-label">Add new skill</label>
              <input list="skill-list" className="form-control" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
              <datalist id="skill-list">
                {[...new Set([...skillCatalog, ...availableSkills.map((skill) => skill.name)])].map((skill) => (
                  <option key={skill} value={skill} />
                ))}
              </datalist>
            </div>
            <div className="col-md-4">
              <button className="btn btn-primary w-100" onClick={addSkill}>Add Skill</button>
            </div>
          </div>

          <div className="mt-4">
            <h5>My Skills</h5>
            <div className="d-flex flex-wrap gap-2 mt-3">
              {selectedSkills.map((skill) => (
                <button key={skill} type="button" className="tag-button selected" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                  {skill} <span aria-hidden="true">×</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h5 className="d-flex align-items-center gap-2"><Sparkles size={16} /> Skills catalog</h5>
            <div className="d-flex flex-wrap gap-2 mt-3">
              {availableSkills.map((skill) => (
                <SkillBadge key={skill.id} skill={skill.name} variant="secondary" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
