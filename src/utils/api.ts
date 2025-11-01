// API utility functions
// Replace these mock functions with actual API calls to your MySQL backend

import { User, Citizen, Bill, Fastag, Feedback, Notification, ErrorLog } from "@/types";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Error logging utility - logs to error_log table
export const logError = async (errorTypeId: string, citizenId: string, errorMessage: string) => {
  try {
    // TODO: Replace with actual API call
    // await fetch(`${API_BASE_URL}/error-log`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ error_type_id: errorTypeId, citizen_id: citizenId, error_message: errorMessage })
    // });
    console.error('Error logged:', { errorTypeId, citizenId, errorMessage });
  } catch (error) {
    console.error('Failed to log error:', error);
  }
};

// Authentication - connects to user table
export const authenticateUser = async (userId: string, password: string): Promise<Citizen> => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ user_id: userId, password })
    // });
    // if (!response.ok) throw new Error('Invalid credentials');
    // const data = await response.json();
    // return data.citizen;

    // Mock implementation
    if (userId === 'user123' && password === 'password') {
      return {
        citizen_id: 'CIT001',
        name: 'John Doe',
        dob: '1990-01-01',
        phone: '+91 98765 43210',
        email: 'john.doe@example.com',
      };
    }
    throw new Error('Invalid credentials');
  } catch (error) {
    await logError('AUTH_FAIL', userId, 'Login failed');
    throw error;
  }
};

// Fetch bills for a citizen - connects to bills table
export const fetchBills = async (citizenId: string): Promise<Bill[]> => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/bills/${citizenId}`);
    // if (!response.ok) throw new Error('Failed to fetch bills');
    // return await response.json();

    // Mock implementation
    return [
      {
        bill_id: 'B001',
        citizen_id: citizenId,
        property_id: 'P001',
        bill_type: 'water',
        units_used: 150,
        amount: 450,
        issue_date: '2024-01-01',
        due_date: '2024-01-15',
      },
      {
        bill_id: 'B002',
        citizen_id: citizenId,
        property_id: 'P001',
        bill_type: 'electricity',
        units_used: 320,
        amount: 1280,
        issue_date: '2024-01-01',
        due_date: '2024-01-15',
      },
      {
        bill_id: 'B003',
        citizen_id: citizenId,
        property_id: 'P001',
        bill_type: 'property_tax',
        units_used: 1,
        amount: 5000,
        issue_date: '2024-01-01',
        due_date: '2024-03-31',
      },
      {
        bill_id: 'B004',
        citizen_id: citizenId,
        property_id: 'P001',
        bill_type: 'gas',
        units_used: 85,
        amount: 680,
        issue_date: '2024-01-01',
        due_date: '2024-01-15',
      },
    ];
  } catch (error) {
    await logError('FETCH_BILLS_FAIL', citizenId, 'Failed to fetch bills');
    throw error;
  }
};

// Pay a bill - updates bills table
export const payBill = async (billId: string, methodId: string): Promise<void> => {
  try {
    // TODO: Replace with actual API call
    // await fetch(`${API_BASE_URL}/bills/${billId}/pay`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ method_id: methodId, payment_date: new Date().toISOString() })
    // });

    // Mock implementation
    console.log('Bill paid:', { billId, methodId });
  } catch (error) {
    throw error;
  }
};

// Fetch Fastag details - connects to fastag table
export const fetchFastag = async (citizenId: string): Promise<Fastag[]> => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/fastag/${citizenId}`);
    // if (!response.ok) throw new Error('Failed to fetch Fastag');
    // return await response.json();

    // Mock implementation
    return [
      {
        fastag_id: 'FT001',
        citizen_id: citizenId,
        vehicle_number: 'MH-01-AB-1234',
        balance: 2500,
      },
    ];
  } catch (error) {
    await logError('FETCH_FASTAG_FAIL', citizenId, 'Failed to fetch Fastag');
    throw error;
  }
};

// Top up Fastag - updates fastag table
export const topUpFastag = async (fastagId: string, amount: number): Promise<void> => {
  try {
    // TODO: Replace with actual API call
    // await fetch(`${API_BASE_URL}/fastag/${fastagId}/topup`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ amount })
    // });

    // Mock implementation
    console.log('Fastag topped up:', { fastagId, amount });
  } catch (error) {
    throw error;
  }
};

// Submit feedback - inserts into feedback table
export const submitFeedback = async (citizenId: string, rating: number, comment: string): Promise<void> => {
  try {
    // TODO: Replace with actual API call
    // await fetch(`${API_BASE_URL}/feedback`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ citizen_id: citizenId, rating, comment, feedback_date: new Date().toISOString() })
    // });

    // Mock implementation
    console.log('Feedback submitted:', { citizenId, rating, comment });
  } catch (error) {
    await logError('SUBMIT_FEEDBACK_FAIL', citizenId, 'Failed to submit feedback');
    throw error;
  }
};

// Fetch feedback history - connects to feedback table
export const fetchFeedback = async (citizenId: string): Promise<Feedback[]> => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/feedback/${citizenId}`);
    // if (!response.ok) throw new Error('Failed to fetch feedback');
    // return await response.json();

    // Mock implementation
    return [
      {
        feedback_id: 'FB001',
        citizen_id: citizenId,
        rating: 5,
        comment: 'Great service! Very convenient.',
        feedback_date: '2024-12-15',
      },
    ];
  } catch (error) {
    await logError('FETCH_FEEDBACK_FAIL', citizenId, 'Failed to fetch feedback');
    throw error;
  }
};

// Fetch notifications - connects to notifications table
export const fetchNotifications = async (citizenId: string): Promise<Notification[]> => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/notifications/${citizenId}`);
    // if (!response.ok) throw new Error('Failed to fetch notifications');
    // return await response.json();

    // Mock implementation
    return [
      {
        notification_id: 'N001',
        citizen_id: citizenId,
        message: 'Your water bill of ₹450 is due on January 15, 2024',
        status: 'unread',
        notification_date: '2024-01-05',
      },
      {
        notification_id: 'N002',
        citizen_id: citizenId,
        message: 'Your electricity bill of ₹1280 is due on January 15, 2024',
        status: 'unread',
        notification_date: '2024-01-05',
      },
      {
        notification_id: 'N003',
        citizen_id: citizenId,
        message: 'Property tax payment reminder - Due on March 31, 2024',
        status: 'read',
        notification_date: '2024-01-01',
      },
    ];
  } catch (error) {
    await logError('FETCH_NOTIFICATIONS_FAIL', citizenId, 'Failed to fetch notifications');
    throw error;
  }
};

// Mark notification as read - updates notifications table
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    // TODO: Replace with actual API call
    // await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    // });

    // Mock implementation
    console.log('Notification marked as read:', notificationId);
  } catch (error) {
    throw error;
  }
};
