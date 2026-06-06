export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  PRODUCTION = 'PRODUCTION', // Changed from INVENTORY
  CLIENTS = 'CLIENTS',
  FINANCE = 'FINANCE',
  AI_STUDIO = 'AI_STUDIO',
  AI_CHAT = 'AI_CHAT' // New View
}

export type StageStatus = 'pending' | 'in_progress' | 'completed' | 'delayed';

export interface ProjectStage {
  id: string;
  name: string;
  status: StageStatus;
  date: string; // Deadline or Completion date
  notes?: string;
}

export interface CollectionProject {
  id: string;
  clientName: string;
  collectionName: string;
  deadline: string;
  budget: number;
  stages: ProjectStage[];
  status: 'active' | 'delivered' | 'paused';
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  lastPurchaseDate: string;
  preferences: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Product {
    // Keeping for legacy/dashboard compatibility if needed, or minimal usage
    id: string;
    name: string;
    stock: number;
    cost: number;
    price: number;
}
