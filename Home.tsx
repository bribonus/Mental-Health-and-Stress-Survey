import { Link } from "wouter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Stress &amp; Mental Health Survey
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            This short survey explores stress and mental health among undergraduate college students.
          </p>
          <p className="text-gray-500 text-sm mb-10">
            Your responses are anonymous and will only be used for academic purposes. It takes about 3&ndash;5 minutes to complete.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/survey"
              className="inline-block px-8 py-3 bg-[#8A3BDB] text-white font-semibold rounded-lg hover:bg-[#7a2ec9] focus:outline-none focus:ring-2 focus:ring-[#8A3BDB] focus:ring-offset-2 transition-colors"
            >
              Take the Survey
            </Link>
            <Link
              href="/results"
              className="inline-block px-8 py-3 border-2 border-[#8A3BDB] text-[#6b21b8] font-semibold rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-[#8A3BDB] focus:ring-offset-2 transition-colors"
            >
              View Results
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
