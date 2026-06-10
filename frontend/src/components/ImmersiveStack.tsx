import { useState, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Home } from '../pages/Home';
import { CameraUpload } from './CameraUpload';
import { Dictionary } from '../pages/Dictionary';
import { useNavigate, useLocation } from 'react-router-dom';

export const ImmersiveStack = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAnimating = useRef(false);

  const getLayerFromPath = (path: string) => {
    if (path === '/camera') return 1;
    if (path === '/dictionary') return 2;
    return 0;
  };

  const [layer, setLayer] = useState(() => getLayerFromPath(location.pathname));

  const targetLayer = getLayerFromPath(location.pathname);
  if (layer !== targetLayer) {
    setLayer(targetLayer);
  }

  const changeLayer = (newLayer: number) => {
    if (newLayer === 0) navigate('/');
    if (newLayer === 1) navigate('/camera');
    if (newLayer === 2) navigate('/dictionary');
    setLayer(newLayer);
    
    isAnimating.current = true;
    setTimeout(() => { isAnimating.current = false; }, 800);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isAnimating.current) return;

    if (layer === 2) {
      const dictContainer = document.getElementById('dictionary-scroll-area');
      if (e.deltaY < -30 && dictContainer && dictContainer.scrollTop <= 0) {
        changeLayer(1);
      }
      return; 
    }

    if (e.deltaY > 40 && layer < 2) {
      changeLayer(layer + 1);
    } else if (e.deltaY < -40 && layer > 0) {
      changeLayer(layer - 1);
    }
  };

  const variants: Variants = {
    flownPast: { scale: 1.5, opacity: 0, filter: 'blur(10px)', zIndex: 20 },
    active: { scale: 1, opacity: 1, filter: 'blur(0px)', zIndex: 10 },
    background: { scale: 0.85, opacity: 0.2, filter: 'blur(12px)', zIndex: 5 },
    hidden: { scale: 0.7, opacity: 0, zIndex: 0 }
  };

  const getStatus = (index: number) => {
    if (index === layer) return 'active';
    if (index === layer + 1) return 'background';
    if (index < layer) return 'flownPast';
    return 'hidden'; 
  };

  const springConfig = { type: 'spring' as const, stiffness: 300, damping: 30 };

  return (
    <div 
      className="relative w-full h-[85vh] overflow-hidden"
      onWheel={handleWheel}
    >
      <motion.div
        className="absolute inset-0 w-full h-full flex justify-center items-start"
        variants={variants}
        initial={false}
        animate={getStatus(0)}
        transition={springConfig}
        style={{ pointerEvents: getStatus(0) === 'active' ? 'auto' : 'none' }}
      >
        <div className="w-full h-full overflow-hidden">
          <Home />
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 w-full h-full flex justify-center items-start"
        variants={variants}
        initial={false}
        animate={getStatus(1)}
        transition={springConfig}
        style={{ pointerEvents: getStatus(1) === 'active' ? 'auto' : 'none' }}
      >
        {(getStatus(1) === 'active' || getStatus(1) === 'background' || getStatus(1) === 'flownPast') && (
          <div className="w-full h-full overflow-hidden">
            <CameraUpload />
          </div>
        )}
      </motion.div>

      <motion.div
        className="absolute inset-0 w-full h-full flex justify-center items-start"
        variants={variants}
        initial={false}
        animate={getStatus(2)}
        transition={springConfig}
        style={{ pointerEvents: getStatus(2) === 'active' ? 'auto' : 'none' }}
      >
        <div 
          id="dictionary-scroll-area" 
          className={`w-full h-full ${getStatus(2) === 'active' ? 'overflow-y-auto custom-scrollbar' : 'overflow-hidden'}`}
        >
          <Dictionary />
        </div>
      </motion.div>
    </div>
  );
};