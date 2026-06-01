export interface Package {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  features: string[];
  recommendedGear: string[];
  estimatedDuration: string;
  category: 'wedding' | 'commercial' | 'narrative' | 'event';
}

export type ProjectStatus = 'pre_production' | 'shooting' | 'rough_cut' | 'editing' | 'final_delivery';
export type PaymentStatus = 'pending_deposit' | 'deposit_paid' | 'fully_paid';

export interface AIBrief {
  theme: string;
  scriptOutline: string;
  recommendedGear: string[];
  shootTimeline: string;
  creativeMood: string;
  clientNotes?: string;
}

export interface Booking {
  id: string; // Dynamic code (e.g. VID-1234)
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  packageName: string;
  packageId: string;
  totalPrice: number;
  depositAmount: number;
  depositPaid: number;
  remainingBalance: number;
  paymentStatus: PaymentStatus;
  projectStatus: ProjectStatus;
  shootDate: string;
  location: string;
  notes: string;
  createdAt: string;
  aiBrief?: AIBrief;
  deliveryLink?: string;
  timelineMilestones?: {
    label: string;
    description: string;
    completed: boolean;
    date: string;
  }[];
}

export interface Message {
  id: string;
  bookingId: string;
  sender: 'client' | 'videographer' | 'system';
  senderName: string;
  text: string;
  createdAt: string;
  attachmentUrl?: string;
}

export interface PortfolioWork {
  id: string;
  title: string;
  category: string;
  client: string;
  description: string;
  videoUrl: string; // Mock embedding ID or premium placeholder
  thumbnailUrl: string;
  location: string;
  duration: string;
  gearUsed: string[];
  story: string;
  creativeChallenge: string;
  directorsCut?: boolean;
}
