import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface EventData {
  eventId: string;
  eventName: string;
  guestCount?: number;
  uploadDate?: string;
}

export interface Guest {
  index: number;
  fullName: string;
  organization: string;
  position: string;
  phone: string;
  staffCare: string;
  checkedIn: boolean;
  encodedPhone: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Upload Excel file
export const uploadEvent = async (file: File): Promise<ApiResponse<EventData>> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/events/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Get all events
export const getEvents = async (): Promise<ApiResponse<EventData[]>> => {
  const response = await api.get('/events');
  return response.data;
};

// Get guests for specific event
export const getEventGuests = async (eventId: string): Promise<ApiResponse<Guest[]>> => {
  const response = await api.get(`/events/${eventId}/guests`);
  return response.data;
};

// Scan QR code
export const scanQRCode = async (eventId: string, encodedPhone: string): Promise<ApiResponse<Guest>> => {
  const response = await api.post('/qr/scan', {
    eventId,
    encodedPhone,
  });
  return response.data;
};

// Confirm check-in
export const confirmCheckIn = async (eventId: string, encodedPhone: string): Promise<ApiResponse<void>> => {
  const response = await api.post('/checkin', {
    eventId,
    encodedPhone,
  });
  return response.data;
};

export default api;
