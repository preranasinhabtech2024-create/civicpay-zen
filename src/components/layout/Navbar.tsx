import { Bell, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
  unreadCount?: number;
}

const Navbar = ({ unreadCount = 0 }: NavbarProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Spacer for mobile (sidebar toggle is absolute) */}
        <div className="w-10 md:hidden"></div>

        {/* Center title for mobile, left for desktop */}
        <div className="flex-1 md:flex-none">
          <h2 className="text-lg md:text-xl font-semibold text-center md:text-left">
            Welcome back, {user?.name?.split(' ')[0] || 'Citizen'}
          </h2>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Notifications button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>

          {/* User profile */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-card rounded-lg">
            <User className="h-5 w-5 text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium">{user?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
