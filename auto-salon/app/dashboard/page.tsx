"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, Car, ShoppingCart, Settings } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalUsers: number;
  totalVehicles: number;
  totalOrders: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVehicles: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    // TODO: Fetch actual stats from the backend
    // For now, using dummy data
    setStats({
      totalUsers: 150,
      totalVehicles: 45,
      totalOrders: 89,
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Car className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Vehicles</p>
              <p className="text-2xl font-bold">{stats.totalVehicles}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gray-100 rounded-full">
                <Users className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium">New user registration</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gray-100 rounded-full">
                <Car className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium">New vehicle added</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gray-100 rounded-full">
                <ShoppingCart className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium">New order placed</p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link href="/dashboard/users" className="w-full flex items-center space-x-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Users className="w-5 h-5 text-gray-600" />
              <span>Manage Users</span>
            </Link>
            <Link href="/dashboard/vehicles" className="w-full flex items-center space-x-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Car className="w-5 h-5 text-gray-600" />
              <span>Manage Vehicles</span>
            </Link>
            <Link href="/dashboard/settings" className="w-full flex items-center space-x-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
              <span>System Settings</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
} 