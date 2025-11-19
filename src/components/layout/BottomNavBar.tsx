import { Link, useLocation } from 'react-router-dom';

function BottomNavBar() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'sunny', label: 'Dashboard' },
    { path: '/planner', icon: 'calendar_month', label: 'Planner' },
    { path: '/expenses', icon: 'account_balance_wallet', label: 'Expenses' },
    { path: '/habits', icon: 'repeat', label: 'Habits' },
    { path: '/goals', icon: 'track_changes', label: 'Goals' },
  ];

  return (
    <nav className="bottom-nav">
      <div className="flex gap-4 w-full">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'bottom-nav-btn-active flex-1' : 'bottom-nav-btn flex-1'}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <p className="text-xs font-medium">{item.label}</p>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default BottomNavBar;
