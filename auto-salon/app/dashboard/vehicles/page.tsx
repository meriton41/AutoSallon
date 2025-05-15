"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Vehicle {
  id: number;
  title: string;
  image: string;
  year: number;
  mileage: string;
  brand: string;
  brandLogo: string;
  isNew: boolean;
  engine: string;
  fuel: string;
  power: string;
  description: string;
  transmission: string;
  color: string;
  interiorColor: string;
  features: string;
  price: number;
}

const initialForm = {
  title: "",
  image: "",
  year: 2020,
  mileage: "",
  brand: "",
  brandLogo: "",
  isNew: false,
  engine: "",
  fuel: "",
  power: "",
  description: "",
  transmission: "",
  color: "",
  interiorColor: "",
  features: "",
  price: 0,
};

export default function DashboardVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://localhost:7234/api/Vehicles");
        setVehicles(response.data);
      } catch (err) {
        setError("Failed to fetch vehicles");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post("https://localhost:7234/api/Vehicles", form);
      setForm(initialForm);
      // Refresh list
      const response = await axios.get("https://localhost:7234/api/Vehicles");
      setVehicles(response.data);
    } catch (err) {
      setError("Failed to add vehicle");
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setForm({
      title: vehicle.title,
      image: vehicle.image,
      year: vehicle.year,
      mileage: vehicle.mileage,
      brand: vehicle.brand,
      brandLogo: vehicle.brandLogo,
      isNew: vehicle.isNew,
      engine: vehicle.engine,
      fuel: vehicle.fuel,
      power: vehicle.power,
      description: vehicle.description,
      transmission: vehicle.transmission,
      color: vehicle.color,
      interiorColor: vehicle.interiorColor,
      features: vehicle.features,
      price: vehicle.price,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingVehicle) return;
    setError(null);
    try {
      await axios.put(`https://localhost:7234/api/Vehicles/${editingVehicle.id}`, form);
      setIsEditModalOpen(false);
      setEditingVehicle(null);
      // Refresh list
      const response = await axios.get("https://localhost:7234/api/Vehicles");
      setVehicles(response.data);
    } catch (err) {
      setError("Failed to update vehicle");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await axios.delete(`https://localhost:7234/api/Vehicles/${id}`);
      // Refresh list
      const response = await axios.get("https://localhost:7234/api/Vehicles");
      setVehicles(response.data);
    } catch (err) {
      setError("Failed to delete vehicle");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Vehicle Management</h1>
        <form
          onSubmit={handleSubmit}
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700"
        >
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="w-full px-3 py-2 rounded-lg border" />
          <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full px-3 py-2 rounded-lg border" />
          <input name="year" type="number" value={form.year} onChange={handleChange} placeholder="Year" required className="w-full px-3 py-2 rounded-lg border" />
          <input name="mileage" value={form.mileage} onChange={handleChange} placeholder="Mileage" className="w-full px-3 py-2 rounded-lg border" />
          <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="w-full px-3 py-2 rounded-lg border" />
          <input name="brandLogo" value={form.brandLogo} onChange={handleChange} placeholder="Brand Logo URL" className="w-full px-3 py-2 rounded-lg border" />
          <label className="flex items-center gap-2">
            <input name="isNew" type="checkbox" checked={form.isNew} onChange={handleChange} /> New
          </label>
          <input name="engine" value={form.engine} onChange={handleChange} placeholder="Engine" className="w-full px-3 py-2 rounded-lg border" />
          <input name="fuel" value={form.fuel} onChange={handleChange} placeholder="Fuel" className="w-full px-3 py-2 rounded-lg border" />
          <input name="power" value={form.power} onChange={handleChange} placeholder="Power" className="w-full px-3 py-2 rounded-lg border" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full px-3 py-2 rounded-lg border" />
          <input name="transmission" value={form.transmission} onChange={handleChange} placeholder="Transmission" className="w-full px-3 py-2 rounded-lg border" />
          <input name="color" value={form.color} onChange={handleChange} placeholder="Color" className="w-full px-3 py-2 rounded-lg border" />
          <input name="interiorColor" value={form.interiorColor} onChange={handleChange} placeholder="Interior Color" className="w-full px-3 py-2 rounded-lg border" />
          <input name="features" value={form.features} onChange={handleChange} placeholder="Features" className="w-full px-3 py-2 rounded-lg border" />
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required className="w-full px-3 py-2 rounded-lg border" />
          <button type="submit" className="col-span-1 md:col-span-2 bg-black text-white rounded p-2 mt-2">
            Add Vehicle
          </button>
        </form>
        {error && <div className="text-red-500 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/50 dark:border-red-800">{error}</div>}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 w-full group">
                  <img
                    src={vehicle.image && vehicle.image !== "string" ? vehicle.image : "/placeholder.svg"}
                    alt={vehicle.title}
                    className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleEdit(vehicle)}
                      className="bg-white/90 hover:bg-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(vehicle.id)}
                      className="bg-white/90 hover:bg-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{vehicle.title}</h2>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Year:</span> {vehicle.year}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Brand:</span> {vehicle.brand}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Engine:</span> {vehicle.engine}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Power:</span> {vehicle.power}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Price:</span> €{vehicle.price}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edit Vehicle
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter vehicle title"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
                <input
                  name="year"
                  type="number"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="Enter year"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mileage</label>
                <input
                  name="mileage"
                  value={form.mileage}
                  onChange={handleChange}
                  placeholder="Enter mileage"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Enter brand"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Brand Logo URL</label>
                <input
                  name="brandLogo"
                  value={form.brandLogo}
                  onChange={handleChange}
                  placeholder="Enter brand logo URL"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Engine</label>
                <input
                  name="engine"
                  value={form.engine}
                  onChange={handleChange}
                  placeholder="Enter engine details"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fuel</label>
                <input
                  name="fuel"
                  value={form.fuel}
                  onChange={handleChange}
                  placeholder="Enter fuel type"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Power</label>
                <input
                  name="power"
                  value={form.power}
                  onChange={handleChange}
                  placeholder="Enter power"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter vehicle description"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Transmission</label>
                <input
                  name="transmission"
                  value={form.transmission}
                  onChange={handleChange}
                  placeholder="Enter transmission"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                <input
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  placeholder="Enter color"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Interior Color</label>
                <input
                  name="interiorColor"
                  value={form.interiorColor}
                  onChange={handleChange}
                  placeholder="Enter interior color"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Features</label>
                <textarea
                  name="features"
                  value={form.features}
                  onChange={handleChange}
                  placeholder="Enter vehicle features"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  name="isNew"
                  type="checkbox"
                  checked={form.isNew}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Vehicle</label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 