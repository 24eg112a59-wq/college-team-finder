import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FolderKanban, Inbox, Tags, UsersRound } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiService.admin.stats()
      .then(({ data }) => setStats([
        { label: 'Registered students', value: data.totalStudents, icon: UsersRound },
        { label: 'Total projects', value: data.totalProjects, icon: FolderKanban },
        { label: 'Skills catalog', value: data.totalSkills, icon: Tags },
        { label: 'Pending requests', value: data.pendingRequests, icon: Inbox },
      ]))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load admin statistics.'));
  }, []);

  if (!stats && !error) return <LoadingSpinner label="Loading admin dashboard..." />;

  return (
    <div className="container py-4">
      <div className="page-header"><span className="page-eyebrow">ADMINISTRATION</span><h2>Workspace overview</h2><p>Current platform activity and team formation overview.</p></div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        {(stats || []).map((stat) => (
          <div className="col-md-3" key={stat.label}>
            <div className="card stat-card h-100">
              <div className="card-body">
                <span className="stat-icon"><stat.icon size={18} /></span>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
