import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import kathakali from "../images/kathakali-face.png";

const KathakaliAssistant: React.FC = () => {
  const [isJumping, setIsJumping] = useState(false);

  // Motion values for cursor position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for movement
  const springConfig = { damping: 25, stiffness: 150 };
  
  // Map mouse position to movement and rotation
  const x = useSpring(useTransform(mouseX, [-window.innerWidth / 2, window.innerWidth / 2], [-40, 40]), springConfig);
  const y = useSpring(useTransform(mouseY, [-window.innerHeight / 2, window.innerHeight / 2], [-40, 40]), springConfig);
  const rotateX = useSpring(useTransform(mouseY, [-window.innerHeight / 2, window.innerHeight / 2], [45, -45]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-window.innerWidth / 2, window.innerWidth / 2], [-45, 45]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleClick = () => {
    if (!isJumping) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 1000);
    }
  };

  return (
    <div 
      className="flex flex-col justify-center items-center py-12 relative z-10 select-none"
      style={{ perspective: "600px" }}
    >

              {/* Static Tagline */}
      <div className="text-center z-0">
        <h3 className="text-4xl font-black text-slate-800 font-serif tracking-wide mb-2 drop-shadow-sm">
          Discover the Soul of India
        </h3>
        <p className="text-orange-600 font-bold text-lg uppercase tracking-widest">
          Your Cultural Companion
        </p>
        <br />
        <br />
        <br />
      </div>

      <motion.div
        className="relative w-72 mb-8"
        style={{
          x,
          y,
          rotateX,
          rotateY,
        }}
      >
        <motion.div
          className="cursor-pointer flex flex-col items-center"
          animate={isJumping ? { y: -60, rotateY: 360, scale: 1.1 } : { y: 0, rotateY: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
        >
          {/* Face image */}
          <img
            src={kathakali}
            alt="Kathakali Assistant"
            className="w-full drop-shadow-2xl mix-blend-multiply"
            draggable={false}
          />
        </motion.div>
      </motion.div>

    </div>
  );
};

export default KathakaliAssistant;
