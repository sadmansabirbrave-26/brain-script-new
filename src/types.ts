export type UserRole = 'client' | 'writer' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  expertise?: string[];
  createdAt: string;
}

export type OrderStatus = 'pending' | 'price-offered' | 'price-accepted' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  title: string;
  description: string;
  deadline: string;
  budget: number;
  status: OrderStatus;
  clientUid: string;
  writerUid?: string;
  files?: string[];
  createdAt: string;
  offeredPrice?: number;
  priceOfferedBy?: string;
  priceOfferedAt?: string;
}

export interface Message {
  id: string;
  orderId: string;
  senderUid: string;
  text: string;
  timestamp: string;
}
