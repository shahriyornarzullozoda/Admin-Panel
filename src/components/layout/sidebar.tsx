import { NavLink, useNavigate } from 'react-router-dom';
interface SidebarProps {
  isOpen: boolean;
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
   ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`;

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
    const navigate = useNavigate();
  return (
    <aside className={`
        bg-gray-900 text-white flex flex-col
        transition-all duration-300
        ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}
      `}>
      <div className="h-14 flex items-center justify-center font-bold border-b border-gray-800">
        Admin Panel
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <NavLink to="/profile" className={linkClass}>
          <i className="fas fa-user" />
          Профиль
        </NavLink>

        <NavLink to="/authors" className={linkClass}>
          <i className="fas fa-users" />
          Автор
        </NavLink>
      </nav>
       <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => navigate('/login')} 
        >
          Выйти
        </button>
    </aside>
  );
};

export default Sidebar;
