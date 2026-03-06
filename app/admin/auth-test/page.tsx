"use client";

import { useState, useEffect } from "react";
import { isAdminSession, getAccessToken } from "@/lib/api/client";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminAuthTestPage() {
  const [authStatus, setAuthStatus] = useState<any>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const adminData = localStorage.getItem('admin_data');
    const adminToken = localStorage.getItem('admin_access_token');
    const adminRefreshToken = localStorage.getItem('admin_refresh_token');
    const isAdmin = isAdminSession();
    const token = getAccessToken(true);

    setAuthStatus({
      hasAdminData: !!adminData,
      adminDataParsed: adminData ? JSON.parse(adminData) : null,
      hasAdminToken: !!adminToken,
      adminTokenPreview: adminToken ? `${adminToken.substring(0, 30)}...` : null,
      hasAdminRefreshToken: !!adminRefreshToken,
      isAdminSession: isAdmin,
      tokenFromGetter: token ? `${token.substring(0, 30)}...` : null,
    });
  };

  const testApiCall = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/support/tickets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      alert(`API Test Result:\nStatus: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      alert(`API Test Error:\n${error.message}`);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('admin_data');
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_token_set_at');
    checkAuthStatus();
    alert('Admin auth data cleared!');
  };

  return (
    <AdminLayout title="Authentication Test">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-8">
          <h2 className="text-2xl font-black text-white mb-6">🔐 Admin Authentication Status</h2>
          
          {authStatus && (
            <div className="space-y-4">
              {/* Status Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${authStatus.isAdminSession ? 'bg-green-500/20 border-2 border-green-500' : 'bg-red-500/20 border-2 border-red-500'}`}>
                  <div className="text-sm text-gray-400 mb-1">Admin Session Detected</div>
                  <div className="text-2xl font-bold">{authStatus.isAdminSession ? '✅ YES' : '❌ NO'}</div>
                </div>
                
                <div className={`p-4 rounded-lg ${authStatus.hasAdminToken ? 'bg-green-500/20 border-2 border-green-500' : 'bg-red-500/20 border-2 border-red-500'}`}>
                  <div className="text-sm text-gray-400 mb-1">Admin Token Present</div>
                  <div className="text-2xl font-bold">{authStatus.hasAdminToken ? '✅ YES' : '❌ NO'}</div>
                </div>
              </div>

              {/* Detailed Info */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-white font-bold mb-3">LocalStorage Data:</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div>
                    <span className="text-gray-400">admin_data:</span>
                    <pre className="text-white mt-1 overflow-x-auto">
                      {authStatus.adminDataParsed ? JSON.stringify(authStatus.adminDataParsed, null, 2) : 'NOT FOUND'}
                    </pre>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">admin_access_token:</span>
                    <div className="text-white mt-1">{authStatus.adminTokenPreview || 'NOT FOUND'}</div>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">admin_refresh_token:</span>
                    <div className="text-white mt-1">{authStatus.hasAdminRefreshToken ? 'Present' : 'NOT FOUND'}</div>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Token from getAccessToken(true):</span>
                    <div className="text-white mt-1">{authStatus.tokenFromGetter || 'NOT FOUND'}</div>
                  </div>
                </div>
              </div>

              {/* User Type Check */}
              {authStatus.adminDataParsed && (
                <div className={`p-4 rounded-lg ${authStatus.adminDataParsed.user_type === 'admin' ? 'bg-green-500/20 border-2 border-green-500' : 'bg-red-500/20 border-2 border-red-500'}`}>
                  <div className="text-sm text-gray-400 mb-1">User Type</div>
                  <div className="text-xl font-bold text-white">
                    {authStatus.adminDataParsed.user_type || 'NOT SET'}
                    {authStatus.adminDataParsed.user_type === 'admin' ? ' ✅' : ' ❌ (Must be "admin")'}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={checkAuthStatus}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition"
                >
                  🔄 Refresh Status
                </button>
                
                <button
                  onClick={testApiCall}
                  className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition"
                >
                  🧪 Test API Call
                </button>
                
                <button
                  onClick={clearAuth}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition"
                >
                  🗑️ Clear Auth Data
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg p-4 mt-6">
                <h3 className="text-yellow-400 font-bold mb-2">📋 Troubleshooting Steps:</h3>
                <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                  <li>Verify "Admin Session Detected" shows ✅ YES</li>
                  <li>Verify "Admin Token Present" shows ✅ YES</li>
                  <li>Verify "User Type" shows "admin" ✅</li>
                  <li>Click "Test API Call" to test direct API access</li>
                  <li>If any checks fail, clear auth data and login again</li>
                  <li>Check browser console for detailed debug logs</li>
                </ol>
              </div>

              {/* Backend Requirements */}
              <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-lg p-4">
                <h3 className="text-purple-400 font-bold mb-2">🔧 Backend Requirements:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <div>• Login endpoint must return <code className="text-yellow-400">user_type: "admin"</code></div>
                  <div>• Admin endpoints must accept admin tokens</div>
                  <div>• Token validation must check admin privileges</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
