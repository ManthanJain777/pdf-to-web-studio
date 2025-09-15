import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  LayoutDashboard,
  Fingerprint,
  FileText,
  AlertTriangle,
  Shield,
  BarChart3,
  Database,
  Settings,
  LogOut,
  RefreshCw,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface Profile {
  first_name: string | null;
  last_name: string | null;
  role: string;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [systemStatus, setSystemStatus] = useState<'operational' | 'degraded' | 'outage'>('operational');

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchSystemStatus();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('first_name, last_name, role')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setProfile(data);
    }
  };

  const fetchSystemStatus = async () => {
    const { data } = await supabase
      .from('system_status')
      .select('status')
      .limit(1);
    
    if (data && data.length > 0) {
      setSystemStatus(data[0].status as any);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Fingerprint, label: 'Biometric Verification', path: '/dashboard/biometric' },
    { icon: FileText, label: 'Academic Records', path: '/dashboard/records' },
    { icon: AlertTriangle, label: 'Fraud Detection', path: '/dashboard/fraud' },
    { icon: Shield, label: 'Exam Hall Security', path: '/dashboard/security' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: Database, label: 'Data Security', path: '/dashboard/data' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const displayName = profile 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Demo User'
    : 'Demo User';

  const userRole = profile?.role === 'administrator' ? 'administrator' : profile?.role || 'user';

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">ExaSecure AI</h1>
              <p className="text-xs text-muted-foreground">Identity Validator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3 text-sm"
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground">{userRole}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="h-8 w-8 p-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* System Status */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">System Status</p>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${
                systemStatus === 'operational' ? 'bg-green-500' : 
                systemStatus === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-xs text-foreground">
                {systemStatus === 'operational' ? 'All systems operational' : 
                 systemStatus === 'degraded' ? 'Some systems degraded' : 'System outage'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;