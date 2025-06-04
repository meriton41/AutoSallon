export interface Bill {
  id: string;
  clientName: string;
  clientEmail: string;
  carId: string;
  amount: number;
  description: string;
  date: string; // ISO string
}
