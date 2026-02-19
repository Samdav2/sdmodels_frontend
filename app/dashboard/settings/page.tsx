"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useSettings } from "@/lib/api/hooks/useDashboard";
import { authApi } from "@/lib/api/auth";
import { dashboardApi } from "@/lib/api/dashboard";

export default function SettingsPage() {
  const { settings, loading, error, updateProfile, updateSecurity, updateNotifications } = useSettings();
  
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "billing">("profile");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    full_name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    avatar_url: ''
  });

  // Social links state
  const [socialLinks, setSocialLinks] = useState({
    artstation: '',
    twitter: '',
    instagram: '',
    youtube: ''
  });

  // Security state
  const [securityStatus, setSecurityStatus] = useState<any>(null);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [notificationTypes, setNotificationTypes] = useState({
    sales: true,
    reviews: true,
    followers: true,
    messages: true,
    updates: false,
    marketing: false
  });

  // Billing state
  const [billingData, setBillingData] = useState<any>(null);
  const [loadingBilling, setLoadingBilling] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [paymentMethodData, setPaymentMethodData] = useState({
    type: 'paypal',
    email: '',
    account_number: '',
    routing_number: '',
    account_holder_name: ''
  });
  const [taxData, setTaxData] = useState({
    tax_id: '',
    business_name: ''
  });

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load profile from dedicated endpoint
        const profile = await dashboardApi.getProfile();
        setProfileData({
          full_name: profile.full_name || '',
          username: profile.username || '',
          bio: profile.bio || '',
          location: profile.location || '',
          website: profile.website || '',
          avatar_url: profile.avatar_url || ''
        });
        
        // Load social links separately
        const social = await dashboardApi.getSocialLinks();
        setSocialLinks({
          artstation: social.artstation || '',
          twitter: social.twitter || '',
          instagram: social.instagram || '',
          youtube: social.youtube || ''
        });
      } catch (err) {
        console.error('Failed to load user data:', err);
      }
    };
    loadUserData();
  }, []);

  // Load settings when available
  useEffect(() => {
    if (settings) {
      setTwoFactorEnabled(settings.security?.two_factor_enabled || false);
      setBiometricEnabled(settings.security?.biometric_enabled || false);
      setEmailNotifications(settings.notifications?.email_enabled || true);
      setPushNotifications(settings.notifications?.push_enabled || false);
    }
  }, [settings]);

  // Load security status and sessions when security tab is active
  useEffect(() => {
    if (activeTab === 'security') {
      loadSecurityData();
    } else if (activeTab === 'notifications') {
      loadAlertSettings();
    } else if (activeTab === 'billing') {
      loadBillingData();
    }
  }, [activeTab]);

  const loadSecurityData = async () => {
    try {
      const [status, sessions] = await Promise.all([
        dashboardApi.getSecurityStatus(),
        dashboardApi.getSessions()
      ]);
      
      console.log('Security status:', status);
      console.log('Sessions:', sessions);
      
      setSecurityStatus(status);
      setActiveSessions(Array.isArray(sessions) ? sessions : []);
      setTwoFactorEnabled(status.two_factor_enabled || false);
      setBiometricEnabled(status.biometric_enabled || false);
    } catch (err) {
      console.error('Failed to load security data:', err);
      showError('Failed to load security data');
    }
  };

  const loadAlertSettings = async () => {
    try {
      const alerts = await dashboardApi.getAlertSettings();
      if (alerts.notification_preferences) {
        setEmailNotifications(alerts.notification_preferences.email_notifications || false);
        setPushNotifications(alerts.notification_preferences.push_notifications || false);
      }
      if (alerts.alert_types) {
        setNotificationTypes({
          sales: alerts.alert_types.new_sales || false,
          reviews: alerts.alert_types.new_reviews || false,
          followers: alerts.alert_types.new_followers || false,
          messages: alerts.alert_types.messages || false,
          updates: alerts.alert_types.platform_updates || false,
          marketing: alerts.alert_types.marketing || false
        });
      }
    } catch (err) {
      console.error('Failed to load alert settings:', err);
    }
  };

  const loadBillingData = async () => {
    try {
      setLoadingBilling(true);
      const billing = await dashboardApi.getBillingSettings();
      setBillingData(billing);
      
      // Load tax data into state
      if (billing?.tax_information) {
        setTaxData({
          tax_id: billing.tax_information.tax_id || '',
          business_name: billing.tax_information.business_name || ''
        });
      }
    } catch (err) {
      console.error('Failed to load billing data:', err);
    } finally {
      setLoadingBilling(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const updatedProfile = await updateProfile(profileData);
      
      // Update local state with new profile data
      if (updatedProfile) {
        setProfileData({
          full_name: updatedProfile.full_name || '',
          username: updatedProfile.username || '',
          bio: updatedProfile.bio || '',
          location: updatedProfile.location || '',
          website: updatedProfile.website || '',
          avatar_url: updatedProfile.avatar_url || ''
        });
      }
      
      showSuccess('Profile updated successfully!');
    } catch (err: any) {
      showError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSocialLinks = async () => {
    try {
      setSaving(true);
      const response = await dashboardApi.updateSocialLinks(socialLinks);
      
      // Update local state with returned data
      if (response.social_links) {
        setSocialLinks({
          artstation: response.social_links.artstation || '',
          twitter: response.social_links.twitter || '',
          instagram: response.social_links.instagram || '',
          youtube: response.social_links.youtube || ''
        });
      }
      
      showSuccess('Social links updated successfully!');
    } catch (err: any) {
      showError(err.response?.data?.detail || 'Failed to update social links');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    try {
      setSaving(true);
      await updateSecurity({ two_factor_enabled: !twoFactorEnabled });
      
      // Reload security data to ensure sync with backend
      await loadSecurityData();
      
      showSuccess(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}`);
    } catch (err: any) {
      showError(err.response?.data?.detail || 'Failed to update security settings');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleBiometric = async () => {
    try {
      setSaving(true);
      await updateSecurity({ biometric_enabled: !biometricEnabled });
      
      // Reload security data to ensure sync with backend
      await loadSecurityData();
      
      showSuccess(`Biometric authentication ${!biometricEnabled ? 'enabled' : 'disabled'}`);
    } catch (err: any) {
      showError(err.response?.data?.detail || 'Failed to update security settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      showError('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 8) {
      showError('Password must be at least 8 characters long');
      return;
    }

    try {
      setSaving(true);
      // Use the security endpoint for password change
      await updateSecurity({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      showSuccess('Password changed successfully!');
    } catch (err: any) {
      showError(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      setSaving(true);
      await dashboardApi.revokeSession(sessionId);
      // Reload sessions
      const sessions = await dashboardApi.getSessions();
      setActiveSessions(sessions);
      showSuccess('Session revoked successfully!');
    } catch (err: any) {
      showError(err.response?.data?.detail || 'Failed to revoke session');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      await dashboardApi.updateAlertSettings({
        notification_preferences: {
          email_notifications: emailNotifications,
          push_notifications: pushNotifications
        },
        alert_types: {
          new_sales: notificationTypes.sales,
          new_reviews: notificationTypes.reviews,
          new_followers: notificationTypes.followers,
          messages: notificationTypes.messages,
          platform_updates: notificationTypes.updates,
          marketing: notificationTypes.marketing
        }
      });
      showSuccess('Notification preferences updated!');
    } catch (err: any) {
      showError(err.response?.data?.detail || 'Failed to update notifications');
    } finally {
      setSaving(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    // Validate based on payment type
    if (paymentMethodData.type === 'paypal') {
      if (!paymentMethodData.email) {
        showError('Please enter your PayPal email');
        return;
      }
    } else {
      if (!paymentMethodData.account_number || !paymentMethodData.routing_number || !paymentMethodData.account_holder_name) {
        showError('Please fill in all bank account details');
        return;
      }
    }

    try {
      setSaving(true);
      await dashboardApi.addPaymentMethod(paymentMethodData);
      
      // Reload billing data
      await loadBillingData();
      
      // Reset form and close modal
      setPaymentMethodData({
        type: 'paypal',
        email: '',
        account_number: '',
        routing_number: '',
        account_holder_name: ''
      });
      setShowAddPaymentModal(false);
      showSuccess('Payment method added successfully!');
    } catch (err: any) {
      showError(err.response?.data?.detail || 'Failed to add payment method');
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePaymentMethod = async (methodId: number) => {
    if (!confirm('Are you sure you want to remove this payment method?')) {
      return;
    }

    try {
      setSaving(true);
      await dashboardApi.removePaymentMethod(methodId);
      await loadBillingData();
      showSuccess('Payment method removed successfully!');
    } catch (err: any) {
      showError(err.response?.data?.detail || 'Failed to remove payment method');
    } finally {
      setSaving(false);
    }
  };

  const handleSetPrimaryPaymentMethod = async (methodId: number) => {
    try {
      setSaving(true);
      await dashboardApi.setPrimaryPaymentMethod(methodId);
      await loadBillingData();
      showSuccess('Primary payment method updated!');
    } catch (err: any) {
      showError(err.response?.data?.detail || 'Failed to update primary payment method');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTaxInfo = async () => {
    try {
      setSaving(true);
      await dashboardApi.updateTaxInfo(taxData);
      await loadBillingData();
      showSuccess('Tax information saved successfully!');
    } catch (err: any) {
      showError(err.response?.data?.detail || 'Failed to save tax information');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
            ⚙️ System Configuration
          </h1>
          <p className="text-sm sm:text-base text-slate-400">Manage your account, security, and preferences</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
            ✓ {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            ✗ {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading settings...</div>
        ) : (
          <>
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "profile", label: "Profile", icon: "👤" },
            { id: "security", label: "Neural Link", icon: "🔐" },
            { id: "notifications", label: "Alerts", icon: "🔔" },
            { id: "billing", label: "Billing", icon: "💳" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50"
                  : "bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:border-orange-500/50"
              }`}
            >
              <span className="mr-1 sm:mr-2">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Avatar & Basic Info */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Profile Information</h2>
              
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                {/* Avatar */}
                <div className="relative mx-auto sm:mx-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-3xl sm:text-4xl font-black text-white">
                    JD
                  </div>
                  <button className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition text-sm sm:text-base">
                    📷
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                  <div>
                    <label className="block text-xs sm:text-sm text-slate-400 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-slate-400 mb-2">Username</label>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm text-slate-400 mb-2">Bio</label>
                  <textarea
                    rows={3}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:border-orange-500 focus:outline-none transition resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm text-slate-400 mb-2">Location</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-slate-400 mb-2">Website</label>
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSaveProfile}
                disabled={saving}
                className="mt-4 sm:mt-6 w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Social Links */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Social Links</h2>
              
              <div className="space-y-3 sm:space-y-4">
                {[
                  { platform: "ArtStation", icon: "🎨", placeholder: "artstation.com/username", key: "artstation" },
                  { platform: "Twitter/X", icon: "🐦", placeholder: "@username", key: "twitter" },
                  { platform: "Instagram", icon: "📸", placeholder: "@username", key: "instagram" },
                  { platform: "YouTube", icon: "📺", placeholder: "youtube.com/@channel", key: "youtube" },
                ].map((social) => (
                  <div key={social.platform}>
                    <label className="block text-xs sm:text-sm text-slate-400 mb-2">
                      <span className="mr-2">{social.icon}</span>
                      {social.platform}
                    </label>
                    <input
                      type="text"
                      value={socialLinks[social.key as keyof typeof socialLinks]}
                      onChange={(e) => setSocialLinks({...socialLinks, [social.key]: e.target.value})}
                      placeholder={social.placeholder}
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>
                ))}
              </div>

              <button 
                onClick={handleSaveSocialLinks}
                disabled={saving}
                className="mt-4 sm:mt-6 w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Update Links'}
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            {/* Neural Link Status */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">🔐 Neural Link Status</h2>
                  <p className="text-sm text-slate-400">Advanced biometric authentication system</p>
                </div>
                <div className={`px-4 py-2 ${securityStatus?.status === 'active' ? 'bg-green-500/20 border-green-500/50' : 'bg-slate-500/20 border-slate-500/50'} border rounded-lg`}>
                  <span className={`${securityStatus?.status === 'active' ? 'text-green-400' : 'text-slate-400'} font-semibold`}>
                    ● {securityStatus?.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {securityStatus && (
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-950/50 rounded-lg">
                  <div>
                    <div className="text-xs text-slate-400">Last Password Change</div>
                    <div className="text-sm text-white font-semibold">
                      {securityStatus.last_password_change 
                        ? new Date(securityStatus.last_password_change).toLocaleDateString()
                        : 'Never'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Active Sessions</div>
                    <div className="text-sm text-white font-semibold">{activeSessions.length}</div>
                  </div>
                </div>
              )}

              {/* Security Features */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      🔑
                    </div>
                    <div>
                      <div className="font-semibold text-white">Two-Factor Authentication</div>
                      <div className="text-sm text-slate-400">Extra layer of security</div>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleTwoFactor}
                    disabled={saving}
                    className={`relative w-14 h-7 rounded-full transition ${
                      twoFactorEnabled ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        twoFactorEnabled ? "translate-x-8" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      👆
                    </div>
                    <div>
                      <div className="font-semibold text-white">Biometric Scan</div>
                      <div className="text-sm text-slate-400">Fingerprint authentication</div>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleBiometric}
                    disabled={saving}
                    className={`relative w-14 h-7 rounded-full transition ${
                      biometricEnabled ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        biometricEnabled ? "translate-x-8" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Password Change */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <button 
                onClick={handleChangePassword}
                disabled={saving}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>

            {/* Active Sessions */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <h2 className="text-xl font-bold text-white mb-6">Active Sessions</h2>
              
              {activeSessions.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  No active sessions found
                </div>
              ) : (
                <div className="space-y-3">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {session.device?.includes('Mobile') || session.device?.includes('iPhone') || session.device?.includes('Android') 
                            ? "📱" 
                            : session.device?.includes('Mac') 
                            ? "💻" 
                            : "🖥️"}
                        </div>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-2">
                            {session.device || 'Unknown Device'}
                            {session.is_current && (
                              <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/50 rounded text-xs text-green-400">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-400">
                            {session.location || 'Unknown Location'} • {session.ip_address}
                          </div>
                          <div className="text-xs text-slate-500">
                            {session.last_active || 'Unknown'}
                          </div>
                        </div>
                      </div>
                      {!session.is_current && (
                        <button 
                          onClick={() => handleRevokeSession(session.id)}
                          disabled={saving}
                          className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition disabled:opacity-50"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                  <div>
                    <div className="font-semibold text-white">Email Notifications</div>
                    <div className="text-sm text-slate-400">Receive updates via email</div>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative w-14 h-7 rounded-full transition ${
                      emailNotifications ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        emailNotifications ? "translate-x-8" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                  <div>
                    <div className="font-semibold text-white">Push Notifications</div>
                    <div className="text-sm text-slate-400">Browser push notifications</div>
                  </div>
                  <button
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={`relative w-14 h-7 rounded-full transition ${
                      pushNotifications ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        pushNotifications ? "translate-x-8" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <button 
                onClick={handleSaveNotifications}
                disabled={saving}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>

            {/* Notification Types */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <h2 className="text-xl font-bold text-white mb-6">Alert Types</h2>
              
              <div className="space-y-3">
                {[
                  { key: 'sales', label: "New Sales", description: "When someone purchases your model" },
                  { key: 'reviews', label: "New Reviews", description: "When someone reviews your work" },
                  { key: 'followers', label: "New Followers", description: "When someone follows you" },
                  { key: 'messages', label: "Messages", description: "Direct messages from buyers" },
                  { key: 'updates', label: "Platform Updates", description: "News and feature announcements" },
                  { key: 'marketing', label: "Marketing", description: "Promotional content and tips" },
                ].map((notif) => (
                  <div key={notif.key} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                    <div>
                      <div className="font-semibold text-white">{notif.label}</div>
                      <div className="text-sm text-slate-400">{notif.description}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationTypes[notif.key as keyof typeof notificationTypes]}
                      onChange={(e) => setNotificationTypes({
                        ...notificationTypes,
                        [notif.key]: e.target.checked
                      })}
                      className="w-5 h-5 accent-orange-500"
                    />
                  </div>
                ))}
              </div>

              <button 
                onClick={handleSaveNotifications}
                disabled={saving}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save All Preferences'}
              </button>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            {loadingBilling ? (
              <div className="text-center py-12 text-slate-400">Loading billing information...</div>
            ) : (
              <>
            {/* Payment Methods */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Payment Methods</h2>
                <button 
                  onClick={() => setShowAddPaymentModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition"
                >
                  + Add Method
                </button>
              </div>
              
              {billingData?.payment_methods && billingData.payment_methods.length > 0 ? (
                <div className="space-y-3">
                  {billingData.payment_methods.map((method: any) => (
                    <div key={method.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{method.type === "paypal" ? "💳" : "🏦"}</div>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-2">
                            {method.type === "paypal" ? "PayPal" : "Bank Account"}
                            {method.is_primary && (
                              <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/50 rounded text-xs text-orange-400">
                                Primary
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-400">
                            {method.email || `****${method.last_four}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!method.is_primary && (
                          <button 
                            onClick={() => handleSetPrimaryPaymentMethod(method.id)}
                            disabled={saving}
                            className="px-4 py-2 text-orange-400 hover:bg-orange-500/10 rounded-lg transition disabled:opacity-50"
                          >
                            Set Primary
                          </button>
                        )}
                        <button 
                          onClick={() => handleRemovePaymentMethod(method.id)}
                          disabled={saving}
                          className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  No payment methods added yet
                </div>
              )}
            </div>

            {/* Fee Structure */}
            {billingData?.fee_structure && (
              <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
                <h2 className="text-xl font-bold text-white mb-6">Your Fee Structure</h2>
                
                <div className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-slate-400">Current Rank</div>
                      <div className="text-2xl font-black text-orange-400">
                        {billingData.fee_structure.current_rank}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">Platform Fee</div>
                      <div className="text-2xl font-black text-white">
                        {billingData.fee_structure.platform_fee}%
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-300">
                    You're earning {billingData.fee_structure.earnings_percentage}% of each sale. 
                    {billingData.fee_structure.next_rank && (
                      <> Reach {billingData.fee_structure.next_rank} rank to reduce fees to {billingData.fee_structure.next_rank_fee}%!</>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {billingData.fee_structure.tiers?.map((tier: any, index: number) => {
                    const isCurrent = tier.name === billingData.fee_structure.current_rank;
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          isCurrent
                            ? "bg-orange-500/20 border-orange-500/50"
                            : "bg-slate-950/30 border-slate-700/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">
                              {tier.name === "Bronze" ? "🥉" : 
                               tier.name === "Silver" ? "🥈" : 
                               tier.name === "Gold" ? "🥇" : 
                               tier.name === "Platinum" ? "💎" : "👑"}
                            </span>
                            <div>
                              <div className={`font-semibold ${isCurrent ? "text-orange-400" : "text-white"}`}>
                                {tier.name}
                              </div>
                              <div className="text-sm text-slate-400">{tier.sales_range}</div>
                            </div>
                          </div>
                          <div className={`font-bold ${isCurrent ? "text-orange-400" : "text-slate-300"}`}>
                            {tier.fee}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tax Information */}
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <h2 className="text-xl font-bold text-white mb-6">Tax Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Tax ID / VAT Number</label>
                  <input
                    type="text"
                    value={taxData.tax_id}
                    onChange={(e) => setTaxData({...taxData, tax_id: e.target.value})}
                    placeholder="Enter your tax ID"
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Business Name (Optional)</label>
                  <input
                    type="text"
                    value={taxData.business_name}
                    onChange={(e) => setTaxData({...taxData, business_name: e.target.value})}
                    placeholder="Your business name"
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <button 
                onClick={handleSaveTaxInfo}
                disabled={saving}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Tax Info'}
              </button>
            </div>
            </>
            )}
          </div>
        )}
        </>
        )}
      </div>

      {/* Add Payment Method Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-orange-500/30 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Add Payment Method</h3>
              <button 
                onClick={() => setShowAddPaymentModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Payment Type Selection */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Payment Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethodData({...paymentMethodData, type: 'paypal'})}
                    className={`p-4 rounded-lg border transition ${
                      paymentMethodData.type === 'paypal'
                        ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                        : 'bg-slate-950/50 border-slate-700/50 text-slate-400 hover:border-orange-500/30'
                    }`}
                  >
                    <div className="text-2xl mb-2">💳</div>
                    <div className="font-semibold">PayPal</div>
                  </button>
                  <button
                    onClick={() => setPaymentMethodData({...paymentMethodData, type: 'bank'})}
                    className={`p-4 rounded-lg border transition ${
                      paymentMethodData.type === 'bank'
                        ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                        : 'bg-slate-950/50 border-slate-700/50 text-slate-400 hover:border-orange-500/30'
                    }`}
                  >
                    <div className="text-2xl mb-2">🏦</div>
                    <div className="font-semibold">Bank</div>
                  </button>
                </div>
              </div>

              {/* PayPal Fields */}
              {paymentMethodData.type === 'paypal' && (
                <div>
                  <label className="block text-sm text-slate-400 mb-2">PayPal Email</label>
                  <input
                    type="email"
                    value={paymentMethodData.email}
                    onChange={(e) => setPaymentMethodData({...paymentMethodData, email: e.target.value})}
                    placeholder="your@email.com"
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition"
                  />
                </div>
              )}

              {/* Bank Account Fields */}
              {paymentMethodData.type === 'bank' && (
                <>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Account Holder Name</label>
                    <input
                      type="text"
                      value={paymentMethodData.account_holder_name}
                      onChange={(e) => setPaymentMethodData({...paymentMethodData, account_holder_name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Account Number</label>
                    <input
                      type="text"
                      value={paymentMethodData.account_number}
                      onChange={(e) => setPaymentMethodData({...paymentMethodData, account_number: e.target.value})}
                      placeholder="1234567890"
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Routing Number</label>
                    <input
                      type="text"
                      value={paymentMethodData.routing_number}
                      onChange={(e) => setPaymentMethodData({...paymentMethodData, routing_number: e.target.value})}
                      placeholder="123456789"
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddPaymentModal(false)}
                className="flex-1 px-4 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPaymentMethod}
                disabled={saving}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Adding...' : 'Add Method'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
    </ProtectedRoute>
  );
}
