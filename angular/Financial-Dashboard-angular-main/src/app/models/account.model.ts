export interface Account {
  id: string | number;
  accountName: string;
  accountNumber: string;
  accountType: 'savings' | 'checking' | 'credit' | 'investment';
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
