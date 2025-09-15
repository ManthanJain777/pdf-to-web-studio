import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import {
  FileText,
  Users,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

interface DashboardStats {
  totalExams: number;
  activeExams: number;
  fraudDetected: number;
  verificationRate: number;
}

interface RecentVerification {
  id: string;
  candidate_name: string;
  verification_type: string;
  confidence_score: number;
  status: string;
  created_at: string;
  verification_code: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalExams: 0,
    activeExams: 0,
    fraudDetected: 0,
    verificationRate: 0.0,
  });
  const [recentVerifications, setRecentVerifications] = useState<RecentVerification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    try {
      // Fetch exams data
      const { data: exams } = await supabase
        .from('exams')
        .select('status');

      // Fetch fraud detection data
      const { data: fraudData } = await supabase
        .from('fraud_detection')
        .select('id');

      // Fetch verifications data
      const { data: verifications } = await supabase
        .from('verifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate stats
      const totalExams = exams?.length || 0;
      const activeExams = exams?.filter(exam => exam.status === 'active').length || 0;
      const fraudDetected = fraudData?.length || 0;
      
      // Calculate verification rate (simplified)
      const verifiedCount = verifications?.filter(v => v.status === 'verified').length || 0;
      const totalVerifications = verifications?.length || 1;
      const verificationRate = (verifiedCount / totalVerifications) * 100;

      setStats({
        totalExams,
        activeExams,
        fraudDetected,
        verificationRate: Math.round(verificationRate * 100) / 100,
      });

      setRecentVerifications(verifications || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor system performance and recent verification activities</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Backend Connected</span>
          </div>
          <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExams}</div>
            <p className="text-xs text-green-600">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Exams</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeExams}</div>
            <p className="text-xs text-green-600">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fraud Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fraudDetected}</div>
            <p className="text-xs text-green-600">-8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verification Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verificationRate}%</div>
            <p className="text-xs text-green-600">+0.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Verifications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Verifications</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchDashboardData}>
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentVerifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No recent verifications found</p>
            ) : (
              recentVerifications.map((verification) => (
                <div key={verification.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(verification.status)}
                    <div>
                      <p className="font-medium text-foreground">{verification.verification_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {verification.candidate_name} • {verification.verification_code}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Confidence: {verification.confidence_score}%</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(verification.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(verification.status)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;