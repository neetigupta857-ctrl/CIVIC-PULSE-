"use client";

import React, {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { CSSProperties } from "react";
import { animate, useInView } from "motion/react";
import { motionTokens } from "@/components/ui/stats-band-utils/motion-tokens";
import {
  stats as exampleStats,
  type Stat,
  type StatVisual,
} from "@/components/ui/stats-band-utils/stats-band-data";
import {
  WORLD,
  worldLand,
} from "@/components/ui/stats-band-utils/stats-band-world";

export type {
  Stat,
  StatVisual,
} from "@/components/ui/stats-band-utils/stats-band-data";
export type StatsBandLayout = "plain" | "divided";

export interface StatsBandProps {
  stats?: Stat[];
  layout?: StatsBandLayout;
  title?: string;
  description?: string;
  duration?: number;
  locale?: string;
  className?: string;
}

type Bezier = [number, number, number, number];
const enter = [...motionTokens.ease.enter] as Bezier;
const STAGGER = 0.09;

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(REDUCE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

function useReducedMotionSafe() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );
}

function useFormat(stat: Stat, locale: string) {
  return useMemo(() => {
    const decimals = stat.decimals ?? 0;
    const digits = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      numberingSystem: "latn",
    });
    if (stat.notation !== "compact")
      return { unit: "", format: (value: number) => digits.format(value) };
    const size = Math.abs(stat.value);
    const scale =
      size >= 1e12
        ? 1e12
        : size >= 1e9
          ? 1e9
          : size >= 1e6
            ? 1e6
            : size >= 1e3
              ? 1e3
              : 1;
    const unit =
      scale === 1
        ? ""
        : (new Intl.NumberFormat(locale, { notation: "compact" })
            .formatToParts(scale)
            .find((part) => part.type === "compact")?.value ?? "");
    return { unit, format: (value: number) => digits.format(value / scale) };
  }, [stat.decimals, stat.notation, stat.value, locale]);
}

function CountUp({
  stat,
  run,
  delay,
  duration,
  reduced,
  locale,
}: {
  stat: Stat;
  run: boolean;
  delay: number;
  duration: number;
  reduced: boolean;
  locale: string;
}) {
  const { unit, format } = useFormat(stat, locale);
  const final = format(stat.value);
  const suffix = `${unit}${stat.suffix ?? ""}`;
  const [displayValue, setDisplayValue] = useState<string>(final);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      setDisplayValue(final);
      done.current = true;
      return;
    }
    if (!run || done.current) return;
    const controls = animate(0, stat.value, {
      duration,
      delay,
      ease: enter,
      onUpdate: (latest) => {
        setDisplayValue(format(latest));
      },
      onComplete: () => {
        setDisplayValue(final);
        done.current = true;
      },
    });
    return () => controls.stop();
  }, [run, reduced, stat.value, delay, duration, format, final]);

  return (
    <div className="flex items-baseline font-mono text-3xl sm:text-4xl font-extrabold text-[#211B17] tracking-tight">
      {stat.prefix && <span className="text-xl sm:text-2xl mr-1 text-[#896648]">{stat.prefix}</span>}
      <span>{displayValue}</span>
      {suffix && <span className="text-lg sm:text-xl ml-1 text-[#896648]">{suffix}</span>}
    </div>
  );
}

function Trend({ values }: { values: number[] }) {
  const min = Math.min(...values),
    max = Math.max(...values);
  const span = max - min || 1;
  const points = values.map(
    (value, index) =>
      [
        values.length > 1 ? (index / (values.length - 1)) * 100 : 100,
        34 - ((value - min) / span) * 28,
      ] as const,
  );
  const line = points
    .map(
      ([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`,
    )
    .join(" ");
  const [endX, endY] = points[points.length - 1];
  return (
    <div className="relative w-full h-10 overflow-hidden">
      <svg
        className="w-full h-full overflow-hidden"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
      >
        <path fill="rgba(137, 102, 72, 0.15)" d={`${line} L 100 40 L 0 40 Z`} />
        <path
          fill="none"
          stroke="#896648"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d={line}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        className="absolute w-2 h-2 rounded-full bg-[#896648] border-2 border-[#F5EDE4] shadow-xs -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${endX}%`, top: `${(endY / 40) * 100}%` }}
      />
    </div>
  );
}

function Uptime({ days }: { days: number[] }) {
  return (
    <div className="flex items-end gap-1 w-full h-10">
      {days.map((uptime, index) => (
        <span
          key={index}
          className={`flex-1 rounded-xs transition-all ${uptime < 100 ? 'bg-[#C2410C]' : 'bg-[#896648]'}`}
          style={{ height: `${Math.min(100, Math.max(30, (uptime / 100) * 100))}%` }}
        />
      ))}
    </div>
  );
}

function Distribution({
  bins,
  max,
  marker,
}: {
  bins: number[];
  max: number;
  marker: number;
}) {
  const peak = Math.max(...bins) || 1;
  const width = max / bins.length;
  return (
    <div className="flex items-end gap-1 w-full h-10">
      {bins.map((count, index) => (
        <span
          key={index}
          className={`flex-1 rounded-xs transition-all ${index * width < marker ? 'bg-[#896648]' : 'bg-[#C7AF99]'}`}
          style={{ height: `${Math.max(10, (count / peak) * 100)}%` }}
        />
      ))}
    </div>
  );
}

