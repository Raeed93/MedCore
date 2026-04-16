import { useNavigate } from 'react-router-dom';
import { Activity, FileText, TrendingUp, Users, ArrowRight } from 'lucide-react';

export default function DashboardHome() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Diagnoses', value: '0', icon: Activity, color: 'bg-blue-500' },
    { label: 'Documents Indexed', value: '1', icon: FileText, color: 'bg-green-500' },
    { label: 'This Week', value: '0', icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Active Users', value: '1', icon: Users, color: 'bg-orange-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome Back!</h1>
        <p className="text-white/70">Your AI-powered medical diagnosis dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-white/70 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/dashboard/diagnose')}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-6 text-left transition-all group"
          >
            <Activity className="w-8 h-8 text-white mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">
              New Diagnosis
            </h3>
            <p className="text-white/70 text-sm mb-4">
              Start a new AI-powered diagnosis for a patient
            </p>
            <div className="flex items-center text-white text-sm font-semibold">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => navigate('/dashboard/history')}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-6 text-left transition-all group"
          >
            <FileText className="w-8 h-8 text-white mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">
              View History
            </h3>
            <p className="text-white/70 text-sm mb-4">
              Review past diagnoses and patient records
            </p>
            <div className="flex items-center text-white text-sm font-semibold">
              <span>View All</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="text-center py-12 text-white/50">
          <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No recent activity</p>
          <p className="text-sm mt-2">Start your first diagnosis to see activity here</p>
        </div>
      </div>
    </div>
  );
}