"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams } from "next/navigation"

type Vehicle = {
  id: number
  title: string
  image: string
  year: number
  mileage: string
  brand: string
  brandLogo: string
  isNew: boolean
  engine: string
  fuel: string
  power: string
}

export default function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const brandFilter = searchParams.get("brand")

  useEffect(() => {
    // Simulate API call with a timeout
    const fetchVehicles = () => {
      setLoading(true)

      // This would be replaced with a real API call
      setTimeout(() => {
        const allVehicles = [
          {
            id: 1,
            title: "Rolls Royce Cullinan II",
            image: "/images/cars/rolls-royce-cullinan.jpg",
            year: 2025,
            mileage: "0 km",
            brand: "rolls-royce",
            brandLogo: "/images/brands/rolls-royce.png",
            isNew: true,
            engine: "6.7",
            fuel: "Petrol",
            power: "571 PS",
          },
          {
            id: 2,
            title: "Ferrari Purosangue",
            image: "/images/cars/ferrari-purosangue.jpg",
            year: 2024,
            mileage: "1000 km",
            brand: "ferrari",
            brandLogo: "/images/brands/ferrari.png",
            isNew: false,
            engine: "6.5",
            fuel: "Petrol",
            power: "725 PS",
          },
          {
            id: 3,
            title: "Mercedes-Benz SL 63 AMG",
            image: "/images/cars/mercedes-sl.jpg",
            year: 2023,
            mileage: "2500 km",
            brand: "mercedes",
            brandLogo: "/images/brands/mercedes.png",
            isNew: false,
            engine: "4.0",
            fuel: "Petrol",
            power: "585 PS",
          },
          {
            id: 4,
            title: "Lamborghini Urus",
            image: "/images/cars/lamborghini-urus.jpg",
            year: 2023,
            mileage: "3500 km",
            brand: "lamborghini",
            brandLogo: "/images/brands/lamborghini.png",
            isNew: false,
            engine: "4.0",
            fuel: "Petrol",
            power: "650 PS",
          },
          {
            id: 5,
            title: "Porsche 911 GT3",
            image: "/images/cars/porsche-911.jpg",
            year: 2024,
            mileage: "500 km",
            brand: "porsche",
            brandLogo: "/images/brands/porsche.png",
            isNew: true,
            engine: "4.0",
            fuel: "Petrol",
            power: "510 PS",
          },
          {
            id: 6,
            title: "Bentley Continental GT",
            image: "/images/cars/bentley-continental.jpg",
            year: 2024,
            mileage: "100 km",
            brand: "bentley",
            brandLogo: "/images/brands/bentley.png",
            isNew: true,
            engine: "6.0",
            fuel: "Petrol",
            power: "659 PS",
          },
        ]

        // Filter by brand if a brand filter is applied
        const filteredVehicles = brandFilter
          ? allVehicles.filter((vehicle) => vehicle.brand === brandFilter)
          : allVehicles

        setVehicles(filteredVehicles)
        setLoading(false)
      }, 1000)
    }

    fetchVehicles()
  }, [brandFilter])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-64 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-4">No vehicles found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {vehicles.map((vehicle) => (
        <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
          <Card className="car-card h-full">
            <div className="relative h-64 w-full">
              <Image
                src={vehicle.image || "/placeholder.svg"}
                alt={vehicle.title}
                fill
                className="object-cover transition-transform duration-300"
              />
              {vehicle.isNew && <Badge className="absolute top-2 left-2 z-10">New</Badge>}
            </div>
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Image
                  src={vehicle.brandLogo || "/placeholder.svg"}
                  alt={vehicle.brand}
                  width={40}
                  height={30}
                  className="mr-2"
                />
                <h3 className="text-xl font-bold">{vehicle.title}</h3>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="car-specs-icon">
                  <span className="text-xs text-muted-foreground">Year</span>
                  <span className="font-medium">{vehicle.year}</span>
                </div>
                <div className="car-specs-icon">
                  <span className="text-xs text-muted-foreground">Engine</span>
                  <span className="font-medium">{vehicle.engine}</span>
                </div>
                <div className="car-specs-icon">
                  <span className="text-xs text-muted-foreground">Power</span>
                  <span className="font-medium">{vehicle.power}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

