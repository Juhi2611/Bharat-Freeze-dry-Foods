import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyBFF from './components/WhyBFF';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import HomeFeatureStrip from './components/HomeFeatureStrip';
import CategoryShowcase from './components/CategoryShowcase';
import ExportBharatStrip from './components/ExportBharatStrip';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HomeFeatureStrip />
      <CategoryShowcase />
      <ExportBharatStrip />
      <WhyBFF />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
