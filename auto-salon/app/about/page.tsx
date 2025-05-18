import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src="/images/about/hero.jpg" // Place your hero image in public/images/about/hero.jpg
          alt="About Us Hero"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="relative z-20 flex items-center justify-center h-full">
          <h1 className="text-5xl font-bold text-white text-center drop-shadow-lg">About Nitron</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Introduction */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            Welcome to Nitron, Kosovo's premier automotive destination. Since our establishment, 
            we have been committed to providing exceptional service and quality vehicles to our 
            valued customers.
          </p>
        </section>

        {/* Mission and Vision */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Our Mission</h2>
              <p className="text-gray-700 dark:text-gray-300">
                To provide our customers with the highest quality vehicles and exceptional 
                service, ensuring a seamless and enjoyable car buying experience.
              </p>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Our Vision</h2>
              <p className="text-gray-700 dark:text-gray-300">
                To be Kosovo's most trusted and respected automotive dealership, known for 
                our integrity, quality, and customer satisfaction.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/about/mission-vision.jpg" // Place an image related to mission/vision in public/images/about/mission-vision.jpg
                alt="Mission and Vision"
                width={600}
                height={400}
                layout="responsive"
                objectFit="cover"
              />
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Quality Vehicles</h3>
              <p className="text-gray-700 dark:text-gray-300">We offer a carefully selected range of high-quality vehicles that meet our strict standards.</p>
            </div>
            <div className="p-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Expert Service</h3>
              <p className="text-gray-700 dark:text-gray-300">Our team of experienced professionals is dedicated to providing exceptional service.</p>
            </div>
            <div className="p-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Customer Satisfaction</h3>
              <p className="text-gray-700 dark:text-gray-300">Your satisfaction is our priority. We work hard to ensure a positive experience.</p>
            </div>
          </div>
        </section>

        {/* Our Location and Contact */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Our Location</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Visit us at our showroom in Çagllavicë, where you can explore our extensive 
                collection of vehicles and meet our friendly team.
              </p>
              <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">Address:</p>
                <p className="text-gray-700 dark:text-gray-300">Magj. Prishtine-Ferizaj,</p>
                <p className="text-gray-700 dark:text-gray-300">Çagllavicë 10010</p>
                <p className="text-gray-700 dark:text-gray-300">Kosovë</p>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Have questions? We're here to help! Contact us through our website, 
                visit our showroom, or give us a call. Our team is ready to assist you 
                with any inquiries about our vehicles or services.
              </p>
              {/* Add contact form or link to contact page if available */}
            </div>
          </div>
        </section>

        {/* Gallery Section (Optional) */}
        <section>
          <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-12">Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/about/gallery1.jpg" // Place your gallery image 1 in public/images/about/gallery1.jpg
                alt="Gallery Image 1"
                width={400}
                height={300}
                layout="responsive"
                objectFit="cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/about/gallery2.jpg" // Place your gallery image 2 in public/images/about/gallery2.jpg
                alt="Gallery Image 2"
                width={400}
                height={300}
                layout="responsive"
                objectFit="cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/about/gallery3.jpg" // Place your gallery image 3 in public/images/about/gallery3.jpg
                alt="Gallery Image 3"
                width={400}
                height={300}
                layout="responsive"
                objectFit="cover"
              />
            </div>
            {/* Add more gallery images as needed */}
          </div>
        </section>
      </div>
    </div>
  );
} 