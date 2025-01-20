
import { X } from 'lucide-react';
import { Division } from '../types/division';
import { ImageCarousel } from './ImageCarousel';

interface DivisionModalProps {
  division: Division;
  onClose: () => void;
}

export function DivisionModal({ division, onClose }: DivisionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <division.icon className="h-12 w-12 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">{division.name}</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <ImageCarousel images={division.images} />
          
          <div className="mt-6 space-y-4">
            <p className="text-gray-300">{division.description}</p>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Key Features</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {division.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}