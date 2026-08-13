import { Trophy } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export interface PointsEarnedCardProps {
  points: number;
  onEarnPoint?: () => void;
  onViewItems?: () => void;
  className?: string;
}

/**
 * PointsEarnedCard
 *
 * Rewards widget in the dashboard's right rail (ECOMS reference: trophy
 * icon, points total, "Points Earned" caption, and two actions).
 *
 * Example:
 *   <PointsEarnedCard points={3764} onEarnPoint={handleEarn} onViewItems={handleViewItems} />
 */
export function PointsEarnedCard({
  points,
  onEarnPoint,
  onViewItems,
  className,
}: PointsEarnedCardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center gap-1 text-center">
        <Trophy className="h-14 w-14 text-amber-400" aria-hidden="true" fill="currentColor" />

        <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
          {points.toLocaleString()}
        </p>

        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Points Earned
        </p>
        <p className="text-xs text-slate-400">
          Collect reward points with each purchase.
        </p>

        <div className="mt-3 flex w-full gap-2">
          <Button size="sm" fullWidth onClick={onEarnPoint}>
            Earn Point
          </Button>
          <Button size="sm" variant="outline" fullWidth onClick={onViewItems}>
            View Items
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}