import { useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState, Suspense } from "react";
import Lenis from "@studio-freight/lenis";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Float,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  Html,
} from "@react-three/drei";

const ASSETS = {
  hero: "src/shared/pictures/h3.jpg",
  lookbook1: "src/shared/pictures/h5.jpg",
  lookbook2: "src/shared/pictures/h6.jpg",
  mat1: "src/shared/pictures/h10.jpg",
  mat2: "src/shared/pictures/h11.jpg",
  model1: "/models/k1.glb",
};

// --- COMPONENT SHOWCASE 1 MODEL DUY NHẤT ---
function EyewearShowcase({ scrollProgress }: { scrollProgress: any }) {
  const m1 = useGLTF(ASSETS.model1);
  const ref1 = useRef<any>(null);

  // Kích thước to hơn
  const MAX_SCALE = 0.85;

  const scale1 = useTransform(scrollProgress, [0, 1], [MAX_SCALE, MAX_SCALE]);
  const y1 = useTransform(scrollProgress, [0, 1], [0, 0]);

  // Xoay 4 vòng tròn (Math.PI * 8)
  const rotY1 = useTransform(scrollProgress, [0, 1], [0, Math.PI * 8]);
  const rotX = useTransform(scrollProgress, [0, 0.5, 1], [0.1, -0.2, 0.1]);

  useFrame(() => {
    if (ref1.current) {
      ref1.current.scale.setScalar(scale1.get());
      ref1.current.position.y = y1.get();
      ref1.current.rotation.y = rotY1.get();
      ref1.current.rotation.x = rotX.get();
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      <primitive ref={ref1} object={m1.scene} />
    </group>
  );
}

useGLTF.preload(ASSETS.model1);

export default function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { scrollYProgress: globalScroll } = useScroll();

  const section3DRef = useRef<HTMLElement>(null);
  const { scrollYProgress: sectionScroll } = useScroll({
    target: section3DRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "auto";
    }, 2500);

    const lenis = new Lenis({ duration: 1.4, smoothWheel: true });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      clearTimeout(timer);
      lenis.destroy();
      document.body.style.overflow = "auto";
    };
  }, []);

  // --- TIMELINE TEXT (Đã chia đều 3 nhịp cuộn, xuất hiện sớm và rõ ràng hơn) ---

  // Text 1 (0% -> 30%)
  const text1Op = useTransform(
    sectionScroll,
    [0, 0.05, 0.25, 0.3],
    [0, 1, 1, 0],
  );
  const text1Y = useTransform(
    sectionScroll,
    [0, 0.05, 0.25, 0.3],
    [30, 0, 0, -30],
  );

  // Text 2 (35% -> 65%) - Obsidian Black
  const text2Op = useTransform(
    sectionScroll,
    [0.35, 0.4, 0.6, 0.65],
    [0, 1, 1, 0],
  );
  const text2Y = useTransform(
    sectionScroll,
    [0.35, 0.4, 0.6, 0.65],
    [30, 0, 0, -30],
  );

  // Text 3 (70% -> 95%) - Zeiss Vision
  const text3Op = useTransform(
    sectionScroll,
    [0.7, 0.75, 0.9, 0.95],
    [0, 1, 1, 0],
  );
  const text3Y = useTransform(
    sectionScroll,
    [0.7, 0.75, 0.9, 0.95],
    [30, 0, 0, -30],
  );

  return (
    <div className="bg-background text-foreground w-full overflow-x-hidden font-light transition-colors duration-500 selection:bg-foreground selection:text-background">
      {/* PRELOADER */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            exit={{ y: "-100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center text-foreground"
          >
            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, letterSpacing: "0.8em" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-2xl md:text-4xl font-serif italic uppercase ml-[0.8em]"
            >
              True Look
            </motion.div>
            <div className="w-32 h-[1px] bg-foreground/20 mt-8 overflow-hidden relative">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-foreground"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        <motion.img
          style={{ scale: useTransform(globalScroll, [0, 0.3], [1, 1.1]) }}
          src={ASSETS.hero}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.5] dark:brightness-[0.25]"
          alt=""
        />
        <h1 className="relative z-10 text-[15vw] font-serif italic text-white drop-shadow-2xl">
          True Look
        </h1>
      </section>

      {/* 2. MARQUEE */}
      <div className="py-8 border-y border-border bg-muted/10 overflow-hidden flex">
        <motion.div
          animate={{ x: [0, -1500] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-32 whitespace-nowrap text-[10px] uppercase tracking-[0.5em] opacity-40 font-serif italic"
        >
          {Array(5)
            .fill(
              "Featured in Vogue • GQ Paris • Hypebeast • L'Officiel • Highsnobiety • ",
            )
            .map((text, i) => (
              <span key={i}>{text}</span>
            ))}
        </motion.div>
      </div>

      {/* 3. SOLO 3D SHOWCASE - Đã trả về 400vh để giãn text đều hơn */}
      <section
        ref={section3DRef}
        style={{ height: "400vh" }}
        className="relative w-full bg-background transition-colors duration-500"
      >
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Backdrop Blob - Scale giảm xuống 1.5 */}
          <div className="absolute w-full h-full flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
            <motion.div
              style={{
                rotate: useTransform(sectionScroll, [0, 1], [0, 360]),
                scale: 1.5,
              }}
              className="w-[85vh] h-[85vh]"
            >
              <svg
                viewBox="0 0 200 200"
                className="fill-current text-foreground"
              >
                <path
                  d="M47.5,-76.3C59.6,-69.1,66.4,-52.4,72.1,-36.8C77.7,-21.2,82.2,-6.6,80.1,7.4C78,21.4,69.2,34.8,59.3,46.5C49.4,58.2,38.3,68.2,25,73.8C11.7,79.4,-3.8,80.7,-18.9,77.5C-34,74.3,-48.7,66.6,-59.6,55.5C-70.5,44.4,-77.6,30,-80.7,14.8C-83.8,-0.4,-82.9,-16.4,-76.4,-30.5C-69.9,-44.6,-57.8,-56.8,-43.9,-63.3C-30,-69.8,-15,-70.6,1.4,-72.7C17.7,-74.8,35.4,-83.4,47.5,-76.3Z"
                  transform="translate(100 100)"
                />
              </svg>
            </motion.div>
          </div>

          <div className="absolute inset-0 z-10 pointer-events-none">
            <Canvas dpr={[1, 2]} gl={{ alpha: true }}>
              <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={35} />
              <ambientLight intensity={2} />
              <directionalLight position={[0, 5, 10]} intensity={4} />
              <Environment preset="city" />
              <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <Suspense fallback={null}>
                  <EyewearShowcase scrollProgress={sectionScroll} />
                </Suspense>
              </Float>
              <ContactShadows
                position={[0, -1.5, 0]}
                opacity={0.3}
                scale={15}
                blur={3}
                far={4}
              />
            </Canvas>
          </div>

          {/* FLOAT TEXT 1 */}
          <div className="absolute z-20 w-full h-full flex items-center justify-center pointer-events-none">
            <motion.div
              style={{ opacity: text1Op, y: text1Y }}
              className="absolute text-center flex flex-col items-center"
            >
              <p className="text-[10px] uppercase tracking-[0.6em] mb-6 opacity-50 drop-shadow-md">
                Edition 1
              </p>
              <h2 className="text-[8vw] md:text-[6vw] font-serif italic leading-none drop-shadow-lg">
                Pure Titanium
              </h2>
              <p className="mt-8 text-muted-foreground max-w-md text-sm font-sans tracking-widest uppercase leading-loose border-t border-border pt-8 drop-shadow-md">
                Chế tác từ nguyên khối hợp kim hàng không. Nhẹ hơn không khí,
                vững chãi hơn thời gian.
              </p>
            </motion.div>
          </div>

          {/* FLOAT TEXT 2 */}
          <div className="absolute z-20 w-full h-full flex items-center justify-center pointer-events-none">
            <motion.div
              style={{ opacity: text2Op, y: text2Y }}
              className="absolute text-center flex flex-col items-center"
            >
              <p className="text-[10px] uppercase tracking-[0.6em] mb-6 opacity-50 drop-shadow-md">
                Edition 2
              </p>
              <h2 className="text-[8vw] md:text-[6vw] font-serif italic leading-none drop-shadow-lg">
                Obsidian Black
              </h2>
              <p className="mt-8 text-muted-foreground max-w-md text-sm font-sans tracking-widest uppercase leading-loose border-t border-border pt-8 drop-shadow-md">
                Bóng đêm huyền bí, quyền lực vô song. Cắt gọt tỉ mỉ từ những
                khối vật liệu nguyên bản.
              </p>
            </motion.div>
          </div>

          {/* FLOAT TEXT 3 */}
          <div className="absolute z-20 w-full h-full flex items-center justify-center pointer-events-none">
            <motion.div
              style={{ opacity: text3Op, y: text3Y }}
              className="absolute text-center flex flex-col items-center"
            >
              <p className="text-[10px] uppercase tracking-[0.6em] mb-6 opacity-50 drop-shadow-md">
                Edition 3
              </p>
              <h2 className="text-[8vw] md:text-[6vw] font-serif italic leading-none drop-shadow-lg">
                Zeiss Vision
              </h2>
              <p className="mt-8 text-muted-foreground max-w-md text-sm font-sans tracking-widest uppercase leading-loose border-t border-border pt-8 drop-shadow-md">
                Thấu kính quang học đỉnh cao thế giới. Bảo vệ toàn diện, mở rộng
                tầm nhìn của người kiến tạo.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. MATERIALS */}
      <section className="py-60 border-t border-border bg-muted/10 relative z-30">
        <div className="max-w-screen-2xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 gap-32 items-center">
          <div className="space-y-16">
            <h2 className="text-7xl md:text-8xl font-serif italic leading-[0.9]">
              Art of <br /> Engineering.
            </h2>
            <div className="flex gap-20 pt-12 border-t border-border/50">
              <div>
                <p className="text-5xl font-serif mb-2">12g</p>
                <p className="text-[9px] uppercase tracking-widest opacity-40 italic">
                  Ultralight
                </p>
              </div>
              <div>
                <p className="text-5xl font-serif mb-2">Zeiss</p>
                <p className="text-[9px] uppercase tracking-widest opacity-40 italic">
                  Optics
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 h-[75vh]">
            <div className="rounded-sm overflow-hidden bg-muted shadow-2xl">
              <img
                src={ASSETS.mat1}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                alt=""
              />
            </div>
            <div className="rounded-sm overflow-hidden mt-24 bg-muted shadow-2xl">
              <img
                src={ASSETS.mat2}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. GALLERY */}
      <section className="py-40 px-10 border-t border-border bg-background relative z-30">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
          <motion.div
            whileInView={{ opacity: [0, 1], y: [40, 0] }}
            viewport={{ once: true }}
          >
            <div className="aspect-[3/4] overflow-hidden rounded-sm bg-muted shadow-2xl">
              <img
                src={ASSETS.lookbook1}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2.5s]"
                alt=""
              />
            </div>
            <h3 className="mt-8 text-3xl font-serif italic opacity-70">
              A-Series 2026
            </h3>
          </motion.div>
          <motion.div
            whileInView={{ opacity: [0, 1], y: [40, 0] }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="md:mt-48"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-sm bg-muted shadow-2xl">
              <img
                src={ASSETS.lookbook2}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2.5s]"
                alt=""
              />
            </div>
            <h3 className="mt-8 text-3xl font-serif italic opacity-70">
              Obsidian Edition
            </h3>
          </motion.div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-40 text-center border-t border-border bg-muted/20 relative overflow-hidden z-30">
        <h2 className="text-[25vw] opacity-[0.02] font-serif italic absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none uppercase">
          TRUE LOOK
        </h2>
        <div className="relative z-10 space-y-12">
          <button
            onClick={() => navigate("/products")}
            className="border border-primary px-16 py-6 uppercase tracking-[0.5em] text-[10px] hover:bg-foreground hover:text-background transition-all duration-700 bg-transparent"
          >
            Enter Collection
          </button>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-30 italic pt-10">
            © 2026 True Look Eyewear. Engineered for the Visionaries.
          </p>
        </div>
      </footer>
    </div>
  );
}
