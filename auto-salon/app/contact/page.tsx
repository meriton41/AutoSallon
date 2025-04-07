import type { Metadata } from "next"
import ContactForm from "@/components/contact-form"
import { MapPin, Phone, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | Auto Sherreti",
  description: "Get in touch with Auto Sherreti",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
          <ContactForm />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Our Information</h2>

          <div className="space-y-6">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">Address</h3>
                <address className="not-italic text-muted-foreground">
                  <p>Magj. Prishtine-Ferizaj,</p>
                  <p>Çagllavicë 10010</p>
                  <p>Kosovë</p>
                </address>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-5 w-5 mr-3 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-muted-foreground">+383 44 123 456</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="h-5 w-5 mr-3 mt-1 text-primary" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">info@sherreti.com</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-medium mb-2">Business Hours</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 7:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>10:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 h-64 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.2995706635813!2d21.15!3d42.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDM5JzAwLjAiTiAyMcKwMDknMDAuMCJF!5e0!3m2!1sen!2s!4v1650000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}

