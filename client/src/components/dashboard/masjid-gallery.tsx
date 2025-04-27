import { Card, CardContent } from "@/components/ui/card";

export default function MasjidGallery() {
  return (
    <Card className="bg-white rounded-xl shadow-md mb-6">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Masjid Al-Hikmah</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="aspect-video rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f" 
              alt="Mosque interior" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-video rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1574246915327-8cf501d94757" 
              alt="Mosque interior" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-video rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1519817650390-64a93db51149" 
              alt="Mosque interior" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
