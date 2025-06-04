"use client";
import BillForm from "../../../components/BillForm";

export default function BillsPage() {
  return (
    <div className="max-w-xl mx-auto bg-black p-8 rounded-lg shadow-md border border-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-white text-center">Create Bill</h1>
      <BillForm />
    </div>
  );
}
