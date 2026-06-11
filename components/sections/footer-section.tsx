import Link from "next/link"
import { Twitter, Linkedin, Mail } from "lucide-react"

const footerLinks = {
  product: [
    { label: "All Seasons", href: "#seasons" },
    { label: "Pricing", href: "#pricing" },
    { label: "Success Stories", href: "#community" },
    { label: "Documentation", href: "#" },
  ],
  company: [
    { label: "About Roboflix", href: "#" },
    { label: "Robotics Blog", href: "#" },
    { label: "Community", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/policy" },
    { label: "Terms of Service", href: "/policy" },
    { label: "Refund Policy", href: "/policy" },
  ],
}

export function FooterSection() {
  return (
    <footer className="px-6 py-16 border-t border-red-600/20 bg-black/60">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display text-2xl font-bold text-white tracking-wider">
              <span className="text-red-600">ROBO</span>FLIX
            </Link>
            <p className="mt-4 text-sm text-gray-400 max-w-xs">
              Learn robotics like binge-watching your favorite series. Addictive. Practical. Fun.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-white mb-4">Community</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-red-600/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Roboflix. All rights reserved. Made with passion for robotics.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-gray-400 hover:text-red-600 transition-colors" aria-label="Email">
              <Mail className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-red-600 transition-colors" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-red-600 transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
