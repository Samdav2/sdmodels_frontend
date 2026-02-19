"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminUsers } from "@/lib/api/hooks/useAdminUsers";
import { useAdminModal } from "@/components/admin/AdminModal";

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { users, loading, error, verifyUser, banUser } = useAdminUsers(searchQuery);
  const { modal, showAlert, showConfirm, AdminModalComponent } = useAdminModal();
  const [processing, setProcessing] = useState(false);

  const handleVerify = async (id: number, username: string) => {
    try {
      setProcessing(true);
      await verifyUser(id);
      await showAlert("Success", `${username} has been verified!`, "success");
    } catch (err) {
      await showAlert("Error", "Failed to verify user", "danger");
    } finally {
      setProcessing(false);
    }
  };

  const handleBan = async (id: number, username: string) => {
    const confirmed = await showConfirm(
      "Ban User",
      `Are you sure you want to ban ${username}? They will no longer be able to access the platform.`,
      "danger"
    );
    
    if (confirmed) {
      try {
        setProcessing(true);
        await banUser(id);
        await showAlert("Success", `${username} has been banned!`, "success");
      } catch (err) {
        await showAlert("Error", "Failed to ban user", "danger");
      } finally {
        setProcessing(false);
      }
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout title="User Authority Panel">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-400">Loading users...</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <AdminLayout title="User Authority Panel">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-500 mb-2">Error Loading Users</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  const filteredUsers = users;

  return (
    <ProtectedRoute>
      <AdminLayout title="User Authority Panel">
        {AdminModalComponent}
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3 flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Search users by name or email..."
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user: any) => (
                  <tr key={user.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition">
                    <td className="p-4">
                      <div>
                        <div className="text-white font-bold">{user.username || user.name || "Unknown"}</div>
                        <div className="text-gray-400 text-sm">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.is_verified_creator
                          ? "bg-green-900/30 text-green-400 border border-green-500/30"
                          : "bg-gray-800 text-gray-400"
                      }`}>
                        {user.is_verified_creator && "✓ "}Creator
                      </span>
                    </td>
                    <td className="p-4 text-white font-semibold">{user.total_models || 0}</td>
                    <td className="p-4 text-green-400 font-bold">${(user.total_sales || 0).toLocaleString()}</td>
                    <td className="p-4 text-gray-400">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {!user.is_verified_creator && (
                          <button 
                            onClick={() => handleVerify(user.id, user.username || user.name)}
                            disabled={processing}
                            className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs font-bold transition disabled:opacity-50"
                          >
                            Verify
                          </button>
                        )}
                        <button 
                          onClick={() => handleBan(user.id, user.username || user.name)}
                          disabled={processing}
                          className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold transition disabled:opacity-50"
                        >
                          Ban
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
