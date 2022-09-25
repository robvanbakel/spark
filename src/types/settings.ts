export interface Address {
  street: string;
  postalCode: string;
  city: string;
}

export interface Settings {
  id: "settings";
  address: Address;
  suggestions: string[];
  shareWithEmployees: {
    employeeNotes: boolean;
    shiftNotes: boolean;
  };
  dateNotation: string;
  roles: string[];
}
