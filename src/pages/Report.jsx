import { useTodos } from '../context/TaskContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import './Report.css';

export default function Report() {
  const { stats, loading } = useTodos();

  if (loading) {
    return <div className="report-page"><h1 className="page-title">Loading Report...</h1></div>;
  }

  const pieData = [
    { name: 'Pending', value: stats.pending, color: '#F2C94C' },
    { name: 'In Progress', value: stats.inProgress, color: '#1F7A6B' },
    { name: 'Completed', value: stats.completed, color: '#10b981' },
  ].filter(d => d.value > 0);

  const barData = [
    { name: 'Status Distribution', pending: stats.pending, inProgress: stats.inProgress, completed: stats.completed }
  ];

  return (
    <div className="report-page">
      <h1 className="page-title">To-Do Completion Report</h1>
      
      <div className="report-grid">
        <div className="report-card chart-card">
          <h3>To-Do Distribution</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="report-card bar-card">
          <h3>Progress Breakdown</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pending" fill="#F2C94C" name="Pending" />
                <Bar dataKey="inProgress" fill="#1F7A6B" name="In Progress" />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="report-card summary-stats">
          <h3>Completion Rate</h3>
          <div className="completion-summary">
            <div className="completion-circle">
              <span className="completion-value">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </span>
              <span className="completion-label">Finished</span>
            </div>
            <div className="stats-list">
              <div className="stat-item">
                <span className="dot" style={{ backgroundColor: '#10b981' }}></span>
                <span className="label">Fullfillment: {stats.completed} / {stats.total}</span>
              </div>
              <div className="stat-item">
                <span className="dot" style={{ backgroundColor: '#F2C94C' }}></span>
                <span className="label">Attention Needed: {stats.pending + stats.inProgress}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
