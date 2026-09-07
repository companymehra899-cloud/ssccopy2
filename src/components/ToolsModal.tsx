import React, { useState } from 'react';
import { calculateAge } from '../utils/helpers';
import { Calculator, Image, X, Check } from 'lucide-react';

interface ToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ToolsModal: React.FC<ToolsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'age' | 'photo'>('age');

  // Age State
  const [dob, setDob] = useState('2000-01-01');
  const [cutoffDate, setCutoffDate] = useState('2026-08-01');
  const [ageResult, setAgeResult] = useState<{ years: number; months: number; days: number } | null>(
    calculateAge('2000-01-01', '2026-08-01')
  );

  // Photo State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number; sizeKb: number } | null>(null);

  const handleCalculateAge = () => {
    const res = calculateAge(dob, cutoffDate);
    setAgeResult(res);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          setImageSize({
            width: img.width,
            height: img.height,
            sizeKb: Math.round(file.size / 1024),
          });
        };
        img.src = event.target?.result as string;
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border-2 border-[#b22222] shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-[#b22222] text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-300" />
            <h3 className="font-extrabold text-base tracking-wide uppercase">Candidate Utility Tools</h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-amber-300 font-bold text-lg cursor-pointer">
            ✕
          </button>
        </div>

        {/* Modal Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-100 text-xs font-bold">
          <button
            onClick={() => setActiveTab('age')}
            className={`flex-1 py-2.5 text-center cursor-pointer ${
              activeTab === 'age'
                ? 'bg-white text-red-900 border-b-2 border-red-700 font-black'
                : 'text-gray-600 hover:text-red-800'
            }`}
          >
            🎂 Age Calculator (Cutoff Date)
          </button>
          <button
            onClick={() => setActiveTab('photo')}
            className={`flex-1 py-2.5 text-center cursor-pointer ${
              activeTab === 'photo'
                ? 'bg-white text-red-900 border-b-2 border-red-700 font-black'
                : 'text-gray-600 hover:text-red-800'
            }`}
          >
            🖼️ Photo & Signature Dimension Inspector
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-xs text-gray-800">
          {activeTab === 'age' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-[11px]">
                Calculate your exact age in years, months, and days for Sarkari application form cutoffs.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Date of Birth (DOB):</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded text-xs font-semibold focus:outline-none focus:border-red-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Age Cutoff Date:</label>
                  <input
                    type="date"
                    value={cutoffDate}
                    onChange={(e) => setCutoffDate(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded text-xs font-semibold focus:outline-none focus:border-red-700"
                  />
                </div>
              </div>

              <button
                onClick={handleCalculateAge}
                className="w-full bg-[#b22222] hover:bg-red-800 text-white font-extrabold py-2 rounded text-xs cursor-pointer shadow-xs"
              >
                Calculate Age
              </button>

              {ageResult && (
                <div className="bg-amber-50 border-2 border-amber-400 p-3 rounded text-center text-amber-950 font-bold">
                  <p className="text-xs text-amber-800 uppercase font-extrabold">Your Age as on {cutoffDate}:</p>
                  <p className="text-lg text-red-900 font-black mt-1">
                    {ageResult.years} Years, {ageResult.months} Months, {ageResult.days} Days
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'photo' && (
            <div className="space-y-3">
              <p className="text-gray-600 text-[11px]">
                Upload candidate passport photo or signature image to check file size (KB) and width × height pixel dimensions required for forms (e.g. 20KB-50KB).
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-extrabold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
              />

              {imagePreview && imageSize && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded text-center space-y-2">
                  <img
                    src={imagePreview}
                    alt="Candidate Upload"
                    className="h-32 object-contain mx-auto border border-gray-300 rounded shadow-xs"
                  />

                  <div className="text-xs font-bold text-gray-800 space-y-0.5">
                    <p>Dimensions: <span className="text-red-700">{imageSize.width} × {imageSize.height} px</span></p>
                    <p>File Size: <span className="text-blue-800">{imageSize.sizeKb} KB</span></p>
                    <p className="text-[10px] text-gray-500 font-normal">
                      Standard Sarkari photo requirement: 20 KB to 50 KB (3.5cm x 4.5cm).
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
