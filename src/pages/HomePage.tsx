import { Layout } from '@/components/layout';
import { HeroSection } from './home/HeroSection';
import { DrShyraSection } from './home/DrShyraSection';
import { BookAppointmentSection } from './home/BookAppointmentSection';
import { ServicesSection } from './home/ServicesSection';
import { AboutSection } from './home/AboutSection';
import { DoctorsCarousel } from './home/DoctorsCarousel';
import { PatientReviewsSection } from './home/PatientReviewsSection';
import { StatsSection } from './home/StatsSection';
import { ContactSection } from './home/ContactSection';
import { Footer } from './home/Footer';

export default function HomePage() {
  return (
    <Layout showSidebar={false}>
      <HeroSection />
      <DrShyraSection />
      <BookAppointmentSection />
      <ServicesSection />
      <AboutSection />
      <DoctorsCarousel />
      <PatientReviewsSection />
      <StatsSection />
      <ContactSection />
      <Footer />
    </Layout>
  );
}
