import Link from 'next/link'
export function Footer() {
  return (
    <footer id="contact" className="bg-gradient-to-b from-gray-800 to-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-primary pb-2 inline-block">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex flex-row">
                <span className="flex-none"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg></span>
                <div className="flex-1 hover:text-primary transition-colors pl-1">
                  <div className="flex flex-col">
                    <Link
                      href="https://maps.google.com/?q=11105+State+Bridge+Rd+Suite+140,+Alpharetta,+GA,+United+States,+30004"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="groupitems-center gap-2 hover:text-primary hover:scale-x-105 transition-all duration-300"
                    >
                      <p className="transition-colors pl-2 ">11105 State Bridge Rd Suite 140,</p>
                      <p className="transition-colors pl-2">Alpharetta, GA, United States, 30004</p>
                    </Link>
                  </div>
                </div>
              </div>
              <p className="flex items-center hover:text-primary transition-colors gap-2">
                <span className="mr-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z" />
                </svg>
                </span>
                <Link
                  href="tel:+8329730740"
                  className="inline-block mt-2 hover:underline transition-all duration-300 hover:scale-x-105 will-change-transform"
                >
                  +1 (832) 973-0740
                </Link>
              </p>
              <p className="flex items-center hover:text-white transition-colors gap-2">
                <span className="mr-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z" />
                </svg>
                </span>
                <a href="mailto:Jathara.northamerica@gmail.com" className="hover:underline hover:text-primary hover:scale-x-105 transition-all duration-300">
                  Jathara.northamerica@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Hours Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-primary pb-2 inline-block">
              Opening Hours
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center group">
                <span>Coming Soon, follow us on social media for updates</span>
              </div>
              {/* <div className="flex justify-between items-center group">
                <span>Saturday - Sunday</span>
                <span className="text-green-400 group-hover:text-white transition-colors">10am - 11pm</span>
              </div> */}
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-primary pb-2 inline-block">
              Follow Us
            </h3>
            <div className="flex space-x-6">
              <Link
                href="https://www.facebook.com/people/Jathara/61565167931330/?name=xhp_nt__fb__action__open_user"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-transform hover:scale-110 duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm">
          <p>© {new Date().getFullYear()} Jathara. All rights reserved.</p>
        </div>
      </div>
    </footer >
  )
}

