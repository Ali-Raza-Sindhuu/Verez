import type { ReactNode } from "react";
import { Footer } from "./Footer";

export interface PublicLayoutProps {
  header: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * PublicLayout
 *
 * Structural shell for customer-facing storefront pages (home, product
 * listing, product detail, cart, checkout). `header` is passed in rather
 * than built here since the storefront navbar (logo, nav links, cart icon,
 * search) is product-specific, not a generic UI primitive.
 *
 * Example:
 *   <PublicLayout header={<StorefrontNavbar />} footer={<Footer><FooterLinks /></Footer>}>
 *     <ProductGrid products={products} />
 *   </PublicLayout>
 */
export function PublicLayout({ header, footer, children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {header}
      <main className="flex-1">{children}</main>
      {footer ?? <Footer />}
    </div>
  );
}