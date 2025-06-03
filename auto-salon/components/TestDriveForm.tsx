"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Car } from "lucide-react";
import { cn } from "@/lib/utils";

interface Vehicle {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  engine: string;
  fuel: string;
  transmission: string;
}

interface TestDriveFormData {
  vehicleId: number;
  description: string;
  date: Date;
  status: string;
}

interface TestDriveFormProps {
  vehicleId: number;
  onSuccess?: () => void;
}

export default function TestDriveForm({ vehicleId, onSuccess }: TestDriveFormProps) {
  const { token, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [formData, setFormData] = useState<TestDriveFormData>({
    vehicleId: vehicleId || 0,
    description: '',
    date: new Date(),
    status: 'Pending'
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Fetch available vehicles
    const fetchVehicles = async () => {
      try {
        const response = await fetch('https://localhost:7234/api/Vehicles', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setVehicles(data);
        }
      } catch (err) {
        setError('Failed to fetch vehicles');
      }
    };

    fetchVehicles();
  }, [isAuthenticated, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://localhost:7234/api/TestDrive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vehicleId: formData.vehicleId,
          description: formData.description,
          date: formData.date.toISOString(),
          status: formData.status
        })
      });

      if (response.ok) {
        setSuccess('Test drive scheduled successfully!');
        setFormData({
          vehicleId: vehicleId || 0,
          description: '',
          date: new Date(),
          status: 'Pending'
        });
        if (onSuccess) {
          onSuccess();
        }
        router.push('/dashboard/test-drive-management');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to schedule test drive');
      }
    } catch (err) {
      setError('An error occurred while scheduling the test drive');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Schedule a Test Drive</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="vehicleId">Select Vehicle</Label>
            <Select
              value={formData.vehicleId.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: parseInt(value) }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-semibold">{vehicle.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {vehicle.year} • {vehicle.engine} • {vehicle.transmission}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Preferred Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional Notes</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Any specific requirements or questions?"
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Car className="mr-2 h-4 w-4" />
            {isSubmitting ? "Scheduling..." : "Schedule Test Drive"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 