'use client';

import React from 'react';
import { Flame, Sparkles, MapPin } from 'lucide-react';
import Link from 'next/link';

const AnimatedCTASection = () => {
  const lineWrapperTops = ['top-[15%]', 'top-[35%]', 'top-[55%]', 'top-[75%]', 'top-[90%]'];

  return (
    <>
      <GlobalStylesAndKeyframes />
      {/* Main section container: Enhanced with warm radial fires and transparent background blend */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-transparent text-white font-sans overflow-hidden p-6 sm:p-12 md:p-16 rounded-[3rem] my-8 mx-4 border border-brand-ash/20 shadow-[0_25px_60px_rgba(250,177,21,0.02)]">
        
        {/* Soft Organic Background Glows to replace harsh solid black */}
        <div className="absolute inset-0 bg-radial-at-t from-brand-fire/15 via-transparent to-transparent opacity-60 z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 right-1/4 h-[300px] bg-gradient-radial from-amber-500/10 to-transparent blur-3xl opacity-50 z-0 pointer-events-none" />

        {/* Brand-aligned Grid Background with orange-gold wireframe embers */}
        <div
          className="absolute inset-0 w-full h-full bg-[linear-gradient(rgba(250,177,21,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(250,177,21,0.05)_1px,transparent_1px)] bg-[length:60px_60px] animate-[gridMove_25s_linear_infinite] z-0 opacity-75"
        />

        {/* Animated Background Ember Line Sweeps */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-[1] opacity-50 pointer-events-none">
          {lineWrapperTops.map((topClass, index) => (
            <div key={index} className={`absolute w-full h-[80px] ${topClass}`}>
              <div className="w-full h-[1px] relative overflow-hidden bg-brand-fire/5">
                <div
                  className={`absolute top-0 w-2/3 h-full animate-[lineMove_6s_linear_infinite] ${
                    index % 2 !== 0 ? '[animation-direction:reverse] [animation-delay:3s]' : ''
                  }`}
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(250,177,21,0.4) 30%, rgba(255,215,0,0.6) 50%, rgba(250,177,21,0.4) 70%, transparent 100%)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Corner Brackets / Crafted Borders: custom styled with curves for artisan metallurgical feel */}
        <div className="hidden md:block absolute top-[12%] bottom-[12%] left-[8%] right-[8%] border border-brand-fire/15 rounded-[3rem] pointer-events-none z-[2]">
          <svg
            className="absolute -top-4 -left-4 w-[140px] h-[70px] animate-[cornerLineAnimation_8s_linear_infinite] text-brand-fire opacity-70"
            viewBox="0 0 120 60"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="60"
          >
            <path d="M120 0 L20 0 Q0 0 0 20 L0 60" />
          </svg>
          <svg
            className="absolute -bottom-4 -right-4 w-[140px] h-[70px] transform rotate-180 animate-[cornerLineAnimation_8s_linear_infinite] [animation-delay:4s] text-brand-fire opacity-70"
            viewBox="0 0 120 60"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="60"
          >
            <path d="M120 0 L20 0 Q0 0 0 20 L0 60" />
          </svg>
        </div>

        {/* Main Content inside a beautifully rounded and responsive glassmorphic plate */}
        <div className="relative text-center max-w-2xl z-[10] px-8 py-10 rounded-[3rem] bg-[#1a1512]/30 backdrop-blur-2xl border border-brand-ash/30 shadow-[0_25px_60px_rgba(0,0,0,0.25)] animate-fade-in flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-brand-fire/10 border border-brand-fire/20 text-xs text-brand-fire font-semibold tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5 text-brand-fire animate-pulse" />
            La Fuerza del Acero Peruano
          </div>

          <h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-extrabold leading-tight mb-6 uppercase tracking-wide">
            ¿Listo para dominar 
            <br />
            <span
              className="inline-block pb-1 font-black animate-[gradientShift_4s_ease-in-out_infinite_alternate]"
              style={{
                backgroundImage: 'linear-gradient(45deg, #fab115, #f97316, #ffd700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              EL ARTE DE LAS BRASAS?
            </span>
          </h2>
          
          <p className="text-gray-300 font-sans text-sm sm:text-base leading-relaxed mb-8 max-w-lg font-medium">
            Nuestros grills de fierro pesado y acero inoxidable están diseñados científicamente para mantener el calor perfecto. Invierte en una parrilla robusta hecha para durar generaciones.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center">
            <a
              href="https://wa.me/51997444846"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 py-3 px-8 bg-brand-fire text-white no-underline rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(250,177,21,0.25)] active:translate-y-0 text-shadow-sm cursor-pointer"
            >
              <Flame className="w-4 h-4 fill-white" />
              Diseñar Mi Parrilla
            </a>
            
            <a
              href="#catalog"
              className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 py-3 px-8 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold text-sm tracking-widest uppercase border border-white/10 transition-all duration-300 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-brand-fire" />
              Ver Modelos Premium
            </a>
          </div>

          <div className="mt-8 flex items-center gap-6 justify-center text-xs text-gray-400 font-mono">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-brand-fire" /> Lima, Perú</span>
            <span>•</span>
            <span className="text-brand-fire font-bold">100% Fierro Pesado</span>
          </div>
        </div>
      </section>
    </>
  );
};

// Component to inject global styles and keyframes
const GlobalStylesAndKeyframes = () => (
  <style jsx global>{`
    @keyframes gradientShift {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(25deg); }
    }
    @keyframes lineMove {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes cornerLineAnimation {
      0% { stroke-dashoffset: 0; }
      25% { stroke-dashoffset: 120; }
      50% { stroke-dashoffset: 240; }
      75% { stroke-dashoffset: 360; }
      100% { stroke-dashoffset: 480; }
    }
    @keyframes gridMove {
      0% { background-position: 0 0; }
      100% { background-position: 60px 60px; }
    }
  `}</style>
);

export default function CtaPage() {
  return (
    <div className="bg-transparent py-2">
      <AnimatedCTASection />
    </div>
  );
}
