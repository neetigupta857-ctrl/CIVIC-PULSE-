import StatsBand from "@/components/ui/stats-band";

export default function StatsBandDemo() {
  return (
    <div className="w-full">
      <StatsBand
        layout="divided"
        title="Fast, steady, and close to everyone"
        description="Measured across every region from October 2025 to September 2026."
      />
    </div>
  );
}

