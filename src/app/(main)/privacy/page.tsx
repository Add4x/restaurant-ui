import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Restaurant Name",
  description: "Privacy Policy for Restaurant Name - How we collect, use, and protect your information",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="mb-6">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information you provide directly to us, such as when you create an account, place an order, 
              sign up for our newsletter, or contact us.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Personal information: name, email address, phone number, delivery address</li>
              <li>Payment information: credit card details (processed securely through Stripe)</li>
              <li>Order history and preferences</li>
              <li>Communications between you and us</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Process and deliver your orders</li>
              <li>Send order confirmations and updates</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our services and develop new features</li>
              <li>Prevent fraud and enhance security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
            <p className="mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties. 
              We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>With service providers who assist in our operations (e.g., payment processors, delivery partners)</li>
              <li>To comply with legal obligations or respond to lawful requests</li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>With your consent or at your direction</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
              over the Internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access and receive a copy of your personal information</li>
              <li>Update or correct your personal information</li>
              <li>Delete your account and personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to processing of your personal information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Children&apos;s Privacy</h2>
            <p className="mb-4">
              Our services are not directed to individuals under the age of 13. We do not knowingly collect personal 
              information from children under 13. If we become aware that a child under 13 has provided us with personal 
              information, we will take steps to delete such information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="pl-6">
              <p>Email: privacy@restaurantname.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Address: 123 Main Street, City, State 12345</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}