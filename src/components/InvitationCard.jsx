import { Check, Clock3, X } from 'lucide-react';

export default function InvitationCard({ request, onAccept, onReject }) {
  const status = request.status?.toLowerCase() || 'pending';
  return (
    <div className="card invitation-card mb-3">
      <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h6 className="mb-1">{request.projectTitle}</h6>
          <small className="text-muted d-block">From {request.senderName || 'Project teammate'}{request.createdAt ? ` · ${new Date(request.createdAt).toLocaleDateString()}` : ''}</small>
        </div>

        <div className="d-flex align-items-center gap-3">
          <span className={`badge status-badge status-${status}`}>
            {status === 'pending' ? <Clock3 size={12} /> : status === 'accepted' ? <Check size={12} /> : <X size={12} />}
            {request.status}
          </span>
        {status === 'pending' && (
          <div className="d-flex gap-2">
            <button className="btn btn-success btn-sm" type="button" onClick={() => onAccept(request.id)}>
              <Check size={14} /> Accept
            </button>
            <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => onReject(request.id)}>
              <X size={14} /> Reject
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
