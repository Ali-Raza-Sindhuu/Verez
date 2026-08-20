import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { bootstrapAuth } from "@/store/features/auth/authSlice";

// Landed on after a successful Google/GitHub redirect. The backend already
// set the httpOnly refresh cookie — we just need to exchange it for an
// access token + user via the same bootstrapAuth() flow used on page load.
export default function OAuthCallback() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    dispatch(bootstrapAuth()).then((result) => {
      if (bootstrapAuth.fulfilled.match(result)) {
        navigate("/dashboard", { replace: true });
      } else {
        setFailed(true);
      }
    });
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {failed ? (
          <>
            <p className="text-[#14151A] font-medium">Sign-in didn't go through.</p>
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="mt-3 text-[#3D6DF2] hover:underline text-sm"
            >
              Back to login
            </button>
          </>
        ) : (
          <p className="text-black/50 text-sm">Signing you in...</p>
        )}
      </div>
    </div>
  );
}
