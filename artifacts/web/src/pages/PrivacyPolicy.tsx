import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Privacy Policy</span>
          </nav>

          <div className="bg-white rounded-xl shadow-md p-8 prose prose-gray max-w-none">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
            <hr className="my-4" />

            <p className="text-gray-600 text-sm mb-6">Last updated: {new Date().getFullYear()}</p>

            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you contact us via email. This may include your name and email address. We also automatically collect certain information when you visit our website, including your IP address, browser type, and pages you view.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our website</li>
              <li>Improve and enhance our website and services</li>
            </ul>

            <h2>3. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>

            <h2>4. Third-Party Services</h2>
            <p>
              We may employ third-party companies and individuals due to the following reasons: to facilitate our service, to provide the service on our behalf, to perform service-related services, or to assist us in analyzing how our service is used.
            </p>

            <h2>5. Links to Other Sites</h2>
            <p>
              Our website may contain links to other sites. If you click on a third-party link, you will be directed to that site. We strongly advise you to review the Privacy Policy of every site you visit.
            </p>

            <h2>6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at <Link href="/p/contact" className="text-blue-600 hover:underline">our contact page</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
