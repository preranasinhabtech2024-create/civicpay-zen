// Database types matching MySQL schema

export interface User {
  user_id: string;
  password: string;
  citizen_id: string;
}

export interface Citizen {
  citizen_id: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
}

export type BillType = 'water' | 'electricity' | 'property_tax' | 'gas';

export interface Bill {
  bill_id: string;
  citizen_id: string;
  property_id: string;
  bill_type: BillType;
  units_used: number;
  amount: number;
  issue_date: string;
  due_date: string;
  method_id?: string;
  payment_date?: string;
}

export interface Fastag {
  fastag_id: string;
  citizen_id: string;
  vehicle_number: string;
  balance: number;
}

export interface Feedback {
  feedback_id: string;
  citizen_id: string;
  rating: number;
  comment: string;
  feedback_date: string;
}

export interface ErrorLog {
  error_type_id: string;
  citizen_id: string;
  error_message?: string;
  timestamp?: string;
}

export interface Notification {
  notification_id: string;
  citizen_id: string;
  message: string;
  status: 'unread' | 'read';
  notification_date: string;
}

export interface PaymentMethod {
  method_id: string;
  method_name: string;
}

export interface AuthContextType {
  user: Citizen | null;
  login: (userId: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
