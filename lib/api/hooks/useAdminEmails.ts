import { useState, useEffect } from 'react';

export function useAdminEmails() {
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        // const response = await api.admin.getEmailSettings();
        
        // Mock data for now
        setEmailTemplates([
          { id: 1, name: "Welcome Email", subject: "Welcome to SDModels!", status: "Active", sent: 1247 },
          { id: 2, name: "Model Approved", subject: "Your model has been approved!", status: "Active", sent: 456 },
          { id: 3, name: "Sale Notification", subject: "You made a sale!", status: "Active", sent: 2340 },
          { id: 4, name: "Password Reset", subject: "Reset your password", status: "Active", sent: 89 },
        ]);
        
        setCampaigns([
          { id: 1, name: "New Features Announcement", recipients: 1247, sent: "2024-02-15", opens: 856, clicks: 234 },
          { id: 2, name: "Creator Spotlight", recipients: 500, sent: "2024-02-10", opens: 345, clicks: 123 },
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch email settings');
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const sendEmail = async (recipientType: string, subject: string, body: string) => {
    try {
      // TODO: Call API
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to send email');
      return false;
    }
  };

  return { emailTemplates, campaigns, loading, error, sendEmail };
}
