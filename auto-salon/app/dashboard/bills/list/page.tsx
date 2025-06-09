"use client";
import { Bill } from "@/types/bill";
import React, { useEffect, useState } from "react";
import { generateBillPdf } from "@/lib/generateBillPdf";    

export default function BillListPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Bill>>({});
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch("https://localhost:7234/api/Bill");
        if (response.ok) {
          const data = await response.json();
          console.log("Raw API response:", JSON.stringify(data, null, 2));
          // Convert Guid to string for each bill
          const billsWithStringIds = data.map((bill: any) => {
            console.log("Processing bill:", JSON.stringify(bill, null, 2));
            // Handle both id and Id cases, and ensure we have a valid ID
            const id = bill.id || bill.Id;
            if (!id) {
              console.error("Bill missing ID property:", JSON.stringify(bill, null, 2));
              return null;
            }
            return {
              ...bill,
              id: id.toString() // Convert Guid to string
            };
          }).filter((bill: Bill | null): bill is Bill => bill !== null); // Remove any bills that failed to process
          console.log("Processed bills:", JSON.stringify(billsWithStringIds, null, 2));
          setBills(billsWithStringIds);
        } else {
          console.error("Failed to fetch bills:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching bills:", error);
      }
    };

    const fetchCars = async () => {
      try {
        const response = await fetch("https://localhost:7234/api/Vehicles");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched cars:", data);
          setCars(data);
        } else {
          console.error("Failed to fetch cars:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchBills();
    fetchCars();
  }, []);

  const handleEdit = (bill: Bill) => {
    console.log("Raw bill data:", JSON.stringify(bill, null, 2));
    console.log("Bill ID type:", typeof bill.id);
    console.log("Bill ID value:", bill.id);
    console.log("Bill ID exists:", !!bill.id);
    
    if (!bill.id) {
      console.error("Bill missing ID. Full bill data:", JSON.stringify(bill, null, 2));
      alert("Cannot edit bill: Missing bill ID");
      return;
    }
    
    setEditingBill(bill);
    setEditForm({
      id: bill.id,
      clientName: bill.clientName,
      clientEmail: bill.clientEmail,
      vehicleId: bill.vehicleId,
      amount: bill.amount,
      description: bill.description,
      date: bill.date
    });
    
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this bill?")) {
      try {
        const response = await fetch(`https://localhost:7234/api/Bill/${id}`, { 
          method: "DELETE" 
        });
        
        if (response.ok) {
          // Only remove the specific bill from the state
          setBills(prevBills => prevBills.filter(bill => bill.id !== id));
        } else {
          alert("Failed to delete bill.");
        }
      } catch (error) {
        console.error("Error deleting bill:", error);
        alert("Failed to delete bill.");
      }
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBill || !editingBill.id) {
      console.error("No bill being edited or missing ID. Editing bill:", JSON.stringify(editingBill, null, 2));
      return;
    }

    try {
      console.log("Submitting edit for bill:", JSON.stringify(editingBill, null, 2));
      
      const requestBody = {
        id: editingBill.id,
        clientName: editForm.clientName || editingBill.clientName,
        clientEmail: editForm.clientEmail || editingBill.clientEmail,
        vehicleId: Number(editForm.vehicleId || editingBill.vehicleId),
        amount: Number(editForm.amount || editingBill.amount),
        description: editForm.description || editingBill.description,
        date: editForm.date || editingBill.date
      };

      console.log("Request body:", JSON.stringify(requestBody, null, 2));
      console.log("Request URL:", `https://localhost:7234/api/Bill/${editingBill.id}`);

      const response = await fetch(`https://localhost:7234/api/Bill/${editingBill.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        setBills(prevBills => 
          prevBills.map(bill => 
            bill.id === editingBill.id ? { ...bill, ...requestBody } : bill
          )
        );
        setShowModal(false);
        setEditingBill(null);
        setEditForm({});
      } else {
        const errorData = await response.text();
        console.error("Failed to update bill:", errorData);
        alert(`Failed to update bill: ${errorData}`);
      }
    } catch (error) {
      console.error("Error updating bill:", error);
      alert("Failed to update bill. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-black p-8 rounded-lg shadow-md border border-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">All Bills</h1>
      <div className="overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-700 bg-gray-900 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Car</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {bills.length > 0 ? (
                bills.map((bill) => (
                  <tr
                    key={bill.id}
                    className="bg-gray-800 hover:bg-gray-700"
                  >
                    <td className="px-4 py-3">{bill.clientName}</td>
                    <td className="px-4 py-3">{bill.vehicleId}</td>
                    <td className="px-4 py-3">${bill.amount}</td>
                    <td className="px-4 py-3">{new Date(bill.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={async () => {
                            // Fetch car details
                            const res = await fetch(`https://localhost:7234/api/Vehicles/${bill.vehicleId}`);
                            const car = await res.json();
                            const doc = generateBillPdf(bill, car);
                            doc.save(`Bill-${bill.id}.pdf`);
                          }}
                          className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg flex items-center justify-center transition"
                          title="Download"
                        >
                          {/* Download Icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(bill)}
                          className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg flex items-center justify-center transition"
                          title="Edit"
                        >
                          {/* Pencil Icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2H7v-2l6-6z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(bill.id)}
                          className="bg-red-600 hover:bg-red-700 p-3 rounded-lg flex items-center justify-center transition"
                          title="Delete"
                        >
                          {/* Trash Icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-6">
                    No bills found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit Modal */}
      {showModal && editingBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-white">Edit Bill</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-300 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={editForm.clientName}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-300 mb-1">
                  Client Email
                </label>
                <input
                  type="email"
                  id="clientEmail"
                  name="clientEmail"
                  value={editForm.clientEmail}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-300 mb-1">
                  Vehicle
                </label>
                <select
                  id="vehicleId"
                  name="vehicleId"
                  value={editForm.vehicleId}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option key="default" value="">Select a vehicle</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.brand} {car.model} ({car.year})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={editForm.amount}
                  onChange={handleEditChange}
                  step="0.01"
                  min="0.01"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={editForm.date}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingBill(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
