// packages/shared/src/types/database.ts
// GardenGreen — Shared type definitions
// [Source: architecture.md#4.1 Interfaces TypeScript]

// ============================================
// ENUMS
// ============================================

export type ServiceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'overdue';
export type PaymentMethod = 'pix_app' | 'pix_direct' | 'cash' | 'transfer' | 'other';
export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
export type RecurrenceFrequency = 'weekly' | 'biweekly' | 'monthly';
export type PhotoType = 'before' | 'after';
export type UploadStatus = 'pending' | 'uploading' | 'uploaded' | 'failed';
export type TeamMemberRole = 'admin' | 'member';
export type TeamMemberStatus = 'invited' | 'active' | 'inactive';
export type ClientStatus = 'active' | 'inactive';
export type ExpenseCategory = 'fuel' | 'tools' | 'supplies' | 'maintenance' | 'other';
export type UserPlan = 'free' | 'solo' | 'team';
export type UserRole = 'gardener' | 'admin' | 'member';

// ============================================
// ENTIDADES
// ============================================

export interface User {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  city: string | null;
  service_type: string | null;
  avatar_url: string | null;
  cnpj_mei: string | null;
  address: string | null;
  plan: UserPlan;
  role: UserRole;
  team_id: string | null;
  onboarding_completed: boolean;
  profile_completion: number;
  expo_push_token: string | null;
  timezone: string;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  neighborhood: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  notes: string | null;
  status: ClientStatus;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  user_id: string;
  client_id: string;
  date: string;
  time: string | null;
  type: string;
  description: string | null;
  value: number;
  status: ServiceStatus;
  recurrence_id: string | null;
  assigned_to: string | null;
  team_id: string | null;
  quote_id: string | null;
  notes: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Recurrence {
  id: string;
  user_id: string;
  client_id: string;
  service_type: string;
  value: number;
  frequency: RecurrenceFrequency;
  day_of_week: number;
  time: string | null;
  active: boolean;
  next_generation_date: string;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  user_id: string;
  client_id: string;
  number: string;
  items: QuoteItem[];
  total: number;
  status: QuoteStatus;
  valid_until: string;
  sent_at: string | null;
  approved_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  description: string;
  value: number;
  quantity: number;
}

export interface Payment {
  id: string;
  service_id: string;
  user_id: string;
  client_id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  pix_transaction_id: string | null;
  pix_qr_code: string | null;
  pix_copy_paste: string | null;
  pix_link: string | null;
  pix_expires_at: string | null;
  paid_at: string | null;
  refunded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: string;
  service_id: string;
  client_id: string;
  user_id: string;
  type: PhotoType;
  url: string | null;
  local_path: string | null;
  upload_status: UploadStatus;
  file_size: number;
  width: number;
  height: number;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  client_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  owner_id: string;
  name: string;
  plan: UserPlan;
  max_members: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  invited_at: string;
  joined_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  morning_enabled: boolean;
  morning_time: string;
  evening_enabled: boolean;
  evening_time: string;
  payment_reminder_enabled: boolean;
  payment_reminder_days: number;
  monthly_report_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface MonthlyReport {
  id: string;
  user_id: string;
  month: number;
  year: number;
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  services_completed: number;
  clients_served: number;
  pending_payments: number;
  pending_count: number;
  created_at: string;
}