const cellOf = (lon: number, lat: number) => {
  const x = Math.floor(
    (((((lon - WORLD.west) % 360) + 360) % 360) / (WORLD.east - WORLD.west)) *
      WORLD.columns,
  );
  const y = Math.floor(
    ((WORLD.north - lat) / (WORLD.north - WORLD.south)) * WORLD.rows,
  );
  return [
    Math.min(WORLD.columns - 1, Math.max(0, x)),
    Math.min(WORLD.rows - 1, Math.max(0, y)),
  ] as const;
};

function nearestLand(lon: number, lat: number) {
  const [x, y] = cellOf(lon, lat);
  let best = y * WORLD.columns + x,
    distance = Infinity;
  for (let dy = -2; dy <= 2; dy++)
    for (let dx = -2; dx <= 2; dx++) {
      const cx = x + dx,
        cy = y + dy;
      if (
        cx < 0 ||
        cy < 0 ||
        cx >= WORLD.columns ||
        cy >= WORLD.rows ||
        !worldLand[cy * WORLD.columns + cx]
      )
        continue;
      const d = dx * dx + dy * dy;
      if (d < distance) {
        distance = d;
        best = cy * WORLD.columns + cx;
      }
    }
  return best;
}

function WorldMap({ points }: { points: [number, number][] }) {
  const lit = useMemo(
    () => new Set(points.map(([lon, lat]) => nearestLand(lon, lat))),
    [points],
  );
  return (
    <div className="w-full h-10 overflow-hidden flex items-center justify-center">
      <svg
        className="w-full h-full max-h-10"
        viewBox={`0 0 ${WORLD.columns} ${WORLD.rows}`}
      >
        {worldLand.map(
          (land, index) =>
            land &&
            !lit.has(index) && (
              <circle
                key={index}
                className="fill-[#DFCCB9]"
                cx={(index % WORLD.columns) + 0.5}
                cy={Math.floor(index / WORLD.columns) + 0.5}
                r={0.3}
              />
            ),
        )}
        {[...lit].map((index) => (
          <circle
            key={index}
            className="fill-[#896648]"
            cx={(index % WORLD.columns) + 0.5}
            cy={Math.floor(index / WORLD.columns) + 0.5}
            r={0.65}
          />
        ))}
      </svg>
    </div>
  );
}

function Visual({ visual }: { visual: StatVisual }) {
  switch (visual.kind) {
    case "trend":
      return <Trend values={visual.values} />;
    case "uptime":
      return <Uptime days={visual.days} />;
    case "distribution":
      return (
        <Distribution
          bins={visual.bins}
          max={visual.max}
          marker={visual.marker}
        />
      );
    case "map":
      return <WorldMap points={visual.points} />;
  }
}

export const StatsBand = forwardRef<HTMLElement, StatsBandProps>(
  function StatsBand(
    {
      stats = exampleStats,
      layout = "divided",
      title,
      description,
      duration = 1.6,
      locale = "en-US",
      className = "",
    },
    ref,
  ) {
    const id = useId();
    const list = useRef<HTMLDListElement>(null);
    const inView = useInView(list, { once: true, amount: "some" });
    const reduced = useReducedMotionSafe();

    return (
      <section
        ref={ref}
        className={`w-full ${className}`}
        aria-labelledby={title ? `${id}-title` : undefined}
      >
        <div className="max-w-7xl mx-auto space-y-4">
          {(title || description) && (
            <div className="space-y-1 text-left">
              {title && (
                <h3 id={`${id}-title`} className="font-heading text-xl sm:text-2xl font-extrabold text-[#211B17] tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs sm:text-sm text-[#554940] max-w-2xl leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          )}

          <dl
            ref={list}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[#F5EDE4] border border-[#C7AF99] rounded-2xl overflow-hidden shadow-sm divide-y sm:divide-y-0 sm:divide-x divide-[#C7AF99]"
          >
            {stats.map((stat, index) => (
              <div
                key={`${stat.label}-${index}`}
                className="p-6 flex flex-col justify-between space-y-3 bg-[#F5EDE4] hover:bg-[#EFE4D9]/70 transition-colors"
              >
                <div>
                  <dt className="text-xs font-bold text-[#896648] uppercase tracking-wider mb-2">
                    {stat.label}
                  </dt>
                  <dd>
                    <CountUp
                      stat={stat}
                      run={inView}
                      delay={index * STAGGER}
                      duration={duration}
                      reduced={reduced}
                      locale={locale}
                    />
                  </dd>
                </div>

                <div>
                  {stat.detail && (
                    <dd className="text-xs font-semibold text-[#211B17]">
                      {stat.detail}
                    </dd>
                  )}
                  {stat.context && (
                    <dd className="text-[11px] text-[#554940] mt-0.5">
                      {stat.context}
                    </dd>
                  )}
                </div>

                {stat.visual && (
                  <dd className="pt-2 border-t border-[#DFCCB9] w-full" aria-hidden="true">
                    <Visual visual={stat.visual} />
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </section>
    );
  },
);

StatsBand.displayName = "StatsBand";

export default StatsBand;
