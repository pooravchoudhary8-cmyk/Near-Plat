import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VirtualTryOn = ({ isOpen, onClose, productImage }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-4xl bg-card border border-border shadow-2xl p-6 rounded-2xl"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-background border border-border p-2 rounded-full hover:bg-foreground hover:text-background transition-colors"
          >
            <X size={24} />
          </button>

          <h2 className="font-display text-3xl mb-6 text-center">AR Virtual Try-On</h2>

          <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center border border-border">
            {!imgSrc ? (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  videoConstraints={{ facingMode: "user" }}
                />
                
                {/* Simulated AR Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
                  <img 
                    src={productImage} 
                    alt="AR Overlay" 
                    className="w-1/3 transform -translate-y-8 mix-blend-multiply drop-shadow-2xl filter brightness-50"
                  />
                  
                  {/* Face Guide lines */}
                  <div className="absolute inset-0 border-2 border-dashed border-primary/30 m-20 rounded-[100px]" />
                </div>
              </>
            ) : (
              <img src={imgSrc} alt="Captured Try-On" className="w-full h-full object-cover" />
            )}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            {!imgSrc ? (
              <button 
                onClick={capture}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
              >
                <Camera size={18} />
                Capture Look
              </button>
            ) : (
              <button 
                onClick={() => setImgSrc(null)}
                className="flex items-center gap-2 bg-muted text-foreground border border-border px-8 py-3 rounded-full font-body uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
              >
                <RefreshCw size={18} />
                Retake
              </button>
            )}
          </div>
          
          <p className="text-center text-xs text-muted-foreground mt-4">
            *This is a simulated AR try-on. Ensure your face aligns with the guide lines.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VirtualTryOn;
