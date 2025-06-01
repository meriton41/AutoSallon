export interface CarInsurance {
  id: string;
  policyNumber: string;
  carId: string;
  clientName: string;
  clientEmail: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  coverageDetails: string;
  price: number;
}
