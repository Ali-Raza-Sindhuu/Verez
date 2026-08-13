import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Select } from "../../components/forms/select";

export interface CustomersMapPoint {
  day: string;
  newCustomers: number;
  returningCustomers: number;
}

export interface CustomersMapProps {
  data: CustomersMapPoint[];
  rangeValue: string;
  onRangeChange: (value: string) => void;
  className?: string;
}

const RANGE_OPTIONS = [
  { label: "Last Week", value: "last_week" },
  { label: "Last Month", value: "last_month" },
  { label: "Last Quarter", value: "last_quarter" },
];

/**
 * CustomersMap
 *
 * "Customers Map" card from the ECOMS dashboard reference: grouped bar
 * chart (orange = new customers, purple = returning) with a day-of-week
 * x-axis and a range dropdown in the header.
 *
 * Example:
 *   <CustomersMap
 *     rangeValue={range}
 *     onRangeChange={setRange}
 *     data={[
 *       { day: "Mon", newCustomers: 12, returningCustomers: 30 },
 *       { day: "Tue", newCustomers: 20, returningCustomers: 28 },
 *     ]}
 *   />
 */
export function CustomersMap({
  data,
  rangeValue,
  onRangeChange,
  className,
}: CustomersMapProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Customers Map</CardTitle>
        <Select
          options={RANGE_OPTIONS}
          value={rangeValue}
          onChange={(event) => onRangeChange(event.target.value)}
          containerClassName="w-36"
        />
      </CardHeader>

      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
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
                contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0", fontSize: 12 }}
              />
              <Bar dataKey="newCustomers" fill="#f97316" radius={[3, 3, 0, 0]} />
              <Bar dataKey="returningCustomers" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}