import { Link, useLocation } from 'react-router-dom';

function BottomNavBar() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'sunny', label: 'Dashboard' },
    { path: '/planner', icon: 'calendar_month', label: 'Planner' },
    { path: '/habits', icon: 'repeat', label: 'Habits' },
    { path: '/goals', icon: 'track_changes', label: 'Goals' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 shrink-0 border-t border-gray-200 bg-background-light/80 px-4 pb-3 pt-2 backdrop-blur-sm dark:border-gray-800 dark:bg-background-dark/80">
      <div className="flex">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-1 flex-col items-center justify-end gap-1 ${
              location.pathname === item.path ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
            }`}
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
