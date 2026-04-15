import { Link } from "wouter";
import { Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Contact</span>
          </nav>

          <div className="bg-white rounded-xl shadow-md p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Contact</h1>
            <hr className="my-4" />

            <p className="text-gray-700 text-justify mb-4">
              Have any question, comment, suggestion or news tip to pass along to this site?
            </p>
            <p className="text-gray-700 text-justify mb-6">
              We are open to discuss all of the possibilities with you. This page offers the right way to send any comments to this site admin related to your feedback, news coverage and other issues related to this site.
            </p>

            <h2 className="font-bold text-gray-800 mb-3">We are happy to hear information from you. Please write a subject in the following format:</h2>
            <ul className="space-y-3 mb-6">
              <li className="flex gap-3 items-start">
                <span className="font-semibold text-blue-700 shrink-0">Claim Picture</span>
                <span className="text-gray-600">[picture name] [url to real picture] — if you are the real owner to claim your picture and need back links.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="font-semibold text-blue-700 shrink-0">Submit Wallpapers</span>
                <span className="text-gray-600">[wallpaper name] — if you want to submit your wallpaper design to us.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="font-semibold text-blue-700 shrink-0">Advertise</span>
                <span className="text-gray-600">If you are interested in advertising on our site.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="font-semibold text-blue-700 shrink-0">Support</span>
                <span className="text-gray-600">If you need our support.</span>
              </li>
            </ul>

            <div className="bg-blue-50 rounded-lg p-5 flex items-center gap-4">
              <Mail className="w-8 h-8 text-blue-500 shrink-0" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Send your email to:</p>
                <a href="mailto:admin@wallpaperhub.com" className="text-blue-600 font-semibold hover:underline text-lg">
                  admin@wallpaperhub.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
