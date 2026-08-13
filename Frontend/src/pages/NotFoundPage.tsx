import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/feedback/emptyState";

/**
 * NotFoundPage
 *
 * Catch-all route for unmatched paths.
 */
export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <EmptyState
        title="Page not found"
        description="The page you're looking for doesn't exist or has moved."
        action={<Button onClick={() => navigate("/")}>Go home</Button>}
      />
    </div>
  );
}
