import Banner from "@/components/Banner";
import MedicalSpecializations from "@/components/Medicalspecializations";
import PatientSuccessStories from "@/components/PatientSuccessStories";
import PlatformStatistics from "@/components/Platformstatistics";
import WhyChooseUs from "@/components/WhyChooseUs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
       <Banner />
       <MedicalSpecializations />
       <PlatformStatistics />
       <PatientSuccessStories />
       <WhyChooseUs />
    </div>
  );
}
