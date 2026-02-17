/**
 * Support hooks
 */

import { useState, useEffect } from 'react';
import { supportApi, SupportTicket, SupportMessage } from '../support';

export const useSupport = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await supportApi.getTickets();
        setTickets(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

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
  };
};

export const useSupportTicket = (ticketId: string) => {
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        const [ticketData, messagesData] = await Promise.all([
          supportApi.getTicket(ticketId),
          supportApi.getTicketMessages(ticketId),
        ]);
        setTicket(ticketData);
        setMessages(messagesData);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch ticket');
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchTicketData();
    }
  }, [ticketId]);

  const sendMessage = async (text: string, attachments?: File[]) => {
    try {
      const newMessage = await supportApi.sendMessage({
        ticket_id: ticketId,
        text,
        attachments,
      });
      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send message');
      throw err;
    }
  };

  return {
    ticket,
    messages,
    loading,
    error,
    sendMessage,
  };
};

export const useFAQs = () => {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const data = await supportApi.getFAQs();
        setFaqs(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch FAQs');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  return {
    faqs,
    loading,
    error,
  };
};
