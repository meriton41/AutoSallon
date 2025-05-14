"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import axios from "axios"

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

export default function FavoriteVehiclesList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchFavoriteVehicles = async () => {
      try {
        const headers = user?.token
          ? { Authorization: `Bearer ${user.token}` }
          : {};
        const userId = user?.userId;
        const url = userId
          ? `https://localhost:7234/api/FavoriteVehicles?userId=${userId}`
          : "https://localhost:7234/api/FavoriteVehicles";
        const response = await axios.get(url, { headers });
        setVehicles(response.data)
      } catch (error) {
        console.error("Error fetching favorite vehicles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavoriteVehicles()
  }, [user?.token, user?.userId])

  const removeFromFavorites = async (vehicleId: number) => {
    if (!user?.token || !user?.userId) {
      // Redirect to login or show login prompt
      return;
    }
    const headers = { Authorization: `Bearer ${user.token}` };
    const userId = user.userId;
    try {
      await axios.delete(`https://localhost:7234/api/FavoriteVehicles/${vehicleId}?userId=${userId}`, { headers });
      setVehicles(vehicles.filter(v => v.id !== vehicleId));
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // Favorite nuk ekziston më, thjesht hiqe nga UI
        setVehicles(vehicles.filter(v => v.id !== vehicleId));
      } else {
        console.error("Error removing from favorites:", error);
      }
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-4">No favorite vehicles yet</h3>
        <p className="text-muted-foreground mb-6">
          Start adding vehicles to your favorites to see them here.
        </p>
        <Link href="/vehicles">
          <Button>Browse Vehicles</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="car-card h-full">
          <div className="relative h-64 w-full">
            <Image
              src={vehicle.image && vehicle.image !== "string" ? vehicle.image : "/placeholder.svg"}
              alt={vehicle.title}
              fill
              className="object-cover transition-transform duration-300"
            />
            {vehicle.isNew && <Badge className="absolute top-2 left-2 z-10">New</Badge>}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
              onClick={() => removeFromFavorites(vehicle.id)}
            >
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            </Button>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <Image
                src={vehicle.brandLogo && vehicle.brandLogo !== "string" ? vehicle.brandLogo : "/placeholder.svg"}
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
      ))}
    </div>
  )
} 