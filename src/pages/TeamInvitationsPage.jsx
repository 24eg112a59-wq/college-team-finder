import { useEffect, useState } from 'react';
import InvitationCard from '../components/InvitationCard';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { MailOpen } from 'lucide-react';

export default function TeamInvitationsPage() {
  const { auth } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiService.teamRequests.received(auth.id)
      .then(({ data }) => setRequests(data))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Could not load invitations.'))
      .finally(() => setLoading(false));
  }, [auth.id]);

  const handleDecision = async (id, decision) => {
    setError('');
    try {
      if (decision === 'accept') await apiService.teamRequests.accept(id);
      else await apiService.teamRequests.reject(id);
      const { data } = await apiService.teamRequests.received(auth.id);
      setRequests(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update invitation.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading invitations..." />;

  return (
    <div className="container py-4">
      <div className="page-header"><span className="page-eyebrow">COLLABORATION</span><h2>Team invitations</h2><p>Review invitations and choose which project teams to join.</p></div>
      {error && <div className="alert alert-danger">{error}</div>}
      {!error && requests.length === 0 && <div className="empty-state"><span className="empty-state-icon"><MailOpen size={22} /></span><h3>You’re all caught up</h3><p>New team invitations will appear here when a project owner reaches out.</p></div>}
      {requests.map((request) => (
        <InvitationCard key={request.id} request={request} onAccept={(id) => handleDecision(id, 'accept')} onReject={(id) => handleDecision(id, 'reject')} />
      ))}
    </div>
  );
}
