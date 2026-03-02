import api from './api';

export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: Pagination;
}

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

export const getOpportunities = async (page: number = 1, limit: number = 10): Promise<Opportunity[]> => {
  const response = await api.get<ApiResponse<Opportunity[]>>(`/opportunities?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const getMyOpportunities = async (page: number = 1, limit: number = 10): Promise<Opportunity[]> => {
  const response = await api.get<ApiResponse<Opportunity[]>>(`/opportunities/mine?page=${page}&limit=${limit}`);
  return response.data.data;
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
  const response = await api.post<ApiResponse<Opportunity>>('/opportunities', data);
  return response.data.data;
};

export const updateOpportunity = async (id: string, data: Partial<Opportunity>): Promise<Opportunity> => {
  const response = await api.put<ApiResponse<Opportunity>>(`/opportunities/${id}`, data);
  return response.data.data;
};

export const deleteOpportunity = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete<ApiResponse<null>>(`/opportunities/${id}`);
  return { message: response.data.message || 'Deleted' };
};

// ──────────────── Masked Talent Pool ────────────────

export interface MaskedTalent {
  _id: string;
  role: string;
  [key: string]: unknown; // Discriminator fields are top-level
}

export const getMaskedTalent = async (page: number = 1, limit: number = 10): Promise<MaskedTalent[]> => {
  const response = await api.get<ApiResponse<MaskedTalent[]>>(`/users/masked-talent?page=${page}&limit=${limit}`);
  return response.data.data;
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
  const response = await api.post<ApiResponse<ConnectionResponse['connectionRequest']>>('/connections/request', {
    facilitatorId,
    ...(opportunityId && { opportunityId }),
  });
  return {
    message: response.data.message || 'Requested',
    connectionRequest: response.data.data
  };
};

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

export const getPendingRequests = async (page: number = 1, limit: number = 10): Promise<ConnectionRequest[]> => {
  const response = await api.get<ApiResponse<ConnectionRequest[]>>(`/connections/admin/pending?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const updateConnectionStatus = async (
  id: string,
  status: 'approved' | 'rejected',
  adminNotes?: string
): Promise<{ message: string; connectionRequest: ConnectionRequest }> => {
  const response = await api.put<ApiResponse<ConnectionRequest>>(
    `/connections/admin/update/${id}`,
    { status, ...(adminNotes && { adminNotes }) }
  );
  return {
    message: response.data.message || 'Updated',
    connectionRequest: response.data.data
  };
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

export const getNotifications = async (page: number = 1, limit: number = 20): Promise<NotificationItem[]> => {
  const response = await api.get<ApiResponse<NotificationItem[]>>(`/notifications?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const markAllNotificationsRead = async (): Promise<{ message: string }> => {
  const response = await api.put<ApiResponse<null>>('/notifications/mark-all-read');
  return { message: response.data.message || 'Marked all as read' };
};

export const markNotificationRead = async (id: string): Promise<NotificationItem> => {
  const response = await api.put<ApiResponse<NotificationItem>>(`/notifications/${id}/read`);
  return response.data.data;
};

export const clearAllNotifications = async (): Promise<{ message: string }> => {
  const response = await api.delete<ApiResponse<null>>('/notifications/clear-all');
  return { message: response.data.message || 'Cleared all' };
};

export const deleteNotification = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete<ApiResponse<null>>(`/notifications/${id}`);
  return { message: response.data.message || 'Deleted' };
};

// ──────────────── User Profile ────────────────

export const fetchUserProfile = async (): Promise<Record<string, unknown>> => {
  const response = await api.get<ApiResponse<Record<string, unknown>>>('/users/profile');
  return response.data.data;
};

export const updateUserProfile = async (data: Record<string, unknown>): Promise<Record<string, unknown>> => {
  const response = await api.put<ApiResponse<Record<string, unknown>>>('/users/profile', data);
  return response.data.data;
};

export const uploadResume = async (file: File): Promise<{ resumeUrl: string; user: Record<string, unknown> }> => {
  const formData = new FormData();
  formData.append('resume', file);
  // DO NOT set Content-Type header — browser handles multipart boundary automatically
  const response = await api.post<ApiResponse<{ resumeUrl: string; user: Record<string, unknown> }>>('/users/upload-resume', formData);
  return response.data.data;
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

export const getTestimonials = async (page: number = 1, limit: number = 10): Promise<Testimonial[]> => {
  const response = await api.get<ApiResponse<Testimonial[]>>(`/testimonials?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const createTestimonial = async (data: {
  company: string;
  role: string;
  quote: string;
  rating: number;
}): Promise<Testimonial> => {
  const response = await api.post<ApiResponse<Testimonial>>('/testimonials', data);
  return response.data.data;
};

export const getPendingTestimonials = async (page: number = 1, limit: number = 10): Promise<Testimonial[]> => {
  const response = await api.get<ApiResponse<Testimonial[]>>(`/testimonials/admin/pending?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const approveTestimonial = async (id: string): Promise<Testimonial> => {
  const response = await api.put<ApiResponse<Testimonial>>(`/testimonials/${id}/approve`);
  return response.data.data;
};

export const deleteTestimonial = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete<ApiResponse<null>>(`/testimonials/${id}`);
  return { message: response.data.message || 'Deleted' };
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
  const response = await api.get<ApiResponse<AnnouncementData[]>>('/announcements/active');
  return response.data.data;
};

export const getAllAnnouncements = async (page: number = 1, limit: number = 10): Promise<AnnouncementData[]> => {
  const response = await api.get<ApiResponse<AnnouncementData[]>>(`/announcements?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const createAnnouncement = async (data: Partial<AnnouncementData>): Promise<AnnouncementData> => {
  const response = await api.post<ApiResponse<AnnouncementData>>('/announcements', data);
  return response.data.data;
};

export const updateAnnouncement = async (id: string, data: Partial<AnnouncementData>): Promise<AnnouncementData> => {
  const response = await api.put<ApiResponse<AnnouncementData>>(`/announcements/${id}`, data);
  return response.data.data;
};

export const deleteAnnouncement = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete<ApiResponse<null>>(`/announcements/${id}`);
  return { message: response.data.message || 'Deleted' };
};
