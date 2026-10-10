import { NavLink } from 'react-router-dom';
import { BookOpen, FolderKanban, LayoutDashboard, ListChecks, Plus, Search, Users, UserRound, UserRoundPlus, Inbox } from 'lucide-react';

const studentGroups = [
  { title: 'Workspace', links: [
    { to: '/student/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/student/profile', label: 'My profile', icon: UserRound },
    { to: '/student/skills', label: 'Skills', icon: ListChecks },
  ] },
  { title: 'Collaboration', links: [
    { to: '/student/projects', label: 'My projects', icon: FolderKanban },
    { to: '/student/projects/create', label: 'Create project', icon: Plus },
    { to: '/student/find-teammates', label: 'Find teammates', icon: Search },
    { to: '/student/invitations', label: 'Invitations', icon: Inbox },
    { to: '/student/teams', label: 'My teams', icon: Users },
  ] },
];

const adminGroups = [
  { title: 'Administration', links: [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/students', label: 'Students', icon: UserRoundPlus },
    { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { to: '/admin/team-requests', label: 'Team requests', icon: Inbox },
  ] },
];

export default function Sidebar({ role = 'STUDENT', mobileOpen = false, onNavigate }) {
  const groups = role === 'ADMIN' ? adminGroups : studentGroups;

  return (
    <>
      {mobileOpen && <button className="sidebar-backdrop" type="button" aria-label="Close navigation" onClick={onNavigate} />}
      <aside className={`tf-sidebar${mobileOpen ? ' open' : ''}`}>
        {groups.map((group) => (
          <section className="sidebar-group" key={group.title}>
            <h2 className="sidebar-heading">{group.title}</h2>
            <nav className="sidebar-nav" aria-label={group.title}>
              {group.links.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
                  <Icon size={17} strokeWidth={1.9} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </section>
        ))}
        <div className="sidebar-footer-note">
          <BookOpen size={15} />
          <span>College team workspace</span>
        </div>
      </aside>
    </>
  );
}
