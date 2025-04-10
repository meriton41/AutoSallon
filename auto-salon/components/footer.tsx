import Link from "next/link"
import { Facebook, Instagram, TiktokIcon } from "@/components/social-icons"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Social Media Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-800">
        <Link
          href="https://facebook.com"
          className="flex flex-col items-center justify-center py-12 px-4 bg-[#1877F2] hover:opacity-90 transition-opacity"
        >
          <Facebook className="h-12 w-12 mb-4" />
          <p className="text-lg">Like us on Facebook</p>
        </Link>
        <Link
          href="https://instagram.com"
          className="flex flex-col items-center justify-center py-12 px-4 bg-white text-black hover:opacity-90 transition-opacity"
        >
          <Instagram className="h-12 w-12 mb-4" />
          <p className="text-lg">Follow us on Instagram</p>
        </Link>
        <Link
          href="https://tiktok.com"
          className="flex flex-col items-center justify-center py-12 px-4 bg-black hover:bg-gray-900 transition-colors"
        >
          <TiktokIcon className="h-12 w-12 mb-4" />
          <p className="text-lg">Follow us on TikTok</p>
        </Link>
      </div>

      {/* Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Nitron</h3>
            <address className="not-italic">
              <p>Magj. Prishtine-Ferizaj,</p>
              <p>Çagllavicë 10010</p>
              <p>Kosovë</p>
            </address>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:underline">
                Nitron Group
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                Nitron Rent
                </Link>
              </li>
              <li>
                <Link href="/vehicles" className="hover:underline">
                  Vehicles
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://facebook.com" className="flex items-center hover:underline">
                  <Facebook className="h-5 w-5 mr-2" />
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="https://instagram.com" className="flex items-center hover:underline">
                  <Instagram className="h-5 w-5 mr-2" />
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="https://tiktok.com" className="flex items-center hover:underline">
                  <TiktokIcon className="h-5 w-5 mr-2" />
                  TikTok
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-gray-400">
          <p>© 2009-{new Date().getFullYear()} - All rights reserved | by Kosowwwa LLC</p>
        </div>
      </div>
    </footer>
  )
}

