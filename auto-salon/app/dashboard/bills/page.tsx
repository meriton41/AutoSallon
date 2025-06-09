"use client";
import BillForm from "../../../components/BillForm";

export default function BillsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center py-8">
      <div className="w-full max-w-3xl mx-auto bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-800">
        <h1 className="text-3xl font-bold mb-8 text-blue-500 text-left">Add New Bill</h1>
        <BillForm />
      </div>
    </div>
  );
}
