"use client";
import React, { useState } from "react";
import { CarInsurance } from "../types/insurance";
import { sendInsuranceEmail } from "../lib/generateInsurancePdf";
import emailjs from "emailjs-com";

interface Props {
  onSubmit: (insurance: CarInsurance) => void;
}

const initialState: CarInsurance = {
  id: "",
  policyNumber: "",
  carId: "",
  clientName: "",
  clientEmail: "",
  startDate: "",
  endDate: "",
  coverageDetails: "",
  price: 0,
};

export default function CarInsuranceForm({ onSubmit }: Props) {
  const [form, setForm] = useState<CarInsurance>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const sendEmail = async () => {
    try {
      await emailjs.send(
        "service_z54rxk4",
        "template_crhjari",
        {
          client_name: form.clientName,
          client_email: form.clientEmail,
          policy_number: form.policyNumber,
          car_id: form.carId,
          start_date: form.startDate,
          end_date: form.endDate,
          coverage_details: form.coverageDetails,
          price: form.price,
          // Add more fields as needed
        },
        "TwUwWzu0RatBeHGx1"
      );
      alert("Email sent successfully!");
    } catch (error) {
      alert("Failed to send email.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-white">Policy Number</label>
        <input name="policyNumber" value={form.policyNumber} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-900 text-white" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-white">Car ID</label>
        <input name="carId" value={form.carId} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-900 text-white" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-white">Client Name</label>
        <input name="clientName" value={form.clientName} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-900 text-white" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-white">Client Email</label>
        <input name="clientEmail" value={form.clientEmail} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-900 text-white" required />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 text-white">Start Date</label>
          <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-900 text-white" required />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 text-white">End Date</label>
          <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-900 text-white" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-white">Coverage Details</label>
        <textarea name="coverageDetails" value={form.coverageDetails} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-900 text-white" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-white">Price</label>
        <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-900 text-white" required />
      </div>
      <div className="flex gap-4">
        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Save Insurance</button>
        <button
          type="button"
          onClick={sendEmail}
          className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Send Insurance to Client
        </button>
      </div>
    </form>
  );
}
