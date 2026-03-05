import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

export default function ResourcesHeader() {
  
  return (
    <div className="w-full">
      <section className="bg-[#1B365D] w-full py-12 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4">
            Catalogue de ressources
          </h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl">
            Explorez notre bibliothèque complète de ressources pour améliorer vos relations humaines
          </p>
        </div>
      </section>

      <section className="w-full bg-[#F8FAFC] py-8 px-6 sm:px-12 lg:px-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row items-center gap-4">

            <Input
              isClearable
              className="w-full lg:max-w-md"
              placeholder="Rechercher une ressource..."
              startContent={
                <Search size={18} className="text-default-400 shrink-0" />
              }
              variant="bordered"
            />
            <div className="flex w-full gap-4 lg:w-auto flex-grow">
                <Input
                    readOnly
                    placeholder="Catégorie"
                    variant="bordered"
                    endContent={<ChevronDown size={18} className="text-default-400" />}
                    className="cursor-pointer"
                />
                <Input
                    readOnly
                    placeholder="Type de ressource"
                    variant="bordered"
                    endContent={<ChevronDown size={18} className="text-default-400" />}
                    className="cursor-pointer"
                />
            </div>

            <Button 
              variant="flat" 
              className="bg-white border border-gray-200 shadow-sm font-medium w-full lg:w-auto px-6 text-default-600"
              startContent={<SlidersHorizontal size={18} />}
            >
              Plus de filtres
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}