import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LightBulbIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
  CalendarDaysIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const HomePage = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-indigo-200 text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="p-6 flex items-center justify-between bg-white/70 backdrop-blur-md shadow-sm">
        <div className="text-3xl font-extrabold text-indigo-700 tracking-tight">
          ZenTask
        </div>
        <div>
          <Link
            to="/signup"
            className="bg-indigo-600 text-white hover:bg-indigo-500 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out shadow-sm mr-3"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="border border-indigo-600 text-indigo-700 hover:bg-indigo-600 hover:text-white py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out shadow-sm"
          >
            Log In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-800 mb-6">
          Simplify Your Life with ZenTask
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-600">
          Organize your day, manage priorities, and accomplish more — all in one
          calm and elegant workspace.
        </p>
        <Link
          to="/signup"
          className="inline-block bg-indigo-600 text-white hover:bg-indigo-500 py-3 px-10 rounded-full text-xl font-semibold transition duration-300 ease-in-out shadow-md"
        >
          Get Started for Free
        </Link>
      </header>

      {/* Features Section */}
      <section className="bg-white/70 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-indigo-800 mb-12">
            Everything You Need to Stay Productive
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              Icon={LightBulbIcon}
              color="text-indigo-500"
              title="Clean, Minimal Interface"
              desc="Focus only on what matters — completing your tasks, without distractions or clutter."
            />
            <FeatureCard
              Icon={CheckCircleIcon}
              color="text-green-500"
              title="Smart Task Management"
              desc="Add tasks with priorities, due dates, and categories. Plan your week effortlessly."
            />
            <FeatureCard
              Icon={RocketLaunchIcon}
              color="text-pink-500"
              title="Boost Your Efficiency"
              desc="Set daily goals, get reminders, and track your streaks to stay motivated."
            />
            <FeatureCard
              Icon={CalendarDaysIcon}
              color="text-purple-500"
              title="Calendar View"
              desc="Visualize your upcoming tasks and events with a simple, beautiful calendar mode."
            />
            <FeatureCard
              Icon={DevicePhoneMobileIcon}
              color="text-blue-500"
              title="Cross-Device Sync"
              desc="Access your tasks on any device — desktop, tablet, or mobile. Your data stays synced."
            />
            <FeatureCard
              Icon={ShieldCheckIcon}
              color="text-teal-500"
              title="Private & Secure"
              desc="Your data is encrypted and safe. We respect your privacy — always."
            />
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 bg-white text-center text-gray-700">
        <blockquote className="text-3xl md:text-4xl font-semibold italic mb-6">
          "The key is not to prioritize what’s on your schedule, but to schedule
          your priorities."
        </blockquote>
        <p className="text-lg text-gray-500">– Stephen R. Covey</p>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-b from-indigo-200 via-purple-200 to-indigo-300 text-center">
        <h2 className="text-4xl font-bold text-indigo-800 mb-4">
          Simple, Transparent Plans
        </h2>
        <p className="text-lg text-gray-600 mb-14">
          Get started for free. Upgrade anytime for advanced tools.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-10 max-w-6xl mx-auto px-6">
          <PlanCard
            title="Free"
            price="₹0"
            color="text-indigo-700"
            buttonText="Start Free"
            buttonAction={() => (window.location.href = "/signup")}
            features={[
              "Up to 10 tasks per day",
              "Basic reminders",
              "Daily checklist",
              "Cross-device sync",
              "Light & dark theme",
            ]}
          />

          <PlanCard
            title="Pro"
            price="₹199"
            color="text-white"
            highlight
            buttonText="Upgrade to Pro"
            buttonAction={() => setIsModalOpen(true)}
            features={[
              "Unlimited tasks",
              "Smart recurring tasks",
              "Connect with your google calendar",
              
              "Focus Mode (Pomodoro Timer)",
              "Team collaboration tools",
              "Advanced analytics",
              "Priority support",
              "Custom themes",
            ]}
          />
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white/90 border border-gray-300 p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
              <h3 className="text-2xl font-bold mb-4 text-indigo-700">
                Coming Soon...
              </h3>
              <p className="text-gray-600 mb-6">
                We're working hard to bring you this feature soon. Stay tuned!
              </p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>

      

      {/* Footer */}
      <footer className="bg-indigo-950 py-5 text-center text-gray-300">
        <p className="text-sm">
          © {new Date().getFullYear()} ZenTask. Built by{" "}
          <a
            href="https://www.linkedin.com/in/darsh-balar-802981279/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 font-semibold hover:text-white transition"
          >
            Darsh Balar
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

/* --- Reusable Components --- */

const FeatureCard = ({ Icon, color, title, desc }) => (
  <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300 ease-in-out">
    <Icon className={`h-14 w-14 ${color} mx-auto mb-6`} />
    <h3 className="text-2xl font-semibold mb-3 text-indigo-800">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

const PlanCard = ({
  title,
  price,
  color,
  features,
  highlight,
  buttonText,
  buttonAction,
}) => (
  <div
    className={`relative flex-1 rounded-2xl p-10 shadow-md transition ${
      highlight
        ? "bg-indigo-600 text-white border-2 border-indigo-400"
        : "bg-white text-gray-800 border border-gray-300"
    }`}
  >
    {highlight && (
      <div className="absolute -top-4 right-6 bg-indigo-500 text-white text-xs uppercase px-3 py-1 rounded-full font-semibold shadow-md">
        Most Popular
      </div>
    )}
    <h3 className={`text-2xl font-bold mb-2 ${color}`}>{title}</h3>
    <p className="text-sm mb-6 opacity-90">
      {title === "Free"
        ? "Perfect for individuals getting started."
        : "For teams and productivity enthusiasts."}
    </p>
    <div className="mb-8">
      <span
        className={`text-4xl font-extrabold ${
          highlight ? "text-white" : "text-indigo-700"
        }`}
      >
        {price}
      </span>
      <span className="text-lg ml-1 opacity-75">/month</span>
    </div>
    <button
      onClick={buttonAction}
      className={`w-full py-3 rounded-lg font-bold shadow-sm hover:scale-105 transition ${
        highlight
          ? "bg-white text-indigo-700 hover:bg-gray-100"
          : "bg-indigo-600 text-white hover:bg-indigo-500"
      }`}
    >
      {buttonText}
    </button>
    <ul
      className={`mt-6 space-y-3 text-left ${
        highlight ? "text-white" : "text-gray-600"
      }`}
    >
      {features.map((f, i) => (
        <li key={i}>✓ {f}</li>
      ))}
    </ul>
  </div>
);

export default HomePage;
