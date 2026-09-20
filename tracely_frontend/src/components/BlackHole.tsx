import React from 'react';
import { motion } from 'framer-motion';

export const BlackHole = () => {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[800px] pointer-events-none flex items-center justify-center pt-20 z-0 rotate-180"
      style={{ 
        WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 75%, black 40%, transparent 80%)', 
        maskImage: 'radial-gradient(ellipse 60% 50% at 50% 75%, black 40%, transparent 80%)' 
      }}
    >

      {/* 1. Base Swirling Core (Video from Reflect) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-100 mix-blend-screen">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-110"
        >
          <source src="https://reflect.app/home/build/q-c3d7becf.webm" type="video/webm" />
        </video>
      </div>

      {/* 2. Static Glow Disk (Image from Reflect) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-90 mix-blend-screen scale-110 transform translate-y-[-5%]">
        <img
          src="https://reflect.app/home/build/q-44e26a19.png"
          alt=""
          className="w-full max-w-[1000px] object-contain"
        />
      </div>

      {/* 3. Orbiting Rings (CSS Animation) */}
      {/* Outer slow ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute w-[700px] h-[180px] rounded-[100%] border border-white/5"
        style={{ transformOrigin: 'center center' }}
      />

      {/* Inner medium ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="absolute w-[500px] h-[130px] rounded-[100%] border border-primary/10"
        style={{ transformOrigin: 'center center' }}
      />

      {/* Bright center accent line */}
      <div className="absolute w-[300px] h-[80px] rounded-[100%] border-t-[2px] border-white/40 blur-[2px] z-10 mix-blend-screen transform translate-y-[-10px]" />

      {/* 4. Foreground floating dust/stars (CSS animation) */}
      <motion.div
        animate={{ opacity: [0.1, 0.5, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] w-[500px] h-[120px] bg-gradient-to-t from-primary/0 via-primary/20 to-primary/0 blur-[20px] mix-blend-screen"
      />
    </div>
  );
};
