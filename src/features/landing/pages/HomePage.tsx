import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

// Asset paths (Ensure these point to your actual local images)
const IMG_ASSETS = {
  hero: "src/shared/pictures/h3.jpg",
  lookbook1: "src/shared/pictures/h5.jpg",
  lookbook2: "src/shared/pictures/h6.jpg",
  craft: "src/shared/pictures/R.jpg",
};

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Inject luxury serif font for the "Cormorant Garamond" look
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <div className="bg-[#050505] text-white selection:bg-white selection:text-black w-full min-h-screen overflow-x-hidden p-0 m-0 font-light">
      {/* ================= SECTION 1: HERO FULL SCREEN ================= */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={IMG_ASSETS.hero}
            className="w-full h-full object-cover brightness-[0.35]"
            alt="Cinematic Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />
        </motion.div>

        <div className="relative z-10 text-center w-full">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-[18vw] leading-none italic"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            True Look
          </motion.h1>
          <p className="text-[10px] tracking-[1.5em] uppercase mt-4 opacity-30 font-sans">
            Timeless Vision • Modern Luxury
          </p>
        </div>
      </section>

      {/* ================= SECTION 2: PHILOSOPHY FULL WIDTH ================= */}
      <section className="relative min-h-[80vh] w-full flex items-center bg-[#050505] py-32 px-10 md:px-20">
        <div className="w-full">
          <motion.h2
            whileInView={{ opacity: [0, 1], y: [30, 0] }}
            viewport={{ once: true }}
            className="text-[7vw] font-light italic leading-tight mb-16"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Vision defines <br />{" "}
            <span className="not-italic opacity-40">your aura.</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-white/40 text-xl font-light max-w-6xl">
            <p className="leading-relaxed">
              True Look Eyewear was born with a mission to redefine
              sophistication. Each design is a fusion of premium Titanium and
              minimalist architectural inspiration.
            </p>
            <p className="leading-relaxed">
              We do not mass produce. Every frame undergoes 48 hours of
              artisanal hand-crafting to ensure absolute comfort and a bespoke
              fit for your face.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: ASYMMETRIC GRID FULL SCREEN ================= */}
      <section className="w-full bg-black">
        {/* Gap-0 ensures the images touch the edges of the screen */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-0 items-stretch">
          {/* Left Item */}
          <motion.div
            className="relative h-[100vh] w-full overflow-hidden group border-r border-white/5"
            whileInView={{ opacity: [0, 1] }}
            viewport={{ once: true }}
          >
            <img
              src={IMG_ASSETS.lookbook1}
              className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
              alt="A-Series Collection"
            />
            <div
              className="absolute bottom-12 left-12 italic text-[5vw] font-serif leading-none z-20"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              A-Series 2026
            </div>
          </motion.div>

          {/* Right Item - Offset vertically for a cinematic rhythm */}
          <motion.div
            className="relative h-[100vh] w-full overflow-hidden group md:mt-[20vh]"
            whileInView={{ opacity: [0, 1] }}
            viewport={{ once: true }}
          >
            <img
              src={IMG_ASSETS.lookbook2}
              className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
              alt="Gold Tint Edition"
            />
            <div
              className="absolute bottom-12 left-12 italic text-[5vw] font-serif leading-none z-20"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Gold Tint Edition
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SECTION 4: CRAFTSMANSHIP FULL BACKGROUND ================= */}
      <section className="relative h-screen w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={IMG_ASSETS.craft}
            className="w-full h-full object-cover opacity-20"
            alt="Craftsmanship Details"
          />
        </div>
        <div className="relative z-10 px-10 md:px-24 w-full">
          <h2
            className="text-[10vw] italic font-serif leading-none mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Meticulous <br /> Craft.
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="group flex items-center gap-6 border border-white/20 px-12 py-6 text-[10px] tracking-[0.5em] uppercase hover:bg-white hover:text-black transition-all duration-700"
          >
            Explore Collection
            <div className="w-8 h-[1px] bg-white group-hover:bg-black transition-all duration-500" />
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-32 border-t border-white/5 text-center relative overflow-hidden bg-[#050505]">
        {/* Giant Watermark Background Text */}
        <h2 className="text-[20vw] opacity-[0.02] font-serif italic absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
          TRUE LOOK
        </h2>

        <div className="relative z-10 space-y-12">
          <div className="flex justify-center gap-12 text-[10px] tracking-[0.5em] uppercase text-white/30">
            <a href="#" className="hover:text-white transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-white transition-colors">
              TikTok
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Vogue Journal
            </a>
          </div>
          <p className="text-[9px] text-white/10 tracking-[0.3em] uppercase italic font-sans">
            © 2026 True Look Eyewear. Engineered for the Visionaries.
          </p>
        </div>
      </footer>
    </div>
  );
}
