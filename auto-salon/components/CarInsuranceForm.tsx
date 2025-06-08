"use client";
import React, { useState, useEffect } from "react";
import { CarInsurance } from "../types/insurance";
import { Car } from "../types/car";
import { sendInsuranceEmail } from "../lib/generateInsurancePdf";
import emailjs from "emailjs-com";
import { toast, ToastContainer } from "react-toastify";

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
  const [assignedCarIds, setAssignedCarIds] = useState<string[]>([]);
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    // Fetch all insurances to get assigned car IDs
    const fetchInsurances = async () => {
      try {
        const res = await fetch("https://localhost:7234/api/CarInsurance");
        const data = await res.json();
        setAssignedCarIds(data.map((insurance: CarInsurance) => insurance.carId));
      } catch (error) {
        setAssignedCarIds([]);
      }
    };
    fetchInsurances();
  }, []);

  useEffect(() => {
    // Fetch all cars
    const fetchCars = async () => {
      try {
        const res = await fetch("https://localhost:7234/api/Vehicles");
        const data = await res.json();
        setCars(data);
      } catch (error) {
        setCars([]);
      }
    };
    fetchCars();
  }, []);

  const availableCars = cars.filter(car => !assignedCarIds.includes(car.id));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAndSend = async (e: React.FormEvent) => {
    e.preventDefault();
    // Save to backend
    const { id, price, startDate, endDate, ...rest } = form;
    const insuranceData = {
      ...rest,
      price: Number(price),
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
    };

    try {
      const response = await fetch("https://localhost:7234/api/CarInsurance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(insuranceData),
      });
      if (response.ok) {
        // Send email
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
          },
          "TwUwWzu0RatBeHGx1"
        );
        toast.success("Insurance saved and email sent successfully!");
        setForm(initialState);
      } else {
        toast.error("Failed to save insurance.");
      }
    } catch (error) {
      toast.error("Failed to save or send email.");
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSaveAndSend} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Policy Number</label>
          <input name="policyNumber" value={form.policyNumber} onChange={handleChange} className="w-full border rounded px-3 py-2 bg-gray-900 text-white" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Car</label>
          <select
            name="carId"
            value={form.carId}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-gray-900 text-white"
            required
          >
            <option value="">Select a car</option>
            {availableCars.map(car => (
              <option key={car.id} value={car.id}>
                {car.title ? `${car.title} (${car.id})` : car.id}
              </option>
            ))}
          </select>
          {assignedCarIds.length > 0 && (
            <div className="text-xs text-gray-400 mt-1">
              <span>Already assigned Car IDs: {assignedCarIds.join(", ")}</span>
            </div>
          )}
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
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Save & Send Insurance to Client
          </button>
        </div>
      </form>
      <ToastContainer />
    </>
  );
}
