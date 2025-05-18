"use client"

import type { Metadata } from "next"
import { useState, useEffect } from "react"
import VehicleList from "@/components/vehicle-list"
import VehicleFilters from "@/components/vehicle-filters"
import { useDebounce } from "@/hooks/use-debounce"

type Filters = {
  searchTerm: string
  brand: string
  minYear: number | ""
  maxYear: number | ""
  minPrice: number | ""
  maxPrice: number | ""
  fuel: string
  transmission: string
  color: string
  isNew: boolean | ""
}

const initialFilters: Filters = {
  searchTerm: "",
  brand: "",
  minYear: "",
  maxYear: "",
  minPrice: "",
  maxPrice: "",
  fuel: "",
  transmission: "",
  color: "",
  isNew: ""
}

export default function VehiclesPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300)

  const handleFilterChange = (key: keyof Filters, value: string | number | boolean | "") => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
  }

  // We'll fetch vehicles inside VehicleList now, passing the filters

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Our Vehicles</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          {/* Pass filters and handler to VehicleFilters */}
          <VehicleFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
          />
        </div>
        <div className="lg:col-span-3">
          {/* Pass debouncedSearchTerm and other filters to VehicleList */}
          <VehicleList
            filters={{ ...filters, searchTerm: debouncedSearchTerm }}
          />
        </div>
      </div>
    </div>
  )
}

