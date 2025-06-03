"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Car, CreditCard, DollarSign, Calendar, TrendingUp, Search, Filter, ArrowUpDown } from "lucide-react"
import { motion } from "framer-motion"

// Sample data for demonstration
const sampleVehicles = [
  {
    id: 1,
    name: "Mercedes S-Class",
    price: 85000,
    monthlyPayment: 1250,
    remainingPayments: 48,
    nextPayment: "2023-06-15",
    status: "Active",
  },
  {
    id: 2,
    name: "BMW X5",
    price: 65000,
    monthlyPayment: 980,
    remainingPayments: 36,
    nextPayment: "2023-06-10",
    status: "Active",
  },
  {
    id: 3,
    name: "Audi A8",
    price: 78000,
    monthlyPayment: 1150,
    remainingPayments: 42,
    nextPayment: "2023-06-20",
    status: "Active",
  },
  {
    id: 4,
    name: "Tesla Model S",
    price: 89000,
    monthlyPayment: 1320,
    remainingPayments: 48,
    nextPayment: "2023-06-05",
    status: "Overdue",
  },
  {
    id: 5,
    name: "Porsche Cayenne",
    price: 92000,
    monthlyPayment: 1450,
    remainingPayments: 48,
    nextPayment: "2023-06-25",
    status: "Active",
  },
  {
    id: 6,
    name: "Range Rover Sport",
    price: 76000,
    monthlyPayment: 1100,
    remainingPayments: 42,
    nextPayment: "2023-06-18",
    status: "Active",
  },
  {
    id: 7,
    name: "Lexus LS",
    price: 72000,
    monthlyPayment: 1050,
    remainingPayments: 36,
    nextPayment: "2023-06-12",
    status: "Active",
  },
  {
    id: 8,
    name: "Volvo XC90",
    price: 58000,
    monthlyPayment: 850,
    remainingPayments: 36,
    nextPayment: "2023-06-08",
    status: "Pending",
  },
]

export default function Home() {
  const [vehicles, setVehicles] = useState(sampleVehicles)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" })
  const [leasingParams, setLeasingParams] = useState({
    vehiclePrice: 50000,
    downPayment: 5000,
    term: 36,
    interestRate: 3.9,
  })

  // Calculate monthly payment based on leasing parameters
  const calculateMonthlyPayment = () => {
    const principal = leasingParams.vehiclePrice - leasingParams.downPayment
    const monthlyRate = leasingParams.interestRate / 100 / 12
    const months = leasingParams.term

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    return monthlyPayment.toFixed(2)
  }

  // Sort function for table columns
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Filter and sort vehicles
  const filteredVehicles = vehicles
    .filter(
      (vehicle) =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.status.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })

  // Add a new vehicle with leasing details
  const addVehicle = () => {
    const newVehicle = {
      id: vehicles.length + 1,
      name: "New Vehicle",
      price: leasingParams.vehiclePrice,
      monthlyPayment: Number.parseFloat(calculateMonthlyPayment()),
      remainingPayments: leasingParams.term,
      nextPayment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "Pending",
    }

    setVehicles([...vehicles, newVehicle])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-950 shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">AutoSalon Finance</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Button variant="ghost">Dashboard</Button>
              <Button variant="ghost">Inventory</Button>
              <Button variant="default">Payments</Button>
              <Button variant="ghost">Reports</Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl font-bold mb-8">Vehicle Payment Management</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Leasing Calculator
                </CardTitle>
                <CardDescription>Calculate your monthly payments</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="vehicle-price">Vehicle Price</Label>
                    <span className="font-medium">${leasingParams.vehiclePrice.toLocaleString()}</span>
                  </div>
                  <Slider
                    id="vehicle-price"
                    min={10000}
                    max={200000}
                    step={1000}
                    value={[leasingParams.vehiclePrice]}
                    onValueChange={(value) => setLeasingParams({ ...leasingParams, vehiclePrice: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="down-payment">Down Payment</Label>
                    <span className="font-medium">${leasingParams.downPayment.toLocaleString()}</span>
                  </div>
                  <Slider
                    id="down-payment"
                    min={0}
                    max={leasingParams.vehiclePrice / 2}
                    step={500}
                    value={[leasingParams.downPayment]}
                    onValueChange={(value) => setLeasingParams({ ...leasingParams, downPayment: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="term">Lease Term</Label>
                  <Select
                    value={leasingParams.term.toString()}
                    onValueChange={(value) => setLeasingParams({ ...leasingParams, term: Number.parseInt(value) })}
                  >
                    <SelectTrigger id="term">
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                      <SelectItem value="48">48 months</SelectItem>
                      <SelectItem value="60">60 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                    <span className="font-medium">{leasingParams.interestRate}%</span>
                  </div>
                  <Slider
                    id="interest-rate"
                    min={1}
                    max={10}
                    step={0.1}
                    value={[leasingParams.interestRate]}
                    onValueChange={(value) => setLeasingParams({ ...leasingParams, interestRate: value[0] })}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="w-full p-4 bg-primary/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Monthly Payment:</span>
                    <span className="text-2xl font-bold">${calculateMonthlyPayment()}</span>
                  </div>
                </div>
                <Button className="w-full" onClick={addVehicle}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Add Vehicle with These Terms
                </Button>
              </CardFooter>
            </Card>

            <Card className="mt-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Payment Overview
                </CardTitle>
                <CardDescription>Summary of your vehicle payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Vehicles</p>
                    <p className="text-2xl font-bold">{vehicles.length}</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Monthly Total</p>
                    <p className="text-2xl font-bold">
                      ${vehicles.reduce((sum, vehicle) => sum + vehicle.monthlyPayment, 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Leases</span>
                    <span>{vehicles.filter((v) => v.status === "Active").length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pending Approval</span>
                    <span>{vehicles.filter((v) => v.status === "Pending").length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Overdue Payments</span>
                    <span className="text-red-500 font-medium">
                      {vehicles.filter((v) => v.status === "Overdue").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Vehicle Payments
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tabs defaultValue="all" className="w-[300px]">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="overdue">Overdue</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardTitle>
                <CardDescription>Manage your vehicle payment schedule</CardDescription>
                <div className="flex items-center space-x-2 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search vehicles..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] w-full pr-4">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background">
                      <TableRow>
                        <TableHead className="w-[200px] cursor-pointer" onClick={() => requestSort("name")}>
                          <div className="flex items-center">
                            Vehicle
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => requestSort("price")}>
                          <div className="flex items-center">
                            Price
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => requestSort("monthlyPayment")}>
                          <div className="flex items-center">
                            Monthly
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => requestSort("remainingPayments")}>
                          <div className="flex items-center">
                            Remaining
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => requestSort("nextPayment")}>
                          <div className="flex items-center">
                            Next Payment
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => requestSort("status")}>
                          <div className="flex items-center">
                            Status
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id} className="hover:bg-primary/5 cursor-pointer transition-colors">
                          <TableCell className="font-medium">{vehicle.name}</TableCell>
                          <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                          <TableCell>${vehicle.monthlyPayment.toLocaleString()}</TableCell>
                          <TableCell>{vehicle.remainingPayments} months</TableCell>
                          <TableCell>{vehicle.nextPayment}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                vehicle.status === "Active"
                                  ? "default"
                                  : vehicle.status === "Overdue"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {vehicle.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Export Data</Button>
                <Button>Make Payment</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
