import { Bars3Icon } from '@heroicons/react/24/outline';
interface HeaderProps {
  onToggleSidebar: () => void;
}

const header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="h-14 bg-white border-b flex items-center px-4 gap-4">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-gray-100"
        aria-label="Toggle sidebar"
      >
         <Bars3Icon className="w-6 h-6 text-gray-700" />
      </button>

      <h1 className="text-lg font-semibold">Admin Panel</h1>
    </header>
  );
};

export default header;
