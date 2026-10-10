export default function AboutPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="fw-bold mb-4">About the platform</h2>
          <p className="text-muted">
            The College Project Team Finder helps students discover teammates based on actual skill compatibility.
            Instead of choosing random groups, students can create profiles, document their technical strengths, and match
            with peers based on project requirements.
          </p>
          <p className="text-muted">
            From Java and React to data science and UI/UX, the platform makes it easier to form strong project teams,
            reduce mismatches, and build collaborative academic projects.
          </p>

          <div className="row g-3 mt-2">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5>Profile building</h5>
                  <p className="text-muted small mb-0">Students add skills, branches, year, and short bio.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5>Project matching</h5>
                  <p className="text-muted small mb-0">Teams receive match percentages based on required skills.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5>Team invites</h5>
                  <p className="text-muted small mb-0">Students can invite and accept teammates with role-based collaboration.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
