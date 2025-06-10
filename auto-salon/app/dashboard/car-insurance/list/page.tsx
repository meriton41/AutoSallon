"use client";
import { useEffect, useState } from "react";
import { CarInsurance } from "../../../../types/insurance";
import { generateInsurancePdf } from "../../../../lib/generateInsurancePdf";
import { Car } from "../../../../types/car";
import { toast, ToastContainer } from "react-toastify";
import { Edit3, Trash2, Download } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export default function InsuranceListPage() {
  const [insurances, setInsurances] = useState<CarInsurance[]>([]);
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<Car[]>([]);
  const [editingInsurance, setEditingInsurance] = useState<CarInsurance | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchInsurances = async () => {
    try {
      const res = await fetch("https://localhost:7234/api/CarInsurance");
      const data = await res.json();
      setInsurances(data);
    } catch (error) {
      console.error("Error fetching insurances:", error);
      setInsurances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsurances();
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch("https://localhost:7234/api/Vehicles");
        const data = await res.json();
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setCars([]);
      }
    };
    fetchCars();
  }, []);

  const handleDownloadPdf = async (insurance: CarInsurance) => {
    try {
      // Fetch the car details
      const carResponse = await fetch(`https://localhost:7234/api/Vehicles/${insurance.vehicleId || insurance.carId}`);
      if (!carResponse.ok) {
        throw new Error('Failed to fetch car details');
      }
      const carData = await carResponse.json();
      
      // Create a new insurance object with the car details
      const insuranceWithCar = {
        ...insurance,
        Vehicle: carData
      };
      
      const doc = generateInsurancePdf(insuranceWithCar);
      doc.save(`Insurance-${insurance.policyNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const handleEdit = (insurance: CarInsurance) => {
    // Find the car ID - insurance might have either vehicleId or carId
    const carId = insurance.vehicleId?.toString() || insurance.carId || "";
    
    setEditingInsurance({
      ...insurance,
      startDate: insurance.startDate?.slice(0, 10) || "",
      endDate: insurance.endDate?.slice(0, 10) || "",
      carId: carId
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInsurance) return;

    try {
      const updateData = {
        PolicyNumber: editingInsurance.policyNumber,
        VehicleId: parseInt(editingInsurance.carId),
        ClientName: editingInsurance.clientName,
        ClientEmail: editingInsurance.clientEmail,
        StartDate: new Date(editingInsurance.startDate).toISOString(),
        EndDate: new Date(editingInsurance.endDate).toISOString(),
        CoverageDetails: editingInsurance.coverageDetails,
        Price: Number(editingInsurance.price)
      };

      console.log("Sending update data:", updateData);

      const response = await fetch(`https://localhost:7234/api/CarInsurance/${editingInsurance.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast.success("Insurance updated successfully!");
        setIsEditModalOpen(false);
        setEditingInsurance(null);
        fetchInsurances(); // Refresh the list
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Failed to update insurance");
      }
    } catch (error) {
      console.error("Error updating insurance:", error);
      toast.error("Failed to update insurance");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`https://localhost:7234/api/CarInsurance/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Insurance deleted successfully!");
        fetchInsurances(); // Refresh the list
      } else {
        toast.error("Failed to delete insurance");
      }
    } catch (error) {
      console.error("Error deleting insurance:", error);
      toast.error("Failed to delete insurance");
    }
    setDeleteConfirm(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingInsurance(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Get assigned car IDs (excluding the one being edited)
  const assignedCarIds = new Set(
    insurances
      .filter(i => !editingInsurance || i.id !== editingInsurance.id)
      .map(i => (i.vehicleId || parseInt(i.carId || "0")))
  );
  
  // Always include the currently assigned car when editing
  const availableCars = cars.filter(car => {
    const carIdNum = parseInt(car.id);
    const isAssigned = assignedCarIds.has(carIdNum);
    const isCurrentlyEditingCar = editingInsurance && car.id === editingInsurance.carId;
    
    // Include if not assigned, or if it's the car currently being edited
    return !isAssigned || isCurrentlyEditingCar;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
      <div className="w-full max-w-5xl mx-auto bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-800">
        <h1 className="text-3xl font-bold mb-8 text-blue-500 text-left">View Insurances</h1>
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="min-w-full bg-gray-900 rounded-2xl shadow divide-y divide-gray-800">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-200 uppercase tracking-wider">Policy #</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-200 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-200 uppercase tracking-wider">Car ID</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-200 uppercase tracking-wider">Start</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-200 uppercase tracking-wider">End</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-200 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-200 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {insurances.length > 0 ? (
                    insurances.map((insurance) => (
                      <tr key={insurance.id} className="hover:bg-gray-800/70 transition rounded-xl">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-100">{insurance.policyNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-100">{insurance.clientName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-100">{insurance.vehicleId || insurance.carId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-100">{insurance.startDate?.slice(0, 10)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-100">{insurance.endDate?.slice(0, 10)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-100">€{insurance.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDownloadPdf(insurance)}
                              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded transition-colors"
                              title="Download PDF"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(insurance)}
                              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded transition-colors"
                              title="Edit Insurance"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(insurance.id)}
                              className="bg-red-600 hover:bg-red-500 text-white p-2 rounded transition-colors"
                              title="Delete Insurance"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-400 bg-gray-800/60 rounded-xl">
                        No insurances found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editingInsurance && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-white">Edit Insurance</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">Policy Number</label>
                  <input
                    name="policyNumber"
                    value={editingInsurance.policyNumber}
                    onChange={handleEditInputChange}
                    className="w-full border rounded px-3 py-2 bg-gray-800 text-white border-gray-700"
                    required
                  />
                </div>
                
                             <div>
                   <label className="block text-sm font-medium mb-1 text-white">Car</label>
                   <select
                     name="carId"
                     value={editingInsurance.carId}
                     onChange={handleEditInputChange}
                     className="w-full border rounded px-3 py-2 bg-gray-800 text-white border-gray-700"
                     required
                   >
                     <option value="">Select a car</option>
                     {cars.map(car => {
                       const carIdNum = parseInt(car.id);
                       const isAssigned = assignedCarIds.has(carIdNum);
                       const isCurrentCar = car.id === editingInsurance.carId;
                       
                       return (
                         <option key={car.id} value={car.id}>
                           {car.title ? `${car.title} (${car.id})` : `Car ID: ${car.id}`}
                           {isAssigned && !isCurrentCar ? " (Already assigned)" : ""}
                           {isCurrentCar ? " (Current)" : ""}
                         </option>
                       );
                     })}
                   </select>
                 </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-white">Client Name</label>
                  <input
                    name="clientName"
                    value={editingInsurance.clientName}
                    onChange={handleEditInputChange}
                    className="w-full border rounded px-3 py-2 bg-gray-800 text-white border-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-white">Client Email</label>
                  <input
                    name="clientEmail"
                    type="email"
                    value={editingInsurance.clientEmail}
                    onChange={handleEditInputChange}
                    className="w-full border rounded px-3 py-2 bg-gray-800 text-white border-gray-700"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-white">Start Date</label>
                    <input
                      name="startDate"
                      type="date"
                      value={editingInsurance.startDate}
                      onChange={handleEditInputChange}
                      className="w-full border rounded px-3 py-2 bg-gray-800 text-white border-gray-700"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-white">End Date</label>
                    <input
                      name="endDate"
                      type="date"
                      value={editingInsurance.endDate}
                      onChange={handleEditInputChange}
                      className="w-full border rounded px-3 py-2 bg-gray-800 text-white border-gray-700"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-white">Coverage Details</label>
                  <textarea
                    name="coverageDetails"
                    value={editingInsurance.coverageDetails}
                    onChange={handleEditInputChange}
                    className="w-full border rounded px-3 py-2 bg-gray-800 text-white border-gray-700"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-white">Price</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingInsurance.price}
                    onChange={handleEditInputChange}
                    className="w-full border rounded px-3 py-2 bg-gray-800 text-white border-gray-700"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                  >
                    Update Insurance
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingInsurance(null);
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-white">Confirm Delete</h2>
              <p className="text-white mb-6">Are you sure you want to delete this insurance policy?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer theme="dark" />
      </div>
    </div>
  );
}
