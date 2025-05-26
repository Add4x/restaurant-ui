import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer
      id="contact"
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300 py-16 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="group">
                <Link
                  href="https://maps.google.com/?q=11105+State+Bridge+Rd+Suite+140,+Alpharetta,+GA,+United+States,+30004"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-all duration-300 group-hover:translate-x-1"
                >
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-200 group-hover:text-white transition-colors">
                      11105 State Bridge Rd Suite 140
                    </p>
                    <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                      Alpharetta, GA 30004
                    </p>
                  </div>
                </Link>
              </div>

              <div className="group">
                <Link
                  href="tel:+14706575189"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-all duration-300 group-hover:translate-x-1"
                >
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-slate-200 group-hover:text-white transition-colors">
                    +1 (470) 657-5189
                  </span>
                </Link>
              </div>

              <div className="group">
                <a
                  href="mailto:Jathara.northamerica@gmail.com"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-all duration-300 group-hover:translate-x-1"
                >
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-slate-200 group-hover:text-white transition-colors">
                    Jathara.northamerica@gmail.com
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              Hours
            </h3>
            <div className="space-y-1">
              <div className="relative">
                <div className="flex flex-col space-y-1 p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-medium">
                      Mon - Thu
                    </span>
                    <div className="text-right">
                      <div className="text-emerald-400 text-base">
                        12:00 PM - 3:00 PM
                      </div>
                      <div className="text-emerald-400 text-base">
                        5:00 PM - 10:00 PM
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-3 my-2" />
              </div>

              <div className="relative">
                <div className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                  <span className="text-slate-300 font-medium">Fri - Sat</span>
                  <span className="text-emerald-400 text-base">
                    12:00 PM - 11:00 PM
                  </span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-3 my-2" />
              </div>

              <div className="relative">
                <div className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                  <span className="text-slate-300 font-medium">Sunday</span>
                  <span className="text-emerald-400 text-base">
                    12:00 PM - 9:30 PM
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95" />
                </svg>
              </div>
              Follow Us
            </h3>
            <div className="flex gap-4">
              <Link
                href="https://www.facebook.com/people/Jathara/61565167931330/?name=xhp_nt__fb__action__open_user"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300 group"
              >
                <svg
                  className="w-8 h-8 text-slate-400 group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Jathara. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-400">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
