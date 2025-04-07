import type { Metadata } from "next"
import VehicleList from "@/components/vehicle-list"
import VehicleFilters from "@/components/vehicle-filters"

export const metadata: Metadata = {
  title: "Vehicles | Auto Sherreti",
  description: "Browse our collection of luxury vehicles",
}

export default function VehiclesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Our Vehicles</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <VehicleFilters />
        </div>
        <div className="lg:col-span-3">
          <VehicleList />
        </div>
      </div>
    </div>
  )
}

