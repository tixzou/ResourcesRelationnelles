"use client";

import { Button } from "@heroui/button";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <section className="bg-[#1B365D] w-full py-6 px-6 sm:px-12 lg:px-24 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          <div className="flex flex-col gap-3 items-start text-left">
            <h1 className="text-white text-2xl sm:text-3xl font-semibold leading-tight">
              Cultivons ensemble la qualité de nos relations
            </h1>
            
            <p className="text-blue-100 text-sm sm:text-base max-w-xl">
              (RE)Sources Relationnelles est une plateforme institutionnelle qui vous accompagne 
              dans l'amélioration de vos relations humaines.
            </p>
            
            <div className="mt-2">
              <Button 
                className="bg-[#FF7A00] text-white font-semibold px-5 h-10 rounded-lg text-xs sm:text-sm"
                endContent={<span>→</span>}
              >
                Découvrir les ressources
              </Button>
            </div>
          </div>

          <div className="relative w-full h-40 sm:h-48 md:h-56 hidden md:block">
            <Image
              src="/images.jpg" 
              alt="Groupe de personnes"
              fill
              className="object-cover rounded-2xl shadow-lg"
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
}