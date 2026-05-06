import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Programs from '@/components/Programs';
import Curriculum from '@/components/Curriculum';
import Mentors from '@/components/Mentors';
import Contact from '@/components/Contact';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Programs />
      <Curriculum />
      <Mentors />
      <Contact />
      <FAQ />
      <Footer />
    </>
  );
}
