import Banner from "@/components/Banner";
import MedicalSpecializations from "@/components/Medicalspecializations";
import PlatformStatistics from "@/components/Platformstatistics";
import Image from "next/image";

export default function Home() {
  return (
    <div>
       <Banner />
       <MedicalSpecializations />
       <PlatformStatistics />
    </div>
  );
}
