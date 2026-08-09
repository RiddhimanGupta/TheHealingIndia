export interface Challan {
  icon: string;
  reason: string;
  amount: number;
  zone: string;
  law: string;
  status: 'pending' | 'paid';
  _id?: string;
}

export interface Profile {
  name: string;
  vehicle: string;
  type: string;
  color: string;
  phone: string;
  challans: Challan[];
  registration?: string;
}
