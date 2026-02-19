import apiClient from './client';

export interface Bounty {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'open' | 'claimed' | 'in_progress' | 'submitted' | 'completed' | 'cancelled';
  requirements: string[];
  poster_id: number;
  poster_username: string;
  claimed_by_id?: number;
  claimed_by_username?: string;
  claimed_at?: string;
  submitted_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BountyApplication {
  id: number;
  bounty_id: number;
  applicant_id: number;
  applicant_username: string;
  proposal: string;
  estimated_delivery: string;
  portfolio_links: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface BountySubmission {
  id: number;
  bounty_id: number;
  artist_id: number;
  model_url: string;
  preview_images: string[];
  notes: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  feedback?: string;
  submitted_at: string;
  reviewed_at?: string;
}

export interface CreateBountyData {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: string[];
}

export interface ApplyToBountyData {
  proposal: string;
  estimated_delivery: string;
  portfolio_links: string[];
}

export interface SubmitWorkData {
  model_url: string;
  preview_images: string[];
  notes: string;
}

// Get all bounties with filters
export const getBounties = async (params?: {
  status?: string;
  category?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await apiClient.get('/bounties', { params });
  return response.data;
};

// Get single bounty by ID
export const getBountyById = async (id: number) => {
  const response = await apiClient.get(`/bounties/${id}`);
  return response.data;
};

// Create new bounty (buyer)
export const createBounty = async (data: CreateBountyData) => {
  const response = await apiClient.post('/bounties', data);
  return response.data;
};

// Update bounty
export const updateBounty = async (id: number, data: Partial<CreateBountyData>) => {
  const response = await apiClient.put(`/bounties/${id}`, data);
  return response.data;
};

// Delete/cancel bounty
export const cancelBounty = async (id: number) => {
  const response = await apiClient.delete(`/bounties/${id}`);
  return response.data;
};

// Get my posted bounties
export const getMyPostedBounties = async () => {
  const response = await apiClient.get('/bounties/my-posted');
  return response.data;
};

// Get my claimed bounties
export const getMyClaimedBounties = async () => {
  const response = await apiClient.get('/bounties/my-claimed');
  return response.data;
};

// Apply to bounty (artist)
export const applyToBounty = async (bountyId: number, data: ApplyToBountyData) => {
  const response = await apiClient.post(`/bounties/${bountyId}/apply`, data);
  return response.data;
};

// Get applications for a bounty (buyer)
export const getBountyApplications = async (bountyId: number) => {
  const response = await apiClient.get(`/bounties/${bountyId}/applications`);
  return response.data;
};

// Approve application (buyer)
export const approveApplication = async (bountyId: number, applicationId: number) => {
  const response = await apiClient.post(`/bounties/${bountyId}/applications/${applicationId}/approve`);
  return response.data;
};

// Reject application (buyer)
export const rejectApplication = async (bountyId: number, applicationId: number) => {
  const response = await apiClient.post(`/bounties/${bountyId}/applications/${applicationId}/reject`);
  return response.data;
};

// Submit work (artist)
export const submitWork = async (bountyId: number, data: SubmitWorkData) => {
  const response = await apiClient.post(`/bounties/${bountyId}/submit`, data);
  return response.data;
};

// Get submission for bounty
export const getBountySubmission = async (bountyId: number) => {
  const response = await apiClient.get(`/bounties/${bountyId}/submission`);
  return response.data;
};

// Approve submission and release payment (buyer)
export const approveSubmission = async (bountyId: number, submissionId: number) => {
  const response = await apiClient.post(`/bounties/${bountyId}/submissions/${submissionId}/approve`);
  return response.data;
};

// Request revision (buyer)
export const requestRevision = async (bountyId: number, submissionId: number, feedback: string) => {
  const response = await apiClient.post(`/bounties/${bountyId}/submissions/${submissionId}/revision`, {
    feedback
  });
  return response.data;
};

// Reject submission (buyer)
export const rejectSubmission = async (bountyId: number, submissionId: number, reason: string) => {
  const response = await apiClient.post(`/bounties/${bountyId}/submissions/${submissionId}/reject`, {
    reason
  });
  return response.data;
};

// Release escrow payment (admin/system)
export const releaseEscrow = async (bountyId: number) => {
  const response = await apiClient.post(`/bounties/${bountyId}/release-escrow`);
  return response.data;
};

// Get bounty statistics
export const getBountyStats = async () => {
  const response = await apiClient.get('/bounties/stats');
  return response.data;
};
