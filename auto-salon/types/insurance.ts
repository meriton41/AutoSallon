export interface CarInsurance {
  id: string;
  policyNumber: string;
  carId: string;
  vehicleId?: number; // Backend uses vehicleId instead of carId
  clientName: string;
  clientEmail: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  coverageDetails: string;
  price: number;
}
