"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function UserManagementPage() {
  const [users, setUsers] = useState([
    { id: 1, name: "PixelForge", email: "pixel@example.com", role: "Verified", models: 45, revenue: 12500, joined: "2023-01-15" },
    { id: 2, name: "3D_Wizard", email: "wizard@example.com", role: "Creator", models: 32, revenue: 8900, joined: "2023-03-22" },
    { id: 3, name: "NewUser123", email: "new@example.com", role: "Creator", models: 3, revenue: 450, joined: "2024-01-10" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleVerify = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: "Verified" } : u));
    // TODO: Call API
    alert("User verified!");
  };

  const handleBan = (id: number) => {
    if (confirm("Are you sure you want to ban this user?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
      // TODO: Call API
      alert("User banned!");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="User Authority Panel">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3 flex-1 max-w-2xl">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600"
          />
          <button className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition font-bold">
            Export Data
          </button>
        </div>
      </div>

      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left p-4 text-gray-400 font-semibold">User</th>
              <th className="text-left p-4 text-gray-400 font-semibold">Role</th>
              <th className="text-left p-4 text-gray-400 font-semibold">Models</th>
              <th className="text-left p-4 text-gray-400 font-semibold">Revenue</th>
              <th className="text-left p-4 text-gray-400 font-semibold">Joined</th>
              <th className="text-left p-4 text-gray-400 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition">
                <td className="p-4">
                  <div>
                    <div className="text-white font-bold">{user.name}</div>
                    <div className="text-gray-400 text-sm">{user.email}</div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    user.role === "Verified" 
                      ? "bg-green-900/30 text-green-400 border border-green-500/30"
                      : "bg-gray-800 text-gray-400"
                  }`}>
                    {user.role === "Verified" && "✓ "}{user.role}
                  </span>
                </td>
                <td className="p-4 text-white font-semibold">{user.models}</td>
                <td className="p-4 text-green-400 font-bold">${user.revenue.toLocaleString()}</td>
                <td className="p-4 text-gray-400">{user.joined}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {user.role !== "Verified" && (
                      <button 
                        onClick={() => handleVerify(user.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs font-bold transition"
                      >
                        Verify
                      </button>
                    )}
                    <button 
                      onClick={() => handleBan(user.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold transition"
                    >
                      Ban
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
