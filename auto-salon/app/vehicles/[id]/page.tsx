import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Fuel, Gauge, Tag, Zap } from "lucide-react"
import VehicleGallery from "@/components/vehicle-gallery"
import RelatedVehicles from "@/components/related-vehicles"

type VehiclePageProps = {
  params: {
    id: string
  }
}

export default function VehiclePage({ params }: VehiclePageProps) {
  // In a real app, this would fetch from an API
  const vehicles = [
    {
      id: "1",
      title: "Rolls Royce Cullinan II",
      description:
        "The Rolls-Royce Cullinan is a full-sized luxury sport utility vehicle produced by Rolls-Royce Motor Cars. The Cullinan is the first SUV to be launched by the Rolls-Royce marque, and is also the brand's first all-wheel drive vehicle.",
      images: [
        "/images/cars/rolls-royce-cullinan.jpg",
        "/images/cars/rolls-royce-cullinan-interior.jpg",
        "/images/cars/rolls-royce-cullinan-rear.jpg",
      ],
      year: 2025,
      mileage: "0 km",
      brand: "Rolls Royce",
      brandLogo: "/images/brands/rolls-royce.png",
      isNew: true,
      engine: "6.7",
      fuel: "Petrol",
      power: "571 PS",
      transmission: "Automatic",
      color: "Silver",
      interiorColor: "Black",
      features: [
        "Panoramic Roof",
        "Massage Seats",
        "Night Vision",
        "Starlight Headliner",
        "Rear Entertainment",
        "Bespoke Audio System",
      ],
    },
  ]

  const vehicle = vehicles.find((v) => v.id === params.id)

  if (!vehicle) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Gallery */}
        <div className="lg:col-span-2">
          <VehicleGallery images={vehicle.images} />
        </div>

        {/* Right Column - Details */}
        <div>
          <div className="sticky top-20">
            <div className="flex items-center mb-4">
              <Image
                src={vehicle.brandLogo || "/placeholder.svg"}
                alt={vehicle.brand}
                width={60}
                height={40}
                className="mr-3"
              />
              <div>
                <h1 className="text-2xl font-bold">{vehicle.title}</h1>
                {vehicle.isNew && <Badge className="mt-1">New</Badge>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{vehicle.year}</span>
              </div>
              <div className="flex items-center">
                <Gauge className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{vehicle.mileage}</span>
              </div>
              <div className="flex items-center">
                <Fuel className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{vehicle.fuel}</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{vehicle.power}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <Button className="w-full">Contact Us</Button>
              <Button variant="outline" className="w-full">
                Schedule Test Drive
              </Button>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Quick Specs</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Transmission:</span>
                  <span>{vehicle.transmission}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Engine:</span>
                  <span>{vehicle.engine}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Exterior Color:</span>
                  <span>{vehicle.color}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Interior Color:</span>
                  <span>{vehicle.interiorColor}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="p-4 border rounded-b-lg">
            <p>{vehicle.description}</p>
          </TabsContent>
          <TabsContent value="features" className="p-4 border rounded-b-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {vehicle.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="p-4 border rounded-b-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Engine & Performance</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Engine:</span>
                    <span>{vehicle.engine}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Power:</span>
                    <span>{vehicle.power}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Type:</span>
                    <span>{vehicle.fuel}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Transmission:</span>
                    <span>{vehicle.transmission}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Dimensions & Weight</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Length:</span>
                    <span>5341 mm</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Width:</span>
                    <span>2164 mm</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Height:</span>
                    <span>1835 mm</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Weight:</span>
                    <span>2660 kg</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Vehicles */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Vehicles</h2>
        <RelatedVehicles currentVehicleId={params.id} />
      </div>
    </div>
  )
}

