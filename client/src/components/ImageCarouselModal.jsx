import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { X } from "lucide-react"; // Recommended for a clean UI

const ImageCarouselModal = ({
  mainImage,
  subImages,
  open,
  onOpenChange,
}) => {
  const allImages = [
    ...(mainImage ? [mainImage] : []),
    ...(Array.isArray(subImages)
      ? subImages.map((img) =>
          typeof img === "string" ? img.trim() : img?.url
        )
      : []),
  ].filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="
          /* Size & Shape */
          max-w-[95vw] md:max-w-7xl h-[90vh] flex flex-col p-0 overflow-hidden
          
          /* Smooth Top-Down Animation */
          duration-500 ease-out
          data-[state=open]:animate-in 
          data-[state=closed]:animate-out 
          data-[state=closed]:fade-out-0 
          data-[state=open]:fade-in-0 
          data-[state=closed]:zoom-out-95 
          data-[state=open]:zoom-in-95 
          data-[state=closed]:slide-out-to-top-[100%] 
          data-[state=open]:slide-in-from-top-[100%] 
          fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
        "
      >
        <DialogHeader className="p-6 border-b bg-white sticky top-0 z-10 flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-semibold">Photo Gallery</DialogTitle>
          {/* Custom Close Button for better UX */}
          <button 
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </DialogHeader>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {allImages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              No images available
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {allImages.map((url, index) => (
                <div 
                  key={index} 
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-200"
                >
                  <img
                    src={url}
                    alt={`Hotel image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCarouselModal;