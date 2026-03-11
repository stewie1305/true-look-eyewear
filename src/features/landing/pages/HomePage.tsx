import { useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion,
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
  model2: "/models/k7.glb",
  model3: "/models/k6.glb",
  model4: "/models/k8.glb",
};

useGLTF.preload(ASSETS.model1);
useGLTF.preload(ASSETS.model2);
useGLTF.preload(ASSETS.model3);
useGLTF.preload(ASSETS.model4);

function EyewearShowcase({ scrollProgress }: { scrollProgress: any }) {
  const m1 = useGLTF(ASSETS.model1);
  const m2 = useGLTF(ASSETS.model2);
  const m3 = useGLTF(ASSETS.model3);
  const m4 = useGLTF(ASSETS.model4);

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
  const group1 = useRef<any>(null);
  const group2 = useRef<any>(null);
  const group3 = useRef<any>(null);
  const group4 = useRef<any>(null);

  const MAX_SCALE = 0.85;
  const STACK_GAP = 4.8;
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  const smoothStep = (t: number) => {
    const c = clamp01(t);
    return c * c * (3 - 2 * c);
  };

  useFrame(() => {
    const p = scrollProgress.get();

    const y1 = -0.2 - t1.center.y;
    const y2 = -0.2 - STACK_GAP - t2.center.y;
    const y3 = -0.2 - STACK_GAP * 2 - t3.center.y;
    const y4 = -0.2 - STACK_GAP * 3 - t4.center.y;

    const shiftTo2 = y1 - y2;
    const shiftTo3 = y1 - y3;
    const shiftTo4 = y1 - y4;

    let stackY = 0;

    // Logic hold: Giữ kính đứng yên tại trung tâm
    if (p < 0.15) {
      stackY = 0;
    } else if (p < 0.25) {
      const local = smoothStep((p - 0.15) / 0.1);
      stackY = shiftTo2 * local;
    } else if (p < 0.4) {
      stackY = shiftTo2;
    } else if (p < 0.5) {
      const local = smoothStep((p - 0.4) / 0.1);
      stackY = shiftTo2 + (shiftTo3 - shiftTo2) * local;
    } else if (p < 0.65) {
      stackY = shiftTo3;
    } else if (p < 0.75) {
      const local = smoothStep((p - 0.65) / 0.1);
      stackY = shiftTo3 + (shiftTo4 - shiftTo3) * local;
    } else {
      stackY = shiftTo4;
    }

    if (stackRef.current) {
      stackRef.current.position.y = stackY;
    }

    const rx = 0.06;
    const baseRy = p * Math.PI * 6;

    if (group1.current) {
      group1.current.scale.setScalar(t1.fitScale * MAX_SCALE);
      group1.current.rotation.set(rx, baseRy, 0);
      group1.current.visible = true;
    }
    if (group2.current) {
      group2.current.scale.setScalar(t2.fitScale * MAX_SCALE);
      group2.current.rotation.set(rx, baseRy + 0.35, 0);
      group2.current.visible = true;
    }
    if (group3.current) {
      group3.current.scale.setScalar(t3.fitScale * MAX_SCALE);
      group3.current.rotation.set(rx, baseRy + 0.7, 0);
      group3.current.visible = true;
    }
    if (group4.current) {
      group4.current.scale.setScalar(t4.fitScale * MAX_SCALE);
      group4.current.rotation.set(rx, baseRy + 1.05, 0);
      group4.current.visible = true;
    }
  });

  return (
    <group ref={stackRef}>
      <group
        ref={group1}
        position={[-t1.center.x, -0.2 - t1.center.y, -t1.center.z]}
        scale={t1.fitScale}
      >
        <Clone object={m1.scene} />
      </group>
      <group
        ref={group2}
        position={[-t2.center.x, -0.2 - STACK_GAP - t2.center.y, -t2.center.z]}
        scale={t2.fitScale}
      >
        <Clone object={m2.scene} />
      </group>
      <group
        ref={group3}
        position={[
          -t3.center.x,
          -0.2 - STACK_GAP * 2 - t3.center.y,
          -t3.center.z,
        ]}
        scale={t3.fitScale}
      >
        <Clone object={m3.scene} />
      </group>
      <group
        ref={group4}
        position={[
          -t4.center.x,
          -0.2 - STACK_GAP * 3 - t4.center.y,
          -t4.center.z,
        ]}
        scale={t4.fitScale}
      >
        <Clone object={m4.scene} />
      </group>
    </group>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
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
    const timer = setTimeout(
      () => {
        setIsLoading(false);
        document.body.style.overflow = "auto";
      },
      prefersReducedMotion ? 800 : 1600,
    );

    let lenis: Lenis | null = null;
    if (!prefersReducedMotion) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
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

  // --- TIMELINE TEXT ---

  // Text 1 (Kính 1 trung tâm từ 0 -> 15%)
  const text1Op = useTransform(sectionScroll, [0, 0.15, 0.22], [1, 1, 0]);
  const text1Y = useTransform(sectionScroll, [0, 0.15, 0.22], [0, 0, -30]);
  const text1Blur = useTransform(
    sectionScroll,
    [0, 0.15, 0.22],
    ["blur(0px)", "blur(0px)", "blur(12px)"],
  );

  // Text 2 (Kính 2 trung tâm từ 25% -> 40%) - GAMOT 02
  const text2Op = useTransform(
    sectionScroll,
    [0.18, 0.25, 0.4, 0.47],
    [0, 1, 1, 0],
  );
  const text2Y = useTransform(
    sectionScroll,
    [0.18, 0.25, 0.4, 0.47],
    [30, 0, 0, -30],
  );
  const text2Blur = useTransform(
    sectionScroll,
    [0.18, 0.25, 0.4, 0.47],
    ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"],
  );

  // Text 3 (Kính 3 trung tâm từ 50% -> 65%) - GOXX 02
  const text3Op = useTransform(
    sectionScroll,
    [0.43, 0.5, 0.65, 0.72],
    [0, 1, 1, 0],
  );
  const text3Y = useTransform(
    sectionScroll,
    [0.43, 0.5, 0.65, 0.72],
    [30, 0, 0, -30],
  );
  const text3Blur = useTransform(
    sectionScroll,
    [0.43, 0.5, 0.65, 0.72],
    ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"],
  );

  // Text 4 (Kính 4 trung tâm từ 75% -> 100%) - MANIFESTO 02
  const text4Op = useTransform(sectionScroll, [0.68, 0.75, 1], [0, 1, 1]);
  const text4Y = useTransform(sectionScroll, [0.68, 0.75, 1], [30, 0, 0]);
  const text4Blur = useTransform(
    sectionScroll,
    [0.68, 0.75, 1],
    ["blur(12px)", "blur(0px)", "blur(0px)"],
  );

  return (
    <div className="bg-background text-foreground w-full overflow-x-clip font-light transition-colors duration-500 selection:bg-foreground selection:text-background">
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

      {/* 3. SHOWCASE 3D */}
      <section
        ref={section3DRef}
        style={{ height: "500vh" }}
        className="relative w-full bg-background transition-colors duration-500"
      >
        <div className="sticky top-0 h-screen w-full max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between overflow-hidden px-6 md:px-12">
          {/* CỘT TRÁI: TEXT HIỂN THỊ */}
          <div className="relative w-full md:w-1/2 h-[40vh] md:h-full flex items-center justify-start z-20">
            {/* TEXT 1 (k1) */}
            <motion.div
              style={{ opacity: text1Op, y: text1Y, filter: text1Blur }}
              className="absolute text-left flex flex-col items-start"
            >
              <p className="text-[10px] uppercase tracking-[0.6em] mb-6 opacity-50 drop-shadow-md">
                Edition 1
              </p>
              <h2 className="text-[12vw] md:text-[5vw] font-serif italic leading-none drop-shadow-lg">
                Pure Titanium
              </h2>
              <p className="mt-8 text-muted-foreground max-w-md text-sm font-sans tracking-widest uppercase leading-loose border-t border-border pt-8 drop-shadow-md">
                Chế tác từ nguyên khối hợp kim hàng không. Nhẹ hơn không khí,
                vững chãi hơn thời gian.
              </p>
            </motion.div>

            {/* TEXT 2 (Gamot 02 - bây giờ hiển thị k7.glb) */}
            <motion.div
              style={{ opacity: text2Op, y: text2Y, filter: text2Blur }}
              className="absolute text-left flex flex-col items-start"
            >
              <p className="text-[10px] uppercase tracking-[0.6em] mb-6 opacity-50 drop-shadow-md">
                Bouquet Collection
              </p>
              <h2 className="text-[12vw] md:text-[5vw] font-serif italic leading-none drop-shadow-lg">
                Gamot 02
              </h2>
              <p className="mt-8 text-muted-foreground max-w-md text-sm font-sans tracking-widest uppercase leading-loose border-t border-border pt-8 drop-shadow-md">
                Gọng kim loại bạc sáng bóng với tròng kính vuông trong suốt.
                Điểm nhấn chi tiết thắt nút lấy cảm hứng từ cấu trúc thực vật.
                Tích hợp chặn ánh sáng xanh và 99.9% tia UV.
              </p>
            </motion.div>

            {/* TEXT 3 (Goxx 02 - bây giờ hiển thị k6.glb) */}
            <motion.div
              style={{ opacity: text3Op, y: text3Y, filter: text3Blur }}
              className="absolute text-left flex flex-col items-start"
            >
              <p className="text-[10px] uppercase tracking-[0.6em] mb-6 opacity-50 drop-shadow-md">
                2025 Bold Collection
              </p>
              <h2 className="text-[12vw] md:text-[5vw] font-serif italic leading-none drop-shadow-lg">
                Goxx 02
              </h2>
              <p className="mt-8 text-muted-foreground max-w-md text-sm font-sans tracking-widest uppercase leading-loose border-t border-border pt-8 drop-shadow-md">
                Kính râm dáng Wraparound phá cách với gọng kim loại bạc. Dấu ấn
                biểu tượng BOLD đặc trưng trên càng kính. Tròng kính tráng gương
                bảo vệ mắt tuyệt đối khỏi tia UV.
              </p>
            </motion.div>

            {/* TEXT 4 (Manifesto 02) */}
            <motion.div
              style={{ opacity: text4Op, y: text4Y, filter: text4Blur }}
              className="absolute text-left flex flex-col items-start"
            >
              <p className="text-[10px] uppercase tracking-[0.6em] mb-6 opacity-50 drop-shadow-md">
                2025 Bold Collection
              </p>
              <h2 className="text-[12vw] md:text-[5vw] font-serif italic leading-none drop-shadow-lg">
                Manifesto 02
              </h2>
              <p className="mt-8 text-muted-foreground max-w-md text-sm font-sans tracking-widest uppercase leading-loose border-t border-border pt-8 drop-shadow-md">
                Sự giao thoa của chất liệu bạc cao cấp và tròng kính tráng gương
                xám. Biểu tượng BOLD được khắc họa sắc nét trên cầu kính và
                gọng. Trải nghiệm thị giác vượt chuẩn.
              </p>
            </motion.div>
          </div>

          {/* CỘT PHẢI: 3D MODEL & KHUNG XÁM */}
          <div className="relative w-full md:w-1/2 h-[60vh] md:h-full flex items-center justify-center pointer-events-none">
            <div className="absolute w-full h-full flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
              <motion.div
                style={{
                  rotate: useTransform(sectionScroll, [0, 1], [0, 360]),
                  scale: 1.5,
                }}
                className="w-[70vmin] h-[70vmin] md:w-[75vh] md:h-[75vh]"
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
              <Canvas
                dpr={[1, 1.5]}
                gl={{
                  alpha: true,
                  antialias: false,
                  powerPreference: "high-performance",
                }}
                camera={{ position: [0, 0, 6], fov: 35 }}
              >
                <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={35} />
                <ambientLight intensity={3} />
                <directionalLight position={[0, 5, 10]} intensity={5} />
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
            <div className="aspect-3/4 overflow-hidden rounded-sm bg-muted shadow-2xl">
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
            <div className="aspect-3/4 overflow-hidden rounded-sm bg-muted shadow-2xl">
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
