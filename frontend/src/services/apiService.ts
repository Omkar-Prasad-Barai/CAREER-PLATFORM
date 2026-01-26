import api from './api';

// ──────────────── Opportunities ────────────────

export interface Opportunity {
  _id: string;
  facilitatorId: { _id: string; fullName: string; role: string; companyName?: string } | string;
  title: string;
  description?: string;
  category: string;
  type?: string;       // 'Internship' | 'Full-time' | 'Part-time' | 'Project' | 'Contract'
  jobType?: string;
  stipendOrSalary?: string;
  duration?: string;
  eligibility?: string;
  skillsRequired: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getOpportunities = async (): Promise<Opportunity[]> => {
  const response = await api.get<Opportunity[]>('/opportunities');
  return response.data;
};

export const getMyOpportunities = async (): Promise<Opportunity[]> => {
  const response = await api.get<Opportunity[]>('/opportunities/mine');
  return response.data;
};

export const createOpportunity = async (data: {
  title: string;
  category: string;
  description?: string;
  type?: string;
  jobType?: string;
  stipendOrSalary?: string;
  duration?: string;
  eligibility?: string;
  skillsRequired?: string[];
}): Promise<Opportunity> => {
  const response = await api.post<Opportunity>('/opportunities', data);
  return response.data;
};

export const deleteOpportunity = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/opportunities/${id}`);
  return response.data;
};

// ──────────────── Masked Talent Pool ────────────────

export interface MaskedTalent {
  _id: string;
  role: string;
  [key: string]: unknown; // Discriminator fields are top-level
}

export const getMaskedTalent = async (): Promise<MaskedTalent[]> => {
  const response = await api.get<MaskedTalent[]>('/users/masked-talent');
  return response.data;
};

// ──────────────── Connections ────────────────

export interface ConnectionResponse {
  message: string;
  connectionRequest: {
    _id: string;
    seekerId: string;
    facilitatorId: string;
    opportunityId?: string;
    status: string;
  };
}

export const requestConnection = async (
  facilitatorId: string,
  opportunityId?: string
): Promise<ConnectionResponse> => {
  const response = await api.post<ConnectionResponse>('/connections/request', {
    facilitatorId,
    ...(opportunityId && { opportunityId }),
  });
  return response.data;
};

// ──────────────── Admin Connection Requests ────────────────

export interface ConnectionRequest {
  _id: string;
  seekerId: { _id: string; fullName: string; email: string; profileDetails?: Record<string, unknown> } | string;
  facilitatorId: { _id: string; fullName: string; email: string } | string;
  opportunityId: { _id: string; title: string } | string | null;
  status: 'pending_admin' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export const getPendingRequests = async (): Promise<ConnectionRequest[]> => {
  const response = await api.get<ConnectionRequest[]>('/connections/admin/pending');
  return response.data;
};

export const updateConnectionStatus = async (
  id: string,
  status: 'approved' | 'rejected',
  adminNotes?: string
): Promise<{ message: string; connectionRequest: ConnectionRequest }> => {
  const response = await api.put<{ message: string; connectionRequest: ConnectionRequest }>(
    `/connections/admin/update/${id}`,
    { status, ...(adminNotes && { adminNotes }) }
  );
  return response.data;
};

// ──────────────── Notifications ────────────────

export interface NotificationItem {
  _id: string;
  userId: string;
  type: 'connection_approved' | 'new_applicant' | 'application_update' | 'system';
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

export const getNotifications = async (): Promise<NotificationItem[]> => {
  const response = await api.get<NotificationItem[]>('/notifications');
  return response.data;
};

export const markAllNotificationsRead = async (): Promise<{ message: string }> => {
  const response = await api.put<{ message: string }>('/notifications/mark-all-read');
  return response.data;
};

export const markNotificationRead = async (id: string): Promise<NotificationItem> => {
  const response = await api.put<NotificationItem>(`/notifications/${id}/read`);
  return response.data;
};

// ──────────────── User Profile ────────────────

export const fetchUserProfile = async (): Promise<Record<string, unknown>> => {
  const response = await api.get<Record<string, unknown>>('/users/profile');
  return response.data;
};

export const updateUserProfile = async (data: Record<string, unknown>): Promise<Record<string, unknown>> => {
  const response = await api.put<Record<string, unknown>>('/users/profile', data);
  return response.data;
};

export const uploadResume = async (file: File): Promise<{ resumeUrl: string; user: Record<string, unknown> }> => {
  const formData = new FormData();
  formData.append('resume', file);
  // DO NOT set Content-Type header — browser handles multipart boundary automatically
  const response = await api.post<{ resumeUrl: string; user: Record<string, unknown> }>('/users/upload-resume', formData);
  return response.data;
};

// ──────────────── Testimonials ────────────────

export interface Testimonial {
  _id: string;
  userId: string;
  fullName: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  isApproved: boolean;
  createdAt: string;
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const response = await api.get<Testimonial[]>('/testimonials');
  return response.data;
};

export const createTestimonial = async (data: {
  company: string;
  role: string;
  quote: string;
  rating: number;
}): Promise<Testimonial> => {
  const response = await api.post<Testimonial>('/testimonials', data);
  return response.data;
};

// ──────────────── Announcements ────────────────

export interface AnnouncementData {
  _id: string;
  message: string;
  emoji: string;
  isActive: boolean;
  priority: number;
}

export const getActiveAnnouncements = async (): Promise<AnnouncementData[]> => {
  const response = await api.get<AnnouncementData[]>('/announcements/active');
  return response.data;
};
