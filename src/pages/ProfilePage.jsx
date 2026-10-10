import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { UserRound } from 'lucide-react';

export default function ProfilePage() {
  const { auth, login } = useAuth();
  const [profile, setProfile] = useState(auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiService.users.getById(auth.id)
      .then(({ data }) => setProfile(data))
      .catch((error) => setMessage(error.response?.data?.message || 'Could not load your profile.'))
      .finally(() => setLoading(false));
  }, [auth.id]);

  const handleChange = (event) => {
    setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const { data } = await apiService.users.update(auth.id, profile);
      setProfile(data);
      login(data);
      setMessage('Profile saved.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading profile..." />;

  return (
    <div className="container py-4">
      <div className="card profile-panel">
        <div className="card-body">
          <div className="profile-header"><span className="profile-avatar"><UserRound size={27} /></span><div><span className="page-eyebrow">YOUR ACCOUNT</span><h2 className="mb-0">My profile</h2><p className="text-muted small mb-0">Keep your information current so project teams can find you.</p></div></div>
          {message && <div className={`alert ${message === 'Profile saved.' ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
          {profile && <form onSubmit={saveProfile}>
          <div className="row g-3 profile-form-grid">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input className="form-control" name="name" value={profile.name || ''} onChange={handleChange} required />
            </div>
            <div className="col-md-6"><label className="form-label">Email</label><input className="form-control" value={profile.email || ''} disabled /></div>
            <div className="col-md-6"><label className="form-label">College ID</label><input className="form-control" name="collegeId" value={profile.collegeId || ''} onChange={handleChange} /></div>
            <div className="col-md-6"><label className="form-label">Branch</label><input className="form-control" name="branch" value={profile.branch || ''} onChange={handleChange} /></div>
            <div className="col-md-6"><label className="form-label">Year</label><input className="form-control" type="number" min="1" max="5" name="year" value={profile.year || ''} onChange={handleChange} /></div>
            <div className="col-md-6"><label className="form-label">Phone</label><input className="form-control" name="phone" value={profile.phone || ''} onChange={handleChange} /></div>
            <div className="col-12"><label className="form-label">Bio</label><textarea className="form-control" rows="3" name="bio" value={profile.bio || ''} onChange={handleChange} /></div>
            <div className="col-12"><button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button></div>
          </div>
          <div className="mt-4">
            <h5>Technical Skills</h5>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {(profile.skills || []).map((skill) => <span key={skill} className="badge bg-primary">{skill}</span>)}
            </div>
          </div>
          </form>}
        </div>
      </div>
    </div>
  );
}
