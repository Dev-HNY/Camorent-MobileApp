import { memo, useEffect, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { wp } from "@/utils/responsive";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

// ─── Image pool ───────────────────────────────────────────────────────────────

const POOL = [
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1452457750107-be84244be493?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1623039405147-547794f92e9e?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1486946255434-2466348c2166?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1617396900799-f4ec2b43c7d3?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1480365501497-199581be0e66?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop",
];

// ─── Layout ───────────────────────────────────────────────────────────────────

const COLS = 3;
const ROWS = 3;
const TOTAL = COLS * ROWS;
const GAP = 3;
const H_PAD = wp(16);
const SCREEN_W = Dimensions.get("window").width;
const CELL = Math.floor((SCREEN_W - H_PAD * 2 - GAP * (COLS - 1)) / COLS);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randFrom(exclude: string): string {
  let pick: string;
  do { pick = POOL[Math.floor(Math.random() * POOL.length)]; }
  while (pick === exclude);
  return pick;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Single crossfade cell ────────────────────────────────────────────────────

const GridCell = memo(({ initialSrc, swapSignal }: {
  initialSrc: string;
  swapSignal: number; // increments to trigger a swap
}) => {
  const [front, setFront] = useState<"a" | "b">("a");
  const [srcA, setSrcA] = useState(initialSrc);
  const [srcB, setSrcB] = useState(() => randFrom(initialSrc));

  const opA = useSharedValue(1);
  const opB = useSharedValue(0);

  useEffect(() => {
    if (swapSignal === 0) return;

    if (front === "a") {
      // Load new image into B then fade to it
      setSrcB(randFrom(srcA));
      opA.value = withTiming(0, { duration: 700 });
      opB.value = withTiming(1, { duration: 700 });
      setFront("b");
    } else {
      setSrcA(randFrom(srcB));
      opB.value = withTiming(0, { duration: 700 });
      opA.value = withTiming(1, { duration: 700 });
      setFront("a");
    }
  }, [swapSignal]);

  const styleA = useAnimatedStyle(() => ({ opacity: opA.value }));
  const styleB = useAnimatedStyle(() => ({ opacity: opB.value }));

  return (
    <View style={styles.cell}>
      <Animated.View style={[StyleSheet.absoluteFill, styleA]}>
        <Image source={{ uri: srcA }} style={styles.cellImg} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, styleB]}>
        <Image source={{ uri: srcB }} style={styles.cellImg} />
      </Animated.View>
    </View>
  );
});
GridCell.displayName = "GridCell";

// ─── Grid ─────────────────────────────────────────────────────────────────────

export const ImageGrid = memo(() => {
  // Each cell tracks how many times it's been triggered to swap
  const [signals, setSignals] = useState<number[]>(() => Array(TOTAL).fill(0));
  const queueRef = useRef<number[]>(shuffle([...Array(TOTAL).keys()]));
  const qIdxRef  = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial srcs — stable, one per cell
  const [initSrcs] = useState<string[]>(() =>
    Array.from({ length: TOTAL }, (_, i) => POOL[i % POOL.length])
  );

  useEffect(() => {
    function scheduleNext() {
      // Burst: swap 1–3 cells at a time with tiny stagger
      const burst = Math.floor(Math.random() * 3) + 1;
      const indices: number[] = [];

      for (let b = 0; b < burst; b++) {
        if (qIdxRef.current >= queueRef.current.length) {
          queueRef.current = shuffle([...Array(TOTAL).keys()]);
          qIdxRef.current  = 0;
        }
        indices.push(queueRef.current[qIdxRef.current++]);
      }

      indices.forEach((cellIdx, b) => {
        setTimeout(() => {
          setSignals(prev => {
            const next = [...prev];
            next[cellIdx] = next[cellIdx] + 1;
            return next;
          });
        }, b * (40 + Math.random() * 80));
      });

      const interval = 100 + Math.random() * 250;
      timerRef.current = setTimeout(scheduleNext, interval);
    }

    timerRef.current = setTimeout(scheduleNext, 600);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <View style={styles.grid}>
      {initSrcs.map((src, i) => (
        <GridCell
          key={i}
          initialSrc={src}
          swapSignal={signals[i]}
        />
      ))}
    </View>
  );
});
ImageGrid.displayName = "ImageGrid";

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
    paddingHorizontal: H_PAD,
  },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  cellImg: {
    width: CELL,
    height: CELL,
  },
});
