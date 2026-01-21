export interface Transaction {
  id: string | number;
  accountId: string | number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: Date;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}
