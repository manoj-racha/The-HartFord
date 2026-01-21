export interface Property {
    id: string;
    name: string;
}

export interface Transaction {
    id: string;
    propertyId: string;
    propertyName: string;
    transactionType: 'Income' | 'Expense';
    category: string;
    amount: number;
    date: string;
    description: string;
}
