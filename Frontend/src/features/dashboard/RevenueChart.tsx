import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";

export interface RevenuePoint {
  day: string;
  order: number;
  income: number;
}

export interface RevenueChartProps {
  data: RevenuePoint[];
  className?: string;
}

/**
 * RevenueChart
 *
 * "Total Revenue" card from the ECOMS dashboard reference: dual line chart
 * (Order in orange, Income in purple) with a day-of-week x-axis. Built on
 * recharts, wrapped in the existing Card primitives so it matches every
 * other card in the app.
 *
 * Example:
 *   <RevenueChart
 *     data={[
 *       { day: "Mon", order: 20, income: 30 },
 *       { day: "Tue", order: 45, income: 40 },
 *     ]}
 *   />
 */
export function RevenueChart({ data, className }: RevenueChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Total Revenue</CardTitle>
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Order
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            Income
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  borderColor: "#e2e8f0",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="order"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 4, fill: "#f97316" }}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 4, fill: "#8b5cf6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}