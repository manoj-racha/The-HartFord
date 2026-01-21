export interface Address {
    street: string;
    city: string;
    state: string;
    pincode: string;
}

export interface Insurance {
    id: number;
    name: string;
    policyNumber: string;
    policyType: string;
    premium: number;
    phone: string;
    email: string;
    dateOfBirth: string; // YYYY-MM-DD
    nominee: string;
    address: Address;
}
