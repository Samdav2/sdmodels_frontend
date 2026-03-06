import apiClient from './client';

export interface Milestone {
  id: string;
  bounty_id: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
  order: number;
  status: 'pending' | 'in_progress' | 'submitted' | 'completed' | 'cancelled';
  started_at?: string;
  submitted_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DeadlineExtensionRequest {
  id: string;
  bounty_id: string;
  milestone_id?: string;
  artist_id: string;
  current_deadline: string;
  requested_deadline: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  response_message?: string;
  created_at: string;
  responded_at?: string;
}

export interface Bounty {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'open' | 'claimed' | 'in_progress' | 'submitted' | 'completed' | 'cancelled';
  requirements: string[];
  has_milestones: boolean;
  max_revisions: number;
  revision_count: number;
  poster_id: string;
  poster_username: string;
  claimed_by_id?: string;
  claimed_by_username?: string;
  claimed_at?: string;
  submitted_at?: string;
  completed_at?: string;
  milestones?: Milestone[];
  created_at: string;
  updated_at: string;
}

export interface BountyApplication {
  id: string;
  bounty_id: string;
  applicant_id: string;
  applicant_username: string;
  proposal: string;
  estimated_delivery: string;
  portfolio_links: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface BountySubmission {
  id: string;
  bounty_id: string;
  milestone_id?: string;
  artist_id: string;
  submission_type: 'upload' | 'link';
  model_file_url?: string;
  model_file_name?: string;
  model_file_size?: number;
  model_format?: string;
  external_model_url?: string;
  preview_images: string[];
  notes: string;
  revision_number: number;
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  feedback?: string;
  submitted_at: string;
  reviewed_at?: string;
}

export interface MilestoneCreate {
  title: string;
  description: string;
  amount: number;
  deadline: string;
  order: number;
}

export interface CreateBountyData {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: string[];
  has_milestones?: boolean;
  max_revisions?: number;
  milestones?: MilestoneCreate[];
}

export interface ApplyToBountyData {
  proposal: string;
  estimated_delivery: string;
  portfolio_links: string[];
}

export interface SubmitWorkData {
  submission_type: 'upload' | 'link';
  milestone_id?: string;
  // For file uploads
  model_file?: File;
  preview_image_files?: File[];
  // For external links
  external_model_url?: string;
  preview_images?: string[];
  // Common
  notes: string;
}

export interface RequestExtensionData {
  milestone_id?: string;
  requested_deadline: string;
  reason: string;
}

export interface ExtensionResponseData {
  response_message: string;
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
export const getBountyById = async (id: string) => {
  const response = await apiClient.get(`/bounties/${id}`);
  return response.data;
};

// Create new bounty (buyer)
export const createBounty = async (data: CreateBountyData) => {
  const response = await apiClient.post('/bounties', data);
  return response.data;
};

// Update bounty
export const updateBounty = async (id: string, data: Partial<CreateBountyData>) => {
  const response = await apiClient.put(`/bounties/${id}`, data);
  return response.data;
};

// Delete/cancel bounty
export const cancelBounty = async (id: string) => {
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
export const applyToBounty = async (bountyId: string, data: ApplyToBountyData) => {
  const response = await apiClient.post(`/bounties/${bountyId}/apply`, data);
  return response.data;
};

// Get applications for a bounty (buyer)
export const getBountyApplications = async (bountyId: string) => {
  const response = await apiClient.get(`/bounties/${bountyId}/applications`);
  return response.data;
};

// Approve application (buyer)
export const approveApplication = async (bountyId: string, applicationId: string) => {
  const response = await apiClient.post(`/bounties/${bountyId}/applications/${applicationId}/approve`);
  return response.data;
};

// Reject application (buyer)
export const rejectApplication = async (bountyId: string, applicationId: string) => {
  const response = await apiClient.post(`/bounties/${bountyId}/applications/${applicationId}/reject`);
  return response.data;
};

// Submit work (artist)
export const submitWork = async (bountyId: string, data: SubmitWorkData) => {
  const formData = new FormData();
  
  formData.append('submission_type', data.submission_type);
  
  if (data.milestone_id) {
    formData.append('milestone_id', data.milestone_id);
  }
  
  if (data.notes) {
    formData.append('notes', data.notes);
  }
  
  if (data.submission_type === 'upload') {
    // File upload mode
    if (data.model_file) {
      formData.append('model_file', data.model_file);
    }
    
    if (data.preview_image_files) {
      data.preview_image_files.forEach((file) => {
        formData.append('preview_images', file);
      });
    }
  } else {
    // External link mode
    if (data.external_model_url) {
      formData.append('external_model_url', data.external_model_url);
    }
    
    if (data.preview_images) {
      data.preview_images.forEach((url) => {
        formData.append('preview_image_urls', url);
      });
    }
  }
  
  const response = await apiClient.post(`/bounties/${bountyId}/submit`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get submission for bounty
export const getBountySubmission = async (bountyId: string) => {
  const response = await apiClient.get(`/bounties/${bountyId}/submission`);
  return response.data;
};

// Approve submission and release payment (buyer)
export const approveSubmission = async (bountyId: string, submissionId: string) => {
  const response = await apiClient.post(`/bounties/${bountyId}/submissions/${submissionId}/approve`);
  return response.data;
};

// Request revision (buyer)
export const requestRevision = async (bountyId: string, submissionId: string, feedback: string) => {
  const response = await apiClient.post(`/bounties/${bountyId}/submissions/${submissionId}/revision`, {
    feedback
  });
  return response.data;
};

// Reject submission (buyer)
export const rejectSubmission = async (bountyId: string, submissionId: string, reason: string) => {
  const response = await apiClient.post(`/bounties/${bountyId}/submissions/${submissionId}/reject`, {
    reason
  });
  return response.data;
};

// Get bounty milestones
export const getBountyMilestones = async (bountyId: string) => {
  const response = await apiClient.get(`/bounties/${bountyId}/milestones`);
  return response.data;
};

// Start milestone
export const startMilestone = async (bountyId: string, milestoneId: string) => {
  const response = await apiClient.post(`/bounties/${bountyId}/milestones/${milestoneId}/start`);
  return response.data;
};

// Request deadline extension
export const requestExtension = async (bountyId: string, data: RequestExtensionData) => {
  const response = await apiClient.post(`/bounties/${bountyId}/request-extension`, data);
  return response.data;
};

// Get extension requests
export const getExtensionRequests = async (bountyId: string) => {
  const response = await apiClient.get(`/bounties/${bountyId}/extension-requests`);
  return response.data;
};

// Approve extension request
export const approveExtension = async (bountyId: string, requestId: string, data: ExtensionResponseData) => {
  const response = await apiClient.post(`/bounties/${bountyId}/extension-requests/${requestId}/approve`, data);
  return response.data;
};

// Reject extension request
export const rejectExtension = async (bountyId: string, requestId: string, data: ExtensionResponseData) => {
  const response = await apiClient.post(`/bounties/${bountyId}/extension-requests/${requestId}/reject`, data);
  return response.data;
};

// Release escrow payment (admin/system)
export const releaseEscrow = async (bountyId: string) => {
  const response = await apiClient.post(`/bounties/${bountyId}/release-escrow`);
  return response.data;
};

// Get bounty statistics
export const getBountyStats = async () => {
  const response = await apiClient.get('/bounties/stats');
  return response.data;
};
