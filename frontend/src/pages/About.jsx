import React from "react";
import { Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaTruck,
  FaHandshake,
  FaTools,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import Footer from "../components/Footer";

const values = [
  {
    icon: <FaShieldAlt className="text-orange-500 text-2xl" />,
    title: "Quality first",
    body: "Every device is bench-tested before it ships. New, UK-used, or fairly-used — you get exactly what you ordered.",
  },
  {
    icon: <FaTruck className="text-orange-500 text-2xl" />,
    title: "Reliable delivery",
    body: "Same-day Lagos drop-off, nationwide logistics partners, or pickup at our Ikeja office.",
  },
  {
    icon: <FaHandshake className="text-orange-500 text-2xl" />,
    title: "Honest advice",
    body: "We&apos;ll tell you when a cheaper machine is the right answer — even if it costs us a sale.",
  },
  {
    icon: <FaTools className="text-orange-500 text-2xl" />,
    title: "After-sales support",
    body: "Setup help, warranty handling, parts and repairs — we&apos;re still here after you take it home.",
  },
];

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#524D9B] to-[#3a3573] text-white">
        <div className="max-w-[1100px] mx-auto px-4 py-16 sm:py-24">
          <p className="text-xs uppercase tracking-wider text-orange-300 font-semibold mb-3">
            About us
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 max-w-2xl leading-tight">
            Quality laptops, fair prices, support you can actually reach.
          </h1>
          <p className="max-w-2xl text-white/80 text-base sm:text-lg leading-relaxed">
            Algomian Technologies is a Lagos-based retailer of laptops, PCs and
            accessories — built for people who care more about working
            machines than glossy spec sheets.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/collection"
              className="rounded bg-orange-500 px-5 py-2.5 text-sm font-semibold hover:bg-orange-600 transition"
            >
              Browse the shop
            </Link>
            <Link
              to="/blog"
              className="rounded border border-white/40 px-5 py-2.5 text-sm font-semibold hover:bg-white/10 transition"
            >
              Read the blog
            </Link>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-[1100px] mx-auto w-full px-4 py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Built for real work
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We started Algomian because too many Nigerians buy a laptop based
              on what someone in another country wrote a review about — and
              then have nowhere to turn when something goes wrong.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We pick stock that actually works for the way our customers work:
              long battery life, repairable, with parts you can actually find.
              Whether you&apos;re a student, a designer, an engineer or running
              a small business, we&apos;ll help you choose well and stand
              behind it after.
            </p>
            <p className="text-gray-700 leading-relaxed">
              No mystery boxes. No vague warranties. No &ldquo;come back next
              week&rdquo; runaround.
            </p>
          </div>
          <div className="rounded-xl bg-white border p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">What we sell</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• New, UK-used and fairly-used laptops</li>
              <li>• Monitors, keyboards, mice and peripherals</li>
              <li>• Custom desktops for creative & engineering work</li>
              <li>• Bulk orders for businesses and schools</li>
              <li>• Trade-ins and upgrades</li>
            </ul>
            <Link
              to="/collection"
              className="inline-block mt-5 text-sm font-semibold text-orange-500 hover:underline"
            >
              See current stock →
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white border-y">
        <div className="max-w-[1100px] mx-auto px-4 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            What we stand for
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-lg border p-5 hover:shadow-md transition bg-white"
              >
                <div className="mb-3">{v.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p
                  className="text-sm text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: v.body }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-[1100px] mx-auto w-full px-4 py-12 sm:py-16">
        <div className="rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Need help choosing?
          </h2>
          <p className="text-white/90 max-w-xl mx-auto mb-6">
            Tell us what you&apos;ll use it for and your budget. We&apos;ll
            short-list two or three good options and explain the trade-offs.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/2348106503524"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded bg-white text-orange-600 px-5 py-2.5 text-sm font-semibold hover:bg-gray-50 transition"
            >
              <FaWhatsapp /> WhatsApp us
            </a>
            <a
              href="mailto:algomiantechnologies@gmail.com"
              className="inline-flex items-center gap-2 rounded border border-white/40 px-5 py-2.5 text-sm font-semibold hover:bg-white/10 transition"
            >
              <FaEnvelope /> Send an email
            </a>
          </div>
          <p className="mt-6 text-xs text-white/70">
            Suite 13, District Plaza, Francis Onwugbu, Ikeja, Lagos · +234 (0)
            90 118 6016
          </p>
        </div>
      </section>

      <footer className="mt-auto bg-white">
        <Footer />
      </footer>
    </div>
  );
};

export default About;
