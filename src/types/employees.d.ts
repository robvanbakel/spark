interface User {
  id: string;
  lastName: string;
  firstName: string;
  status: string;
  admin: boolean;
  demo: boolean;
  email: string;
}

export interface Admin extends User {
  admin: true;
}

export interface Employee extends User {
  admin: false;
  feedToken: string;
  contractType: "fulltime" | "parttime";
  createdAt: number;
  phone: string;
  role: string;
  notes: string;
  contract: number;
}
