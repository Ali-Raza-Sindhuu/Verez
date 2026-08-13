import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { cn } from "../../utils/cn";

export interface TrafficSource {
  label: string;
  value: number;
  color: string;
}

export interface TrafficSourcesChartProps {
  sources: TrafficSource[];
  total: number;
  onViewAll?: () => void;
  className?: string;
}

/**
 * TrafficSourcesChart
 *
 * "Traffic Sources" donut card from the ECOMS dashboard reference: ring
 * chart with the total centered inside, plus a legend below showing each
 * source's label, color dot, and value.
 *
 * Example:
 *   <TrafficSourcesChart
 *     total={2500}
 *     sources={[
 *       { label: "Direct", value: 700, color: "#f97316" },
 *       { label: "Google", value: 600, color: "#fb923c" },
 *       { label: "Social Media", value: 500, color: "#fdba74" },
 *       { label: "Referral", value: 400, color: "#fed7aa" },
 *       { label: "Campaigns", value: 300, color: "#ffedd5" },
 *     ]}
 *     onViewAll={() => navigate("/admin/analytics")}
 *   />
 */
export function TrafficSourcesChart({
  sources,
  total,
  onViewAll,
  className,
}: TrafficSourcesChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-medium text-orange-600 hover:underline"
          >
            View All
          </button>
        )}
      </CardHeader>

      <CardContent>
        <div className="relative mx-auto h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sources}
                dataKey="value"
                nameKey="label"
                innerRadius="70%"
                outerRadius="100%"
                paddingAngle={2}
                stroke="none"
              >
                {sources.map((source) => (
                  <Cell key={source.label} fill={source.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold text-slate-900 dark:text-white">
              {total.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">Sources</span>
          </div>
        </div>

        <ul className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
          {sources.map((source) => (
            <li key={source.label} className="flex items-center gap-1.5">
              <span
                className={cn("h-2 w-2 rounded-full")}
                style={{ backgroundColor: source.color }}
              />
              <span className="text-slate-500 dark:text-slate-400">
                {source.value} {source.label}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}