
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, useMemo, Suspense } from "react";
import Lenis from "@studio-freight/lenis";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Clone,
  Float,
  Environment,
  ContactShadows,
  PerspectiveCamera,
} from "@react-three/drei";
import { Box3, Vector3 } from "three";
import heroImage from "@/shared/pictures/h3.jpg";
import lookbook1Image from "@/shared/pictures/h5.jpg";
import lookbook2Image from "@/shared/pictures/h6.jpg";
import material1Image from "@/shared/pictures/h10.jpg";
import material2Image from "@/shared/pictures/h11.jpg";

const ASSETS = {
  hero: heroImage,
  lookbook1: lookbook1Image,
  lookbook2: lookbook2Image,
  mat1: material1Image,
  mat2: material2Image,
  model1: "/models/k1.glb",
  model2: "/models/k7.glb", // Gamot 02
  model3: "/models/k6.glb", // Goxx 02
  model4: "/models/k8.glb", // Manifesto 02
};

useGLTF.preload(ASSETS.model1);
useGLTF.preload(ASSETS.model2);
useGLTF.preload(ASSETS.model3);
useGLTF.preload(ASSETS.model4);

function EyewearShowcase({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  const m1 = useGLTF(ASSETS.model1);
  const m2 = useGLTF(ASSETS.model2);
  const m3 = useGLTF(ASSETS.model3);
  const m4 = useGLTF(ASSETS.model4);

  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  const getModelTransform = (scene: any) => {
    scene.updateMatrixWorld(true);
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const fitScale = 2.2 / maxDim;
    return { center, fitScale };
  };

  const t1 = useMemo(() => getModelTransform(m1.scene), [m1.scene]);
  const t2 = useMemo(() => getModelTransform(m2.scene), [m2.scene]);
  const t3 = useMemo(() => getModelTransform(m3.scene), [m3.scene]);
  const t4 = useMemo(() => getModelTransform(m4.scene), [m4.scene]);

  const stackRef = useRef<any>(null);
  const groups = [
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
  ];

  const MAX_SCALE = 0.85;
  const STACK_GAP = 5.0;

  const yOffsets = useMemo(
    () => [0, -STACK_GAP, -STACK_GAP * 2, -STACK_GAP * 3],
    [],
  );

  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  const smoothStep = (t: number) => {
    const c = clamp01(t);
    return c * c * (3 - 2 * c);
  };

  useFrame(() => {
    const p = Number(smoothProgress.get());

    const shifts = [0, STACK_GAP, STACK_GAP * 2, STACK_GAP * 3];

    let stackY = 0;
    if (p < 0.15) stackY = shifts[0];
    else if (p < 0.25) stackY = shifts[1] * smoothStep((p - 0.15) / 0.1);
    else if (p < 0.4) stackY = shifts[1];
    else if (p < 0.5)
      stackY =
        shifts[1] + (shifts[2] - shifts[1]) * smoothStep((p - 0.4) / 0.1);
    else if (p < 0.65) stackY = shifts[2];
    else if (p < 0.75)
      stackY =
        shifts[2] + (shifts[3] - shifts[2]) * smoothStep((p - 0.65) / 0.1);
    else stackY = shifts[3];

    if (stackRef.current) stackRef.current.position.y = stackY;

    const rx = 0.08;
    const baseRy = p * Math.PI * 6;

    const transforms = [t1, t2, t3, t4];
    groups.forEach((ref, i) => {
      if (ref.current) {
        ref.current.scale.setScalar(transforms[i].fitScale * MAX_SCALE);
        ref.current.rotation.set(rx, baseRy + i * 0.4, 0);
      }
    });
  });

  return (
    <group ref={stackRef}>
      <group ref={groups[0]} position={[0, yOffsets[0], 0]}>
        <group position={[-t1.center.x, -t1.center.y, -t1.center.z]}>
          <Clone object={m1.scene} />
        </group>
      </group>
      <group ref={groups[1]} position={[0, yOffsets[1], 0]}>
        <group position={[-t2.center.x, -t2.center.y, -t2.center.z]}>
          <Clone object={m2.scene} />
        </group>
      </group>
      <group ref={groups[2]} position={[0, yOffsets[2], 0]}>
        <group position={[-t3.center.x, -t3.center.y, -t3.center.z]}>
          <Clone object={m3.scene} />
        </group>
      </group>
      <group ref={groups[3]} position={[0, yOffsets[3], 0]}>
        <group position={[-t4.center.x, -t4.center.y, -t4.center.z]}>
          <Clone object={m4.scene} />
        </group>
      </group>
    </group>
  );
}

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(true);
  const rafRef = useRef<number | null>(null);

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
    }, 1600);

    let lenis: Lenis | null = null;
    if (!prefersReducedMotion) {
      lenis = new Lenis({
        duration: 1.4,
        lerp: 0.05,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        // Ngăn Lenis chiếm quyền scroll của các phần tử Botpress (hoặc các webchat nói chung)
        // @ts-expect-error - prevent might not exist in this version's LenisOptions type
        prevent: (node: any) => 
          (node.id && typeof node.id === 'string' && node.id.includes('bp')) || 
          (node.className && typeof node.className === 'string' && node.className.includes('bp')) ||
          node.closest?.('#bp-web-widget, .bpw-layout, [id*="botpress"]') !== null,
      });
      const raf = (time: number) => {
        lenis?.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      };
      rafRef.current = requestAnimationFrame(raf);
    }
    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis?.destroy();
      document.body.style.overflow = "auto";
    };
  }, [prefersReducedMotion]);

  const text1Op = useTransform(sectionScroll, [0, 0.15, 0.22], [1, 1, 0]);
  const text1Blur = useTransform(
    sectionScroll,
    [0, 0.15, 0.22],
    ["blur(0px)", "blur(0px)", "blur(15px)"],
  );

  const text2Op = useTransform(
    sectionScroll,
    [0.18, 0.25, 0.4, 0.47],
    [0, 1, 1, 0],
  );
  const text2Blur = useTransform(
    sectionScroll,
    [0.18, 0.25, 0.4, 0.47],
    ["blur(15px)", "blur(0px)", "blur(0px)", "blur(15px)"],
  );

  const text3Op = useTransform(
    sectionScroll,
    [0.43, 0.5, 0.65, 0.72],
    [0, 1, 1, 0],
  );
  const text3Blur = useTransform(
    sectionScroll,
    [0.43, 0.5, 0.65, 0.72],
    ["blur(15px)", "blur(0px)", "blur(0px)", "blur(15px)"],
  );

  const text4Op = useTransform(sectionScroll, [0.68, 0.75, 1], [0, 1, 1]);
  const text4Blur = useTransform(
    sectionScroll,
    [0.68, 0.75, 1],
    ["blur(15px)", "blur(0px)", "blur(0px)"],
  );

  return (
    <div className="bg-background text-foreground w-full overflow-x-clip font-light selection:bg-foreground selection:text-background transition-colors duration-500">
      {/* PRELOADER */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            exit={{ y: "-100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-100 bg-background flex flex-col items-center justify-center text-foreground"
          >
            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, letterSpacing: "0.8em" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-2xl md:text-4xl font-serif italic uppercase ml-[0.8em]"
            >
              True Look
            </motion.div>
            <div className="relative mt-8 h-px w-32 overflow-hidden bg-foreground/20">
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
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background">
        <motion.img
          style={{ scale: useTransform(globalScroll, [0, 0.3], [1, 1.15]) }}
          src={ASSETS.hero}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.5] dark:brightness-[0.3]"
          alt=""
        />
        <div className="absolute inset-0 bg-background/40 dark:bg-background/20" />
        <h1 className="relative z-10 text-[15vw] font-serif italic text-foreground drop-shadow-2xl">
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

      {/* 3. SHOWCASE 3D  */}
      <section
        ref={section3DRef}
        style={{ height: "500vh" }}
        className="relative w-full bg-background transition-colors duration-500"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          
          {/* MINIMALIST APPLE-STYLE CIRCLE BACKGROUND */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden md:translate-x-[20%]">
            <motion.div
              style={{ scale: useTransform(sectionScroll, [0, 1], [1, 1.2]) }}
              className="w-[65vmin] h-[65vmin] md:w-[65vh] md:h-[65vh] shrink-0 rounded-full bg-secondary/20 dark:bg-white/5 transition-colors duration-500"
            />
          </div>

          {/* FULL SCREEN 3D CANVAS (Shifted right on desktop) */}
          <div className="absolute inset-0 z-10 pointer-events-none md:translate-x-[20%]">
            <Canvas
              dpr={[1, 2]}
              gl={{
                alpha: true,
                antialias: true,
                powerPreference: "high-performance",
              }}
              camera={{ position: [0, 0, 6], fov: 35 }}
            >
              <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={35} />
              <ambientLight intensity={3} />
              <directionalLight position={[0, 5, 10]} intensity={5} />
              <Environment preset="city" />
              <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.6}>
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

          {/* TEXT OVERLAYS */}
          <div className="relative z-20 w-full h-full max-w-screen-2xl mx-auto flex items-center px-6 md:px-12 pointer-events-none">
            <div className="relative w-full md:w-1/2 h-full flex items-center justify-start">
              {/* TEXT 1 (k1) */}
              <motion.div
                style={{
                  opacity: text1Op,
                  filter: text1Blur,
                  y: useTransform(sectionScroll, [0, 0.22], [0, -40]),
                }}
                className="absolute text-left flex flex-col items-start"
              >
                <p className="text-[10px] uppercase tracking-[0.6em] mb-6 opacity-50 drop-shadow-md">
                  Edition 1
                </p>
                <h2 className="text-[12vw] md:text-[6vw] font-serif italic leading-none drop-shadow-2xl">
                  Pure Titanium
                </h2>
                <p className="mt-8 text-foreground/80 max-w-md text-sm font-sans tracking-widest uppercase leading-loose border-t border-border pt-8 drop-shadow-md">
                  Chế tác từ nguyên khối hợp kim hàng không. Nhẹ hơn không khí,
                  vững chãi hơn thời gian.
                </p>
              </motion.div>

              {/* TEXT 2 (Gamot 02) */}
              <motion.div
                style={{
                  opacity: text2Op,
                  filter: text2Blur,
                  y: useTransform(sectionScroll, [0.18, 0.47], [40, -40]),
                }}
                className="absolute text-left flex flex-col items-start"
              >
                <p className="text-[10px] uppercase tracking-[0.6em] mb-6 opacity-50 drop-shadow-md">
                  Bouquet Collection
                </p>
                <h2 className="text-[12vw] md:text-[6vw] font-serif italic leading-none drop-shadow-2xl">
                  Gamot 02
                </h2>
                <p className="mt-8 text-foreground/80 max-w-md text-sm font-sans tracking-widest uppercase leading-loose border-t border-border pt-8 drop-shadow-md">
                  Gọng kim loại bạc sáng bóng với tròng kính vuông trong suốt.
                  Điểm nhấn chi tiết thắt nút lấy cảm hứng từ thực vật.
                </p>
              </motion.div>

              {/* TEXT 3 (Goxx 02) */}
              <motion.div
                style={{
                  opacity: text3Op,
                  filter: text3Blur,
                  y: useTransform(sectionScroll, [0.43, 0.72], [40, -40]),
                }}
                className="absolute text-left flex flex-col items-start"
              >
                <p className="text-[10px] uppercase tracking-[0.6em] mb-6 opacity-50 drop-shadow-md">
                  2025 Bold Collection
                </p>
                <h2 className="text-[12vw] md:text-[6vw] font-serif italic leading-none drop-shadow-2xl">
                  Goxx 02
                </h2>
                <p className="mt-8 text-foreground/80 max-w-md text-sm font-sans tracking-widest uppercase leading-loose border-t border-border pt-8 drop-shadow-md">
                  Kính râm dáng Wraparound phá cách với gọng kim loại bạc. Dấu ấn
                  biểu tượng BOLD đặc trưng trên càng kính.
                </p>
              </motion.div>

              {/* TEXT 4 (Manifesto 02) */}
              <motion.div
                style={{
                  opacity: text4Op,
                  filter: text4Blur,
                  y: useTransform(sectionScroll, [0.68, 1], [40, 0]),
                }}
                className="absolute text-left flex flex-col items-start"
              >
                <p className="text-[10px] uppercase tracking-[0.6em] mb-6 opacity-50 drop-shadow-md">
                  2025 Bold Collection
                </p>
                <h2 className="text-[12vw] md:text-[6vw] font-serif italic leading-none drop-shadow-2xl">
                  Manifesto 02
                </h2>
                <p className="mt-8 text-foreground/80 max-w-md text-sm font-sans tracking-widest uppercase leading-loose border-t border-border pt-8 drop-shadow-md">
                  Sự giao thoa của chất liệu bạc cao cấp và tròng kính tráng gương
                  xám. Trải nghiệm thị giác vượt chuẩn.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MATERIALS */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden z-30 border-y border-border">
        {/* Background Images */}
        <div className="absolute inset-0 flex">
          <div className="w-1/2 h-full relative group overflow-hidden">
            <img 
              src={ASSETS.mat1} 
              className="w-full h-full object-cover grayscale brightness-50 md:brightness-75 transition-transform duration-[2s] group-hover:scale-105" 
              alt="Material 1" 
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700" />
            <div className="absolute bottom-10 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <span className="text-white font-sans font-bold tracking-[0.2em] text-2xl md:text-4xl uppercase">Celine</span>
            </div>
          </div>
          <div className="w-1/2 h-full relative group overflow-hidden">
            <img 
              src={ASSETS.mat2} 
              className="w-full h-full object-cover grayscale brightness-50 md:brightness-75 transition-transform duration-[2s] group-hover:scale-105" 
              alt="Material 2" 
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700" />
            <div className="absolute bottom-10 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <span className="text-white font-sans font-bold tracking-[0.2em] text-2xl md:text-4xl uppercase">Celine</span>
            </div>
          </div>
        </div>

        {/* Overlaid Content */}
        <div className="relative z-10 text-white flex flex-col items-center text-center pointer-events-none px-6">
          <h2 className="text-6xl md:text-[8rem] font-serif italic leading-[0.9] drop-shadow-2xl mix-blend-overlay">
            Art of <br /> Engineering.
          </h2>
          <div className="flex gap-16 md:gap-32 pt-12 md:pt-16 mt-12 md:mt-16 border-t border-white/30 mix-blend-overlay">
            <div>
              <p className="text-4xl md:text-6xl font-serif mb-2 drop-shadow-lg">12g</p>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-80 italic drop-shadow-lg">
                Ultralight
              </p>
            </div>
            <div>
              <p className="text-4xl md:text-6xl font-serif mb-2 drop-shadow-lg">Zeiss</p>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-80 italic drop-shadow-lg">
                Optics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GALLERY (EXPANDABLE FULL SCREEN) */}
      <section className="w-full h-[80vh] md:h-screen bg-background relative z-30 flex flex-col md:flex-row">
        {/* Card 1 */}
        <div className="relative flex-1 group md:hover:flex-[2.5] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer bg-secondary/10">
            <img
              src={ASSETS.lookbook1}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="A-Series 2026"
            />
            {/* Soft gradient to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
            
            {/* Content */}
            <div className="absolute bottom-8 left-8 text-white z-10">
              <h3 className="text-2xl md:text-4xl font-serif italic mb-1 opacity-90 group-hover:opacity-100 transition-opacity duration-700">
                A-Series 2026
              </h3>
              <div className="h-0 overflow-hidden group-hover:h-6 transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100">
                <p className="text-xs font-light uppercase tracking-widest text-white/70">
                  Khám phá bộ sưu tập
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative flex-1 group md:hover:flex-[2.5] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer bg-secondary/10">
            <img
              src={ASSETS.lookbook2}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="Obsidian Edition"
            />
            {/* Soft gradient to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
            
            {/* Content */}
            <div className="absolute bottom-8 left-8 text-white z-10">
              <h3 className="text-2xl md:text-4xl font-serif italic mb-1 opacity-90 group-hover:opacity-100 transition-opacity duration-700">
                Obsidian Edition
              </h3>
              <div className="h-0 overflow-hidden group-hover:h-6 transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100">
                <p className="text-xs font-light uppercase tracking-widest text-white/70">
                  Khám phá bộ sưu tập
                </p>
              </div>
            </div>
          </div>
      </section>
    </div>
  );
}
