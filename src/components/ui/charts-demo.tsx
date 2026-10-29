"use client";

import { ChevronLeft, ChevronRight, Activity, TrendingUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, useEffect } from "react";
import {
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartBar,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface TrajectoryPoint {
  month: string;
  reportedHazards: number;
  resolvedHazards: number;
  avgResolutionHours: number;
}

const defaultChartData: TrajectoryPoint[] = [
  { month: "Jan", reportedHazards: 840, resolvedHazards: 780, avgResolutionHours: 3.8 },
  { month: "Feb", reportedHazards: 910, resolvedHazards: 865, avgResolutionHours: 3.4 },
  { month: "Mar", reportedHazards: 1120, resolvedHazards: 1045, avgResolutionHours: 3.1 },
  { month: "Apr", reportedHazards: 1350, resolvedHazards: 1290, avgResolutionHours: 2.9 },
  { month: "May", reportedHazards: 1480, resolvedHazards: 1410, avgResolutionHours: 2.7 },
  { month: "Jun", reportedHazards: 1624, resolvedHazards: 1561, avgResolutionHours: 2.4 },
];

const chartConfig = {
  reportedHazards: {
    label: "Reported Hazards",
    color: "#C2410C",
  },
  resolvedHazards: {
    label: "Resolved Hazards",
    color: "#896648",
  },
  avgResolutionHours: {
    label: "Avg Resolution Latency (Hrs)",
    color: "#896648",
  },
} satisfies ChartConfig;

const chartSlides = [
  { id: "bar", label: "Multi-Hazard Intake vs Verified Resolution" },
  { id: "line", label: "Resolution Trajectory & SLA Velocity Trend" },
] as const;

export function ChartsPreview() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [chartData, setChartData] = useState<TrajectoryPoint[]>(defaultChartData);
  const [isLoading, setIsLoading] = useState(true);
  const reduceMotion = useReducedMotion() ?? false;
  const activeSlide = chartSlides[slideIndex];

  // Fetch live real data from the backend store
  useEffect(() => {
    let isMounted = true;
    fetch('/api/analytics/trajectory')
      .then((res) => res.json())
      .then((resData) => {
        if (isMounted && resData.success && Array.isArray(resData.data)) {
          setChartData(resData.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load real trajectory data:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const goToSlide = (nextIndex: number) => {
    setSlideIndex((nextIndex + chartSlides.length) % chartSlides.length);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5">
      <div className="relative w-full overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {activeSlide.id === "bar" ? (
              <ChartContainer className="w-full h-[260px] aspect-auto" config={chartConfig}>
                <BarChart accessibilityLayer data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#C7AF99" strokeOpacity={0.3} strokeDasharray="3 3" />
                  <XAxis
                    axisLine={false}
                    dataKey="month"
                    tickFormatter={(value) => value.slice(0, 3)}
                    tickLine={false}
                    tickMargin={10}
                    tick={{ fill: "#554940", fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#554940", fontSize: 11 }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="dashed" />}
                    cursor={false}
                  />
                  <ChartBar dataKey="reportedHazards" fill="#C2410C" radius={4} seriesIndex={0} />
                  <ChartBar dataKey="resolvedHazards" fill="#896648" radius={4} seriesIndex={1} />
                </BarChart>
              </ChartContainer>
            ) : (
              <ChartContainer className="w-full h-[260px] aspect-auto" config={chartConfig}>
                <LineChart accessibilityLayer data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#C7AF99" strokeOpacity={0.3} strokeDasharray="3 3" />
                  <XAxis
                    axisLine={false}
                    dataKey="month"
                    tickFormatter={(value) => value.slice(0, 3)}
                    tickLine={false}
                    tickMargin={10}
                    tick={{ fill: "#554940", fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#554940", fontSize: 11 }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="dot" />}
                    cursor={false}
                  />
                  <Line dataKey="reportedHazards" type="monotone" stroke="#C2410C" strokeWidth={2.5} dot={{ fill: "#C2410C", r: 3 }} />
                  <Line dataKey="resolvedHazards" type="monotone" stroke="#896648" strokeWidth={2.5} dot={{ fill: "#896648", r: 3 }} />
                </LineChart>
              </ChartContainer>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex w-full items-center justify-between gap-3 pt-2 border-t border-[#C7AF99]">
        <button
          type="button"
          aria-label="Previous chart"
          className="inline-flex size-8 items-center justify-center rounded-lg border border-[#C7AF99] bg-[#F5EDE4] hover:bg-[#DFCCB9] transition-colors text-[#211B17] cursor-pointer"
          onClick={() => goToSlide(slideIndex - 1)}
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="flex items-center gap-2" role="tablist" aria-label="Chart views">
          {chartSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-label={slide.label}
              aria-selected={index === slideIndex}
              className={cn(
                "rounded-full transition-[width,background-color] duration-300 cursor-pointer",
                index === slideIndex ? "h-2 w-6 bg-[#896648]" : "size-2 bg-[#C7AF99]"
              )}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next chart"
          className="inline-flex size-8 items-center justify-center rounded-lg border border-[#C7AF99] bg-[#F5EDE4] hover:bg-[#DFCCB9] transition-colors text-[#211B17] cursor-pointer"
          onClick={() => goToSlide(slideIndex + 1)}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <p className="text-center text-xs font-semibold text-[#554940]">{activeSlide.label}</p>
    </div>
  );
}

export default ChartsPreview;
