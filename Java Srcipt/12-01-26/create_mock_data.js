const XLSX = require('xlsx');

// Define some dummy data
const data = [
    { AccountType: 'Savings', AccountNumber: 'SAV101', AccountHolder: 'Alice Green', Balance: 5000, Param1: 0.03, Param2: null }, // Param1 = Interest Rate
    { AccountType: 'Checking', AccountNumber: 'CHK102', AccountHolder: 'Bob Brown', Balance: 1500, Param1: 500, Param2: null },  // Param1 = Overdraft Limit
    { AccountType: 'Investment', AccountNumber: 'INV103', AccountHolder: 'Charlie Black', Balance: 20000, Param1: 0.05, Param2: 'High' }, // Param1 = Interest, Param2 = Risk
    { AccountType: 'Savings', AccountNumber: 'SAV104', AccountHolder: 'Diana White', Balance: 8000, Param1: 0.025, Param2: null },
    { AccountType: 'Checking', AccountNumber: 'CHK105', AccountHolder: 'Evan Blue', Balance: 300, Param1: 200, Param2: null }
];

// Create a new workbook and worksheet
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(data);

// Append the worksheet to the workbook
XLSX.utils.book_append_sheet(wb, ws, "Accounts");

// Write to file
XLSX.writeFile(wb, "BankData.xlsx");
console.log("BankData.xlsx created successfully!");
