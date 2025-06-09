"use client";
import { CarInsurance } from "@/types/insurance";
import CarInsuranceForm from "@/components/CarInsuranceForm";

export default function DashboardCarInsurancePage() {
  const handleSubmit = (insurance: CarInsurance) => {
    alert(`Insurance saved for policy: ${insurance.policyNumber}`);
    // TODO: Add backend integration here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center py-8">
      <div className="w-full max-w-3xl mx-auto bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-800">
        <h1 className="text-3xl font-bold mb-8 text-blue-500 text-left">Add New Insurance</h1>
        <CarInsuranceForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
