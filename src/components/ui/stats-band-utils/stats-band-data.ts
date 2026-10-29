export type StatVisual =
  | { kind: "trend"; values: number[] }
  | { kind: "uptime"; days: number[] }
  | { kind: "distribution"; bins: number[]; max: number; marker: number }
  | { kind: "map"; points: [number, number][] };

export interface Stat {
  label: string;
  value: number;
  decimals?: number;
  notation?: "standard" | "compact";
  prefix?: string;
  suffix?: string;
  detail?: string;
  context?: string;
  visual?: StatVisual;
}

export const stats: Stat[] = [
  {
    label: "Hazard reports resolved",
    value: 12480,
    decimals: 0,
    notation: "compact",
    suffix: "+",
    detail: "94.2% verified fixed",
    context: "Across all major municipalities",
    visual: {
      kind: "trend",
      values: [2200, 3400, 4800, 6100, 7800, 9900, 12480],
    },
  },
  {
    label: "Emergency SLA uptime",
    value: 99.8,
    decimals: 1,
    suffix: "%",
    detail: "Dispatch response rate",
    context: "<4 hr critical hazard response",
    visual: {
      kind: "uptime",
      days: [100, 100, 100, 99, 100, 100, 100, 100, 100, 98, 100, 100, 100, 100, 100, 100, 100, 99, 100, 100, 100],
    },
  },
  {
    label: "Average resolution latency",
    value: 2.8,
    decimals: 1,
    suffix: " hrs",
    detail: "Median repair turnaround",
    context: "Down from 14 days FIFO queue",
    visual: {
      kind: "distribution",
      bins: [4, 18, 38, 72, 60, 42, 28, 14, 8, 3],
      max: 24,
      marker: 8,
    },
  },
  {
    label: "Active municipal corridors",
    value: 36,
    decimals: 0,
    suffix: " cities",
    detail: "National coverage map",
    context: "Real-time automated deduplication",
    visual: {
      kind: "map",
      points: [
        [77.209, 28.6139], // Delhi
        [72.8777, 19.076],  // Mumbai
        [77.5946, 12.9716], // Bengaluru
        [80.2707, 13.0827], // Chennai
        [88.3639, 22.5726], // Kolkata
        [78.4867, 17.385],  // Hyderabad
      ],
    },
  },
];

