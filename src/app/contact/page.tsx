import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact Us - Vilva",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

      <div className="space-y-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Phone className="w-5 h-5 shrink-0" />
          <a href="tel:+919620239811" className="hover:text-foreground">
            +91-9620239811
          </a>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Phone className="w-5 h-5 shrink-0" />
          <a href="tel:+919620239813" className="hover:text-foreground">
            Customer Care: +91-9620239813
          </a>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Mail className="w-5 h-5 shrink-0" />
          <a href="mailto:manjushreeenterprisesblr@gmail.com" className="hover:text-foreground">
            manjushreeenterprisesblr@gmail.com
          </a>
        </div>
        <div className="flex items-start gap-3 text-muted-foreground">
          <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
          <span>
            #163, Vinakaya Layout, Ullal Main Road, Behind Amma Asharam, Bengaluru,
            Karnataka, 560056
          </span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-10">
        For product-specific questions, use the &quot;Send Enquiry&quot; button on any
        product page and we&apos;ll get back to you directly.
      </p>
    </div>
  );
}
