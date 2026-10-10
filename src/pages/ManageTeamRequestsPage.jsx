import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Inbox } from 'lucide-react';

export default function ManageTeamRequestsPage() {
  const [teamRequests, setTeamRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiService.admin.teamRequests().then(({ data }) => setTeamRequests(data))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load team requests.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading team requests..." />;
  return (
    <div className="container py-4">
      <div className="page-header"><span className="page-eyebrow">ADMINISTRATION</span><h2>Team requests</h2><p>Invitation activity and decision status across projects.</p></div>
      {error && <div className="alert alert-danger">{error}</div>}
      {!error && teamRequests.length === 0 && <div className="empty-state"><span className="empty-state-icon"><Inbox size={22} /></span><h3>No team requests yet</h3><p>Project invitations will be listed here for review.</p></div>}
      {teamRequests.length > 0 &&
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Project</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {teamRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.projectTitle}</td>
                <td>{request.senderName}</td>
                <td>{request.receiverName}</td>
                <td><span className={`badge status-badge status-${request.status.toLowerCase()}`}>{request.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
}
