import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About Nitron</h1>
        
        <div className="prose prose-lg mx-auto">
          <p className="text-lg mb-6">
            Welcome to Nitron, Kosovo's premier automotive destination. Since our establishment, 
            we have been committed to providing exceptional service and quality vehicles to our 
            valued customers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Our Mission</h2>
              <p>
                To provide our customers with the highest quality vehicles and exceptional 
                service, ensuring a seamless and enjoyable car buying experience.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Our Vision</h2>
              <p>
                To be Kosovo's most trusted and respected automotive dealership, known for 
                our integrity, quality, and customer satisfaction.
              </p>
            </div>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-semibold mb-6">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Quality Vehicles</h3>
                <p>We offer a carefully selected range of high-quality vehicles that meet our strict standards.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Expert Service</h3>
                <p>Our team of experienced professionals is dedicated to providing exceptional service.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Customer Satisfaction</h3>
                <p>Your satisfaction is our priority. We work hard to ensure a positive experience.</p>
              </div>
            </div>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-semibold mb-6">Our Location</h2>
            <p className="mb-4">
              Visit us at our showroom in Çagllavicë, where you can explore our extensive 
              collection of vehicles and meet our friendly team.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold">Address:</p>
              <p>Magj. Prishtine-Ferizaj,</p>
              <p>Çagllavicë 10010</p>
              <p>Kosovë</p>
            </div>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>
            <p>
              Have questions? We're here to help! Contact us through our website, 
              visit our showroom, or give us a call. Our team is ready to assist you 
              with any inquiries about our vehicles or services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 