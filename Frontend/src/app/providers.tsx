import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";

export interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders
 *
 * Single place to compose every top-level provider (Redux, and later
 * things like a theme provider or a query client, if introduced). Wrap
 * <App /> with this at the entry point (main.tsx):
 *
 *   <AppProviders>
 *     <App />
 *   </AppProviders>
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}
