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
    // Fetch all cars
    const fetchCars = async () => {
      try {
        const res = await fetch("https://localhost:7234/api/Vehicles");
        const data = await res.json();
        setCars(data);
      } catch {
        setCars([]);
      }
    };
    // Fetch all bills
    const fetchBills = async () => {
      try {
        const res = await fetch("https://localhost:7234/api/Bills");
        const data = await res.json();
        setBills(data);
      } catch {
        setBills([]);
      }
    };
    fetchCars();
    fetchBills();
  }, []);

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setEditForm({ ...bill });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this bill?")) {
      await fetch(`https://localhost:7234/api/Bills/${id}`, { method: "DELETE" });
      setBills(bills => bills.filter(b => b.id !== id)); // Remove from UI
    }
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBill) return;
    const updatedBill = { ...editingBill, ...editForm };
    const res = await fetch(`https://localhost:7234/api/Bills/${editingBill.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBill),
    });
    if (res.ok) {
      setBills(bills => bills.map(b => b.id === editingBill.id ? updatedBill : b));
      setShowModal(false);
      setEditingBill(null);
    } else {
      alert("Failed to update bill.");
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {bills.map((bill, idx) => (
                <tr
                  key={bill.id}
                  className={idx % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}
                >
                  <td className="px-4 py-3">{bill.clientName}</td>
                  <td className="px-4 py-3">{bill.carId}</td>
                  <td className="px-4 py-3">${bill.amount}</td>
                  <td className="px-4 py-3">{new Date(bill.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={async () => {
                        // Fetch car details
                        const res = await fetch(`https://localhost:7234/api/Vehicles/${bill.carId}`);
                        const car = await res.json();
                        const doc = generateBillPdf(bill, car);
                        doc.save(`Bill-${bill.id}.pdf`);
                      }}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={() => handleEdit(bill)}
                      className="bg-blue-600 text-white px-3 py-1 rounded ml-2 hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bill.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded ml-2 hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {bills.length === 0 && (
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Bill</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Client Name</label>
                <input
                  name="clientName"
                  value={editForm.clientName || ""}
                  onChange={handleEditFormChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Client Email</label>
                <input
                  name="clientEmail"
                  value={editForm.clientEmail || ""}
                  onChange={handleEditFormChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  name="amount"
                  type="number"
                  value={editForm.amount || 0}
                  onChange={handleEditFormChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={editForm.description || ""}
                  onChange={handleEditFormChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  name="date"
                  type="date"
                  value={editForm.date ? editForm.date.slice(0, 10) : ""}
                  onChange={handleEditFormChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Car</label>
                <select
                  name="carId"
                  value={editForm.carId || ""}
                  onChange={handleSelectChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select a car</option>
                  {cars
                    .filter(car => !bills.some(bill => bill.carId === car.id))
                    .map(car => (
                      <option key={car.id} value={car.id}>
                        {car.title ? `${car.title} (${car.id})` : car.id}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  onClick={() => { setShowModal(false); setEditingBill(null); }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
