export const metadata = {
  title: "Terms & Conditions - Vilva",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Terms &amp; Conditions</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Placeholder content — replace with your actual terms before launch.
      </p>

      <div className="space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Product Listings
          </h2>
          <p>
            Products displayed on this site are for showcase purposes. Prices,
            descriptions, and availability are subject to change without notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Enquiries &amp; Purchases
          </h2>
          <p>
            Submitting an enquiry does not constitute a binding purchase agreement.
            All purchases are subject to a separate agreement made directly between
            you and Vilva.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Limitation of Liability
          </h2>
          <p>
            Vilva is not liable for any indirect, incidental, or consequential
            damages arising from the use of this website or its products.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Changes to Terms
          </h2>
          <p>
            We may update these terms from time to time. Continued use of the site
            after changes constitutes acceptance of the revised terms.
          </p>
        </section>
      </div>
    </div>
  );
}
