/**
 * Support hooks
 */

import { useState, useEffect } from 'react';
import { supportApi, SupportTicket, FAQ } from '../support';

export const useSupport = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await supportApi.getTickets();
      setTickets(data.tickets || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const createTicket = async (data: any) => {
    try {
      const newTicket = await supportApi.createTicket(data);
      setTickets((prev) => [newTicket, ...prev]);
      return newTicket;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create ticket');
      throw err;
    }
  };

  return {
    tickets,
    loading,
    error,
    createTicket,
    refetch: fetchTickets,
  };
};

export const useSupportTicket = (ticketId: string) => {
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const ticketData = await supportApi.getTicket(ticketId);
      setTicket(ticketData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch ticket');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const sendMessage = async (content: string, attachments?: string[]) => {
    try {
      await supportApi.sendMessage(ticketId, { content, attachments });
      // Refetch ticket to get updated messages
      await fetchTicket();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send message');
      throw err;
    }
  };

  return {
    ticket,
    messages: ticket?.messages || [],
    loading,
    error,
    sendMessage,
    refetch: fetchTicket,
  };
};

export const useFAQs = (category?: string) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const data = await supportApi.getFAQs(category ? { category } : undefined);
        setFaqs(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch FAQs');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, [category]);

  const markHelpful = async (faqId: string) => {
    try {
      await supportApi.markFAQHelpful(faqId);
      // Update local state
      setFaqs((prev) =>
        prev.map((faq) =>
          faq.id === faqId ? { ...faq, helpful_count: faq.helpful_count + 1 } : faq
        )
      );
    } catch (err: any) {
      console.error('Failed to mark FAQ as helpful:', err);
    }
  };

  return {
    faqs,
    loading,
    error,
    markHelpful,
  };
};
