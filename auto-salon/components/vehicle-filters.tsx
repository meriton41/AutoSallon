"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function VehicleFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState([0, 500000])
  const [yearRange, setYearRange] = useState([2010, 2025])

  const brands = [
    { id: "lamborghini", label: "Lamborghini" },
    { id: "ferrari", label: "Ferrari" },
    { id: "rolls-royce", label: "Rolls Royce" },
    { id: "bmw", label: "BMW" },
    { id: "mercedes", label: "Mercedes-Benz" },
    { id: "bentley", label: "Bentley" },
    { id: "audi", label: "Audi" },
    { id: "porsche", label: "Porsche" },
    { id: "volkswagen", label: "Volkswagen" },
  ]

  const fuelTypes = [
    { id: "petrol", label: "Petrol" },
    { id: "diesel", label: "Diesel" },
    { id: "electric", label: "Electric" },
    { id: "hybrid", label: "Hybrid" },
  ]

  const handleFilter = () => {
    // This would be implemented to apply all filters
    // For now, we'll just demonstrate the brand filter
    const brandFilter = document.querySelector('input[name="brand"]:checked') as HTMLInputElement

    if (brandFilter) {
      router.push(`/vehicles?brand=${brandFilter.value}`)
    } else {
      router.push("/vehicles")
    }
  }

  const clearFilters = () => {
    router.push("/vehicles")
  }

  return (
    <div className="bg-card p-6 rounded-lg border">
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      <div className="space-y-6">
        <Accordion type="single" collapsible defaultValue="brands">
          <AccordionItem value="brands">
            <AccordionTrigger>Brands</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand.id}
                      name="brand"
                      value={brand.id}
                      checked={searchParams.get("brand") === brand.id}
                    />
                    <Label htmlFor={brand.id}>{brand.label}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="year">
            <AccordionTrigger>Year</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>{yearRange[0]}</span>
                  <span>{yearRange[1]}</span>
                </div>
                <Slider
                  defaultValue={yearRange}
                  min={2000}
                  max={2025}
                  step={1}
                  onValueChange={(value) => setYearRange(value as number[])}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>€{priceRange[0].toLocaleString()}</span>
                  <span>€{priceRange[1].toLocaleString()}</span>
                </div>
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={1000000}
                  step={10000}
                  onValueChange={(value) => setPriceRange(value as number[])}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="fuel">
            <AccordionTrigger>Fuel Type</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {fuelTypes.map((fuel) => (
                  <div key={fuel.id} className="flex items-center space-x-2">
                    <Checkbox id={fuel.id} name="fuel" value={fuel.id} />
                    <Label htmlFor={fuel.id}>{fuel.label}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="transmission">
            <AccordionTrigger>Transmission</AccordionTrigger>
            <AccordionContent>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="semi-automatic">Semi-Automatic</SelectItem>
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col gap-2 pt-4">
          <Button onClick={handleFilter}>Apply Filters</Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  )
}

