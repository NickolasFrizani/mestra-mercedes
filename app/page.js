"use client";
import { useState } from "react";
import ParticlesBg from "./components/ParticlesBg";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import PainSection from "./components/PainSection";
import ServicesSection from "./components/ServicesSection";
import AboutSection from "./components/AboutSection";
import HowItWorks from "./components/HowItWorks";
import TestimonialsSection from "./components/TestimonialsSection";
import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";
import BookingModal from "./components/BookingModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [initialService, setInitialService] = useState("");

  const openBooking = () => setModalOpen(true);
  const openBookingFor = (serviceName) => {
    setInitialService(serviceName);
    setModalOpen(true);
  };

  return (
    <div style={{ background: "#080612", minHeight: "100vh", color: "#f8f3e8" }}>
      <ParticlesBg />
      <Nav onOpenBooking={openBooking} />
      <Hero onOpenBooking={openBooking} />
      <PainSection onOpenBooking={openBooking} />
      <ServicesSection onSelectService={openBookingFor} />
      <AboutSection onOpenBooking={openBooking} />
      <HowItWorks />
      <TestimonialsSection />
      <CtaSection onOpenBooking={openBooking} />
      <Footer />
      {modalOpen && (
        <BookingModal
          onClose={() => {
            setModalOpen(false);
            setInitialService("");
          }}
          initialService={initialService}
        />
      )}
    </div>
  );
}
