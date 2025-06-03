"use client";
import { CarInsurance } from "@/types/insurance";
import CarInsuranceForm from "@/components/CarInsuranceForm";

export default function DashboardCarInsurancePage() {
  const handleSubmit = (insurance: CarInsurance) => {
    alert(`Insurance saved for policy: ${insurance.policyNumber}`);
    // TODO: Add backend integration here
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard: Add Car Insurance</h1>
      <CarInsuranceForm onSubmit={handleSubmit} />
    </div>
  );
}
