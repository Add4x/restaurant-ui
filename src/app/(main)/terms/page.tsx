import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Restaurant Name",
  description: "Terms of Service for Restaurant Name - Terms and conditions for using our services",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="mb-6">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using this website and our services, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use of Service</h2>
            <p className="mb-4">Our services are available to users who:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Are at least 18 years old or have parental consent</li>
              <li>Provide accurate and complete information</li>
              <li>Have the legal authority to enter into these terms</li>
              <li>Are located within our delivery service areas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration</h2>
            <p className="mb-4">
              To place orders, you may need to create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring your account information is accurate and current</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Orders and Payment</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">4.1 Order Placement</h3>
            <p className="mb-4">
              When you place an order, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate delivery information</li>
              <li>Be available to receive the order at the specified time</li>
              <li>Pay the full amount including taxes and delivery fees</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">4.2 Pricing</h3>
            <p className="mb-4">
              All prices are displayed in USD and are subject to change without notice. Prices at the time of order 
              placement will be honored.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">4.3 Payment Processing</h3>
            <p className="mb-4">
              Payments are processed securely through Stripe. We do not store credit card information on our servers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cancellations and Refunds</h2>
            <p className="mb-4">
              Order cancellations and refund policies:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Orders can be cancelled within 5 minutes of placement</li>
              <li>Refunds for cancelled orders will be processed within 5-7 business days</li>
              <li>We reserve the right to refuse refunds for orders already in preparation</li>
              <li>Quality issues should be reported within 24 hours for resolution</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Delivery Terms</h2>
            <p className="mb-4">Regarding delivery services:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Delivery times are estimates and not guaranteed</li>
              <li>We are not liable for delays due to weather, traffic, or other factors beyond our control</li>
              <li>Delivery is available only within specified service areas</li>
              <li>Additional fees may apply for special delivery requests</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="mb-4">
              All content on this website, including text, graphics, logos, images, and software, is the property 
              of Restaurant Name or its content suppliers and is protected by intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Prohibited Uses</h2>
            <p className="mb-4">You may not use our services to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful or malicious code</li>
              <li>Harass, abuse, or harm others</li>
              <li>Engage in fraudulent activities</li>
              <li>Attempt to gain unauthorized access to our systems</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, Restaurant Name shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages resulting from your use or inability to use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="mb-4">
              You agree to indemnify and hold harmless Restaurant Name, its affiliates, and their respective officers, 
              directors, employees, and agents from any claims, losses, or damages arising from your use of our services 
              or violation of these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Modifications to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
              Your continued use of our services after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="mb-4">
              These terms shall be governed by and construed in accordance with the laws of [Your State/Country], 
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms of Service, please contact us at:
            </p>
            <div className="pl-6">
              <p>Email: legal@restaurantname.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Address: 123 Main Street, City, State 12345</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}