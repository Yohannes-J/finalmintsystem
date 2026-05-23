import axios from "axios";
import { useEffect, useState } from "react";
import { HiOutlineUsers } from "react-icons/hi2";
import { MdPendingActions } from "react-icons/md";
import { PiWarningCircleLight } from "react-icons/pi";
import { TbActivityHeartbeat } from "react-icons/tb";

function AdminInfo() {
  const [stats, setStats] = useState({
    count: 0,
    change: 0,
    isLoading: true,
    error: null,
  });

  const backendUrl = "http://localhost:1221"; // Replace with your backend URL

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/users/active-users`);
        console.log("API Response:", res.data);

        setStats({
          count: res.data.count || 0, // fallback to 0
          change: res.data.change || 0,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setStats((prev) => ({
          ...prev,
          isLoading: false,
          error: err.response?.data?.error || "Failed to load stats",
        }));
      }
    };

    fetchStats();
  }, []);

  if (stats.isLoading) {
    return <p>Loading stats...</p>;
  }

  if (stats.error) {
    return <p className="text-red-500">{stats.error}</p>;
  }

  return (
    <div className="flex gap-4 justify-around items-center">
      {/* Active Users */}
      <div className="flex flex-col gap-2 p-2 flex-1 bg-white border border-gray-100 rounded-sm shadow-lg">
        <div className="flex justify-between items-center gap-2 p-2">
          <p className="font-bold">Active Users</p>
          <HiOutlineUsers size={25} className="text-blue-500" />
        </div>
        <h3 className="text-2xl font-semibold px-2">{stats.count}</h3>
        <h5
          className={`text-sm ${
            stats.change >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {stats.change >= 0 ? "+" : ""}
          {stats.change} from last month
        </h5>
      </div>

      {/* Pending Approval */}
      <div className="flex flex-col gap-2 p-2 flex-1 bg-white border border-gray-100 rounded-sm shadow-lg">
        <div className="flex justify-between items-center gap-2 p-2">
          <p className="font-bold">Pending Approval</p>
          <MdPendingActions size={25} />
        </div>
        <h3 className="text-2xl font-semibold px-2">12</h3>
        <h5>+12 from last month</h5>
      </div>

      {/* Overdue Reports */}
      <div className="flex flex-col gap-2 p-2 flex-1 bg-white border border-gray-100 rounded-sm shadow-lg">
        <div className="flex justify-between items-center gap-2 p-2">
          <p className="font-bold">Overdue Reports</p>
          <PiWarningCircleLight size={30} className="font-bold" />
        </div>
        <h3 className="text-2xl font-semibold px-2">7</h3>
        <h5>+12 from last month</h5>
      </div>

      {/* System Health */}
      <div className="flex flex-col gap-2 p-2 flex-1 bg-white border border-gray-100 rounded-sm shadow-lg">
        <div className="flex justify-between items-center gap-2 p-2">
          <p className="font-bold">System Health</p>
          <TbActivityHeartbeat size={30} />
        </div>
        <h3 className="text-2xl font-semibold px-2">99.8%</h3>
        <h5>+12 from last month</h5>
      </div>
    </div>
  );
}

export default AdminInfo;
