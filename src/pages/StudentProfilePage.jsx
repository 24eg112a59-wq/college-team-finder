import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { UserRound } from 'lucide-react';

export default function StudentProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiService.users.getById(id)
      .then(({ data }) => setProfile(data))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load student profile.'));
  }, [id]);

  if (!profile && !error) return <LoadingSpinner label="Loading student profile..." />;
  if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container py-4">
      <div className="card profile-panel">
        <div className="card-body">
          <div className="profile-header"><span className="profile-avatar"><UserRound size={27} /></span><div><span className="page-eyebrow">STUDENT PROFILE</span><h2 className="mb-1">{profile.name}</h2><p className="text-muted small mb-0">{[profile.branch, profile.year ? `Year ${profile.year}` : null].filter(Boolean).join(' · ')}</p></div></div>
          <p className="profile-detail-bio">{profile.bio || 'No bio added yet.'}</p>
          <h5 className="mt-4">Technical skills</h5>
          <div className="d-flex flex-wrap gap-2">
            {(profile.skills || []).map((skill) => <span className="badge bg-primary" key={skill}>{skill}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
