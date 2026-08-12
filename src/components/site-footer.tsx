import Image from "next/image";
import { Footer } from "@/components/ui/footer";

export function SiteFooter() {
  return (
    <Footer
      logo={<Image src="/logo.svg" alt="" width={325} height={80} className="h-12 w-auto" />}
      brandName="Vilva"
      socialLinks={[]}
      mainLinks={[
        { href: "/", label: "Home" },
        { href: "/products", label: "Products" },
        { href: "/admin", label: "Admin" },
      ]}
      legalLinks={[
        { href: "/privacy", label: "Privacy" },
        { href: "/terms", label: "Terms" },
      ]}
      contact={{
        phone: "+91-9620239811",
        email: "manjushreeenterprisesblr@gmail.com",
        address:
          "#163, Vinakaya Layout, Ullal Main Road, Behind Amma Asharam, Bengaluru, Karnataka, 560056",
      }}
      copyright={{
        text: "© 2009 Vilva",
      }}
    />
  );
}
