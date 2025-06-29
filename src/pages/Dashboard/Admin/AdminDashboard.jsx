import { useEffect, useState } from "react";
import { FaUsers, FaUserTie, FaClipboardList, FaUserClock, FaPlusCircle, FaFileAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../../api/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    recruiters: 0,
    candidates: 0,
    pendingPTO: 0,
    totalSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/api/admin/dashboard-stats");
        setStats(res.data.stats || {});
      } catch (err) {
        toast.error("Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      label: "Recruiters",
      value: stats.recruiters,
      icon: FaUserTie,
      bg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      label: "Candidates",
      value: stats.candidates,
      icon: FaUsers,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Pending PTO",
      value: stats.pendingPTO,
      icon: FaUserClock,
      bg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      label: "Submissions",
      value: stats.totalSubmissions,
      icon: FaClipboardList,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  const submissionsData = [
    { date: "Week 1", count: 10 },
    { date: "Week 2", count: 20 },
    { date: "Week 3", count: 30 },
    { date: "Week 4", count: 25 },
  ];

  const ptoData = [
    { date: "Week 1", requests: 1 },
    { date: "Week 2", requests: 3 },
    { date: "Week 3", requests: 2 },
    { date: "Week 4", requests: 4 },
  ];

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${card.bg} rounded-xl shadow-md p-6 flex items-center gap-4`}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Icon className={`${card.iconColor} text-3xl`} />
              </motion.div>
              <div>
                <p className="text-gray-600 text-sm">{card.label}</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {loading ? "..." : <CountUp end={card.value} duration={1.5} />}
                </h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Submissions Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={submissionsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">PTO Requests Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ptoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="requests" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <button
            onClick={() => navigate("/dashboard/admin/users")}
            className="bg-indigo-50 text-indigo-700 p-3 rounded flex items-center gap-2 hover:bg-indigo-100 transition"
          >
            <FaPlusCircle /> Add New User
          </button>
          <button
            onClick={() => navigate("/dashboard/admin/reports")}
            className="bg-green-50 text-green-700 p-3 rounded flex items-center gap-2 hover:bg-green-100 transition"
          >
            <FaFileAlt /> View All Reports
          </button>
          <button
            onClick={() => navigate("/dashboard/admin/pto")}
            className="bg-yellow-50 text-yellow-700 p-3 rounded flex items-center gap-2 hover:bg-yellow-100 transition"
          >
            <FaUserClock /> Manage PTO Requests
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
