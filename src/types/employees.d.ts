export interface User {
  id: string;
  lastName: string;
  firstName: string;
  admin: boolean;
  status: string;
  demo: boolean;
  email: string;
}

export interface Employee extends User {
  feedToken: string;
  contractType: "fulltime" | "parttime";
  createdAt: number;
  phone: string;
  role: string;
  notes: string;
  contract: number;
}
