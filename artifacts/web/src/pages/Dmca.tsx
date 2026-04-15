import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Dmca() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">DMCA</span>
          </nav>

          <div className="bg-white rounded-xl shadow-md p-8 prose prose-gray max-w-none">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">DMCA Notice & Takedown Policy</h1>
            <hr className="my-4" />

            <p>
              WallpaperHub respects the intellectual property rights of others and expects its users to do the same. It is our policy to respond to clear notices of alleged copyright infringement that comply with the Digital Millennium Copyright Act (DMCA).
            </p>

            <h2>Copyright Infringement Notification</h2>
            <p>If you believe that content on our website infringes your copyright, please provide our designated agent with the following information:</p>
            <ol>
              <li>A physical or electronic signature of the copyright owner or an authorized agent.</li>
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>Identification of the material that is claimed to be infringing and information reasonably sufficient to permit us to locate the material.</li>
              <li>Your contact information, including address, telephone number, and email address.</li>
              <li>A statement that you have a good faith belief that the use is not authorized by the copyright owner, its agent, or law.</li>
              <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner.</li>
            </ol>

            <h2>Counter-Notification</h2>
            <p>
              If you believe that material you posted was removed by mistake or misidentification, you may submit a counter-notification. Please contact us at our email address with your counter-notice.
            </p>

            <h2>Contact</h2>
            <p>
              To submit a DMCA notice or counter-notification, please visit our <Link href="/p/contact" className="text-blue-600 hover:underline">Contact page</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
