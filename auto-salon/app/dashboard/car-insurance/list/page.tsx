"use client";
import { useEffect, useState } from "react";
import { CarInsurance } from "../../../../types/insurance";
import { generateInsurancePdf } from "../../../../lib/generateInsurancePdf";
import { Car } from "../../../../types/car";

export default function InsuranceListPage() {
  const [insurances, setInsurances] = useState<CarInsurance[]>([]);
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const fetchInsurances = async () => {
      try {
        const res = await fetch("https://localhost:7234/api/CarInsurance");
        const data = await res.json();
        setInsurances(data);
      } catch (error) {
        setInsurances([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInsurances();
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch("https://localhost:7234/api/Car");
        const data = await res.json();
        setCars(data);
      } catch (error) {
        setCars([]);
      }
    };
    fetchCars();
  }, []);

  const handleDownloadPdf = (insurance: CarInsurance) => {
    const doc = generateInsurancePdf(insurance);
    doc.save(`Insurance-${insurance.policyNumber}.pdf`);
  };

  const assignedCarIds = new Set(insurances.map(i => i.carId));
  const availableCars = cars.filter(car => !assignedCarIds.has(car.id));

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">All Car Insurances</h1>
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 text-white rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2">Policy #</th>
                <th className="px-4 py-2">Client</th>
                <th className="px-4 py-2">Car ID</th>
                <th className="px-4 py-2">Start</th>
                <th className="px-4 py-2">End</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {insurances.map((insurance) => (
                <tr key={insurance.id} className="border-t border-gray-700">
                  <td className="px-4 py-2">{insurance.policyNumber}</td>
                  <td className="px-4 py-2">{insurance.clientName}</td>
                  <td className="px-4 py-2">{insurance.carId}</td>
                  <td className="px-4 py-2">{insurance.startDate?.slice(0, 10)}</td>
                  <td className="px-4 py-2">{insurance.endDate?.slice(0, 10)}</td>
                  <td className="px-4 py-2">€{insurance.price}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDownloadPdf(insurance)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
              {insurances.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-400">
                    No insurances found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
