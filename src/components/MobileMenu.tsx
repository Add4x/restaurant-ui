'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import NavItem from './NavItem'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [isServicesOpen, setIsServicesOpen] = useState(false)

  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background z-50 md:hidden">
      <div className="flex justify-end p-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      <nav className="p-4">
        <ul className="space-y-4">
          <NavItem href="/" onClick={onClose}>Home</NavItem>
          <NavItem href="/about" onClick={onClose}>About</NavItem>
          <li>
            <button onClick={toggleServices} className="w-full text-left py-2">
              Services
            </button>
            {isServicesOpen && (
              <ul className="pl-4 mt-2 space-y-2">
                <NavItem href="/services/web-development" onClick={onClose}>Web Development</NavItem>
                <NavItem href="/services/mobile-app-development" onClick={onClose}>Mobile App Development</NavItem>
                <NavItem href="/services/ui-ux-design" onClick={onClose}>UI/UX Design</NavItem>
                <NavItem href="/services/cloud-services" onClick={onClose}>Cloud Services</NavItem>
                <NavItem href="/services/data-analytics" onClick={onClose}>Data Analytics</NavItem>
                <NavItem href="/services/cybersecurity" onClick={onClose}>Cybersecurity</NavItem>
                <NavItem href="/services/ai-machine-learning" onClick={onClose}>AI & Machine Learning</NavItem>
              </ul>
            )}
          </li>
          <NavItem href="/contact" onClick={onClose}>Contact</NavItem>
          <NavItem href="/faq" onClick={onClose}>FAQ</NavItem>
        </ul>
      </nav>
    </div>
  )
}

export default MobileMenu

