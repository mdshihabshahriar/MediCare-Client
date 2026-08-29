'use client'
import Banner from "@/components/Banner";
import FeaturedDoctors from "@/components/FeaturedDoctors";
import MedicalSpecializations from "@/components/Medicalspecializations";
import PatientSuccessStories from "@/components/PatientSuccessStories";
import PlatformStatistics from "@/components/Platformstatistics";
import WhyChooseUs from "@/components/WhyChooseUs";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Home | MediCare";
  }, []);
  return (
    <div>
       <Banner />
       <MedicalSpecializations />
       <FeaturedDoctors />
       <PlatformStatistics />
       <PatientSuccessStories />
       <WhyChooseUs />
    </div>
  );
}
