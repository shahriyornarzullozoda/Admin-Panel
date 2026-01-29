import { Outlet } from 'react-router-dom';
import Header from '../components/layout/header';
import Sidebar from '../components/layout/sidebar';
import Footer from '../components/layout/footer';
import { useState } from 'react';

const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="min-h-screen flex bg-gray-100">
       <Sidebar isOpen={isSidebarOpen} />

      <div className="flex flex-col flex-1">
        <Header onToggleSidebar={() => setIsSidebarOpen(v => !v)} />

        <main className="flex-1 p-6">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
