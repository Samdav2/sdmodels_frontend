import { useState, useEffect } from 'react';
import { adminApi } from '../admin';

export function useAdminEmails() {
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getEmailTemplates();
      setEmailTemplates(data.templates || data || []);
      setCampaigns(data.campaigns || []);
    } catch (err: any) {
      console.error('Failed to fetch emails:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch email settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const sendEmail = async (recipientType: string, subject: string, body: string) => {
    try {
      await adminApi.sendEmail(recipientType, subject, body);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to send email');
      return false;
    }
  };

  return { emailTemplates, campaigns, loading, error, sendEmail, refetch: fetchEmails };
}
