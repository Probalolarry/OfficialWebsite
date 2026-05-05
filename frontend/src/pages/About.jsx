import React from "react";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <main className="flex-1 max-w-[1100px] mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          About Algomian
        </h1>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Algomian Technologies is a Lagos-based retailer of quality laptops,
          PCs and accessories. We combine a curated catalogue with reliable
          logistics and after-sales support so individuals and businesses can
          buy with confidence.
        </p>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Every device passes through a quality check before shipping. Need a
          bulk quote, custom configuration, or trade-in? Reach out via the
          contact form or our WhatsApp line.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">
          What we sell
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>New, UK-used and fairly-used laptops</li>
          <li>Monitors, keyboards, mice and peripherals</li>
          <li>Custom desktops for creative and engineering work</li>
        </ul>
      </main>
      <footer className="mt-auto bg-white">
        <Footer />
      </footer>
    </div>
  );
};

export default About;
