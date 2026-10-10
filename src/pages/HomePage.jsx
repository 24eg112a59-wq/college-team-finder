import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Compass, ListChecks, UsersRound } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      <section className="home-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="eyebrow-pill"><UsersRound size={14} /> BUILT FOR COLLEGE TEAMS</span>
              <h1>Good projects start with the right people.</h1>
              <p className="lead mb-4">Meet collaborators by skill, find a project worth building, and bring your team together in one place.</p>
              <div className="d-flex gap-2 flex-wrap">
                <Link className="btn btn-primary btn-lg" to="/register">Create your profile <ArrowRight size={16} /></Link>
                <Link className="btn btn-outline-primary btn-lg" to="/login">Sign in</Link>
              </div>
              <div className="home-proof mt-4"><span className="proof-dot" /> Skill-first matching <span>·</span> Student-led teams <span>·</span> Project-ready
              </div>
            </div>
            <div className="col-lg-5">
              <div className="home-preview" aria-label="Team formation workflow preview">
                <div className="preview-topline"><span className="preview-dots"><i /><i /><i /></span><small>TEAM WORKSPACE</small><Code2 size={15} /></div>
                <div className="preview-title">From idea to team</div>
                <div className="home-preview-row">
                  <span className="home-preview-icon"><ListChecks size={17} /></span>
                  <span className="home-preview-copy"><strong>Show what you can build</strong><small>Add your skills and areas of interest</small></span>
                  <span className="preview-check">01</span>
                </div>
                <div className="home-preview-row">
                  <span className="home-preview-icon preview-icon-blue"><Compass size={17} /></span>
                  <span className="home-preview-copy"><strong>Find a project that fits</strong><small>Explore projects seeking your strengths</small></span>
                  <span className="preview-check">02</span>
                </div>
                <div className="home-preview-row">
                  <span className="home-preview-icon preview-icon-green"><UsersRound size={17} /></span>
                  <span className="home-preview-copy"><strong>Build the team together</strong><small>Invite collaborators and get started</small></span>
                  <span className="preview-check">03</span>
                </div>
                <div className="preview-bottom"><span>One shared space for your next big idea.</span><ArrowRight size={15} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="text-center home-section-heading">
            <span className="page-eyebrow">A BETTER WAY TO COLLABORATE</span>
            <h2>Make the team as strong as the idea.</h2>
            <p>Everything your group needs to move from a class project brief to a team that can deliver.</p>
          </div>
          <div className="row g-3 mt-4">
            <div className="col-md-4"><article className="home-feature"><span className="home-feature-icon"><ListChecks size={19} /></span><h3>Lead with your skills</h3><p>Build a profile that makes your strengths, interests, and experience easy for teammates to find.</p></article></div>
            <div className="col-md-4"><article className="home-feature"><span className="home-feature-icon feature-icon-blue"><Compass size={19} /></span><h3>Discover the right fit</h3><p>Explore projects by technical requirements and see how your skills line up with the work.</p></article></div>
            <div className="col-md-4"><article className="home-feature"><span className="home-feature-icon feature-icon-green"><UsersRound size={19} /></span><h3>Form a real team</h3><p>Invite classmates, manage requests, and keep project members and capacity organized.</p></article></div>
          </div>
        </div>
      </section>
      <section className="home-bottom-cta">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div><h2>Ready to find your people?</h2><p>Create a profile and start with the skills you already have.</p></div>
          <Link className="btn btn-primary" to="/register">Join TeamFinder <ArrowRight size={15} /></Link>
        </div>
      </section>
    </div>
  );
}
