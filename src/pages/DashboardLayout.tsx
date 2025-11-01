import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { fetchNotifications } from '@/utils/api';

const DashboardLayout = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      if (!user) return;
      try {
        const notifications = await fetchNotifications(user.citizen_id);
        const unread = notifications.filter((n) => n.status === 'unread').length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Failed to load notification count:', error);
      }
    };

    loadUnreadCount();
    // Poll for new notifications every 60 seconds
    const interval = setInterval(loadUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar unreadCount={unreadCount} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
