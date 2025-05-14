"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams } from "next/navigation"
import { Heart } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import axios from "axios"
import { Button } from "@/components/ui/button"

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
  const [favorites, setFavorites] = useState<number[]>([])
  const searchParams = useSearchParams()
  const brandFilter = searchParams.get("brand")
  const { user } = useAuth()

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true)
      try {
        // Fetch vehicles
        const response = await axios.get("https://localhost:7234/api/Vehicles")
        setVehicles(response.data)

        // Fetch user's favorites if logged in
        const headers = user?.token
          ? { Authorization: `Bearer ${user.token}` }
          : {};

        const favoritesResponse = await axios.get("https://localhost:7234/api/FavoriteVehicles", {
          headers,
        })
        setFavorites(favoritesResponse.data.map((f: any) => f.vehicleId))
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [brandFilter, user?.token])

  const toggleFavorite = async (vehicleId: number) => {
    if (!user?.token || !user?.userId) {
      // Redirect to login or show login prompt
      return;
    }

    const headers = { Authorization: `Bearer ${user.token}` };
    const userId = user.userId;

    try {
      if (favorites.includes(vehicleId)) {
        await axios.delete(`https://localhost:7234/api/FavoriteVehicles/${vehicleId}?userId=${userId}`, { headers });
        setFavorites(favorites.filter(id => id !== vehicleId));
      } else {
        await axios.post(`https://localhost:7234/api/FavoriteVehicles/${vehicleId}?userId=${userId}`, {}, { headers });
        setFavorites([...favorites, vehicleId]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

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
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.preventDefault()
                  toggleFavorite(vehicle.id)
                }}
              >
                <Heart
                  className={`h-5 w-5 ${
                    favorites.includes(vehicle.id) ? "text-red-500 fill-red-500" : "text-gray-500"
                  }`}
                />
              </Button>
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

