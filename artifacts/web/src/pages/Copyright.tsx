import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Copyright() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Copyright</span>
          </nav>

          <div className="bg-white rounded-xl shadow-md p-8 prose prose-gray max-w-none">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Copyright Notice</h1>
            <hr className="my-4" />

            <p>
              All content on WallpaperHub, including but not limited to images, text, graphics, logos, and software, is the property of their respective owners. WallpaperHub respects the intellectual property rights of third parties and is committed to complying with all applicable copyright laws.
            </p>

            <h2>Image Credits</h2>
            <p>
              The images displayed on WallpaperHub are collected from various public sources. We make our best effort to attribute images to their original creators. If you believe your copyrighted image has been used without proper attribution, please <Link href="/p/contact" className="text-blue-600 hover:underline">contact us</Link> and we will address the matter promptly.
            </p>

            <h2>Fair Use</h2>
            <p>
              Some images on this site may be used under the principles of fair use for educational and informational purposes. This use is not intended to infringe upon the rights of copyright holders.
            </p>

            <h2>Reporting Copyright Violations</h2>
            <p>
              If you find content on our website that you believe violates your copyright, please refer to our <Link href="/p/dmca" className="text-blue-600 hover:underline">DMCA Policy</Link> for information on how to submit a takedown notice.
            </p>

            <p>Copyright &copy; {new Date().getFullYear()} WallpaperHub. All rights reserved.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
