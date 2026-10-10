export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="text-center py-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="mt-2 text-muted">{label}</div>
    </div>
  );
}
