import HeroSection from "@/components/public/HeroSection";
import HowItWorks from "@/components/public/HowItWorks";
import ProductsShowcase from "@/components/public/ProductsShowcase";
import BookingPreview from "@/components/public/BookingPreview";
import DashboardPreview from "@/components/public/DashboardPreview";
import FeaturesGrid from "@/components/public/FeaturesGrid";
import MCSection from "@/components/public/MCSection";

export default function PublicLandingPage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <ProductsShowcase />
      <BookingPreview />
      <DashboardPreview />
      <FeaturesGrid />
      <MCSection />
    </>
  );
}
