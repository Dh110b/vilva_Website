import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "M/s. Manjushree Enterprises (established 2009) — a leading supplier and service provider across Karnataka and Tamil Nadu, committed to quality assurance, ethical practices, and rapid customer service.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-10">
        M/s. Manjushree Enterprises
        <br />
        <span className="text-lg font-normal text-muted-foreground">
          Established in 2009
        </span>
      </h1>

      <div className="space-y-10 rounded-lg border border-foreground/25 bg-white/10 p-6 text-muted-foreground shadow-lg backdrop-blur-md dark:border-white/20 dark:bg-white/5">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            About Us
          </h2>
          <p>
            Founded on the virtues of integrity, honesty, and high-quality
            assistance, M/s. Manjushree Enterprises is a leading supplier and
            service provider of a comprehensive range of premium products.
            Through our commitment to transparent dealing and business
            ethics, we have established a strong market presence across
            Karnataka and Tamil Nadu.
          </p>
          <p className="mt-3">
            Under the visionary guidance of our Promoter, Mr. A. Vijaya
            Kumar, our technically efficient team works untiringly to drive
            the company forward, offering innovative products and
            customized, value-added services tailored to the precise needs
            of our clients.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Quality Assurance, Client Satisfaction &amp; Warranty
          </h2>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <span className="font-medium text-foreground">
                2-Year Universal Warranty
              </span>{" "}
              — We provide a comprehensive 2-year warranty on our brand
              products, giving you long-term peace of mind regardless of your
              purchase location or vendor.
            </li>
            <li>
              <span className="font-medium text-foreground">
                International Standards
              </span>{" "}
              — We ensure all products are at par with global benchmarks to
              effectively fulfill your operational requirements.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Flawless Delivery
              </span>{" "}
              — Our core motto balances the launching of innovative products
              with absolute quality assurance and robust warranty support.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Ethical Practices
              </span>{" "}
              — We build long-term trust through consistently fair, honest,
              and transparent dealings with no hidden clauses.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Our Service Commitments
          </h2>
          <h3 className="font-medium text-foreground mb-2">
            VILVA No.1 Service (Quick Assured Service &ndash; QAS)
          </h3>
          <p className="mb-3">
            We provide a structured response system to guarantee rapid issue
            resolution:
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <span className="font-medium text-foreground">
                24/7 Support
              </span>{" "}
              — A dedicated Customer Care Service operating around the clock
              for client convenience.
            </li>
            <li>
              <span className="font-medium text-foreground">
                1-Hour Acknowledgment
              </span>{" "}
              — All registered complaints and issues receive an official
              reference number and acknowledgment within one hour.
            </li>
            <li>
              <span className="font-medium text-foreground">
                1-Day Resolution
              </span>{" "}
              — Acknowledged issues are resolved within one business day.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Proactive Follow-up
              </span>{" "}
              — We connect with clients weekly for general feedback, and
              strictly reconfirm resolved issues after one week to ensure
              absolute gratification.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Visible Contact
              </span>{" "}
              — Customer care details are placed directly on all products for
              effortless accessibility.
            </li>
          </ul>

          <h3 className="font-medium text-foreground mt-6 mb-2">
            Complete Protection (Vilva Suraksha)
          </h3>
          <p>
            We undertake Annual Maintenance Contracts (AMC) and Annual
            Service Contracts (ASC) for products of any make or model.
          </p>

          <h3 className="font-medium text-foreground mt-6 mb-2">
            Go Green Policy
          </h3>
          <p>
            In compliance with government pollution norms and our commitment
            to environmental safety, we actively collect and buy back
            lifeless products to ensure safe, legal disposal.
          </p>
        </section>

        <section className="border-y py-8">
          <h2 className="text-xl font-semibold text-foreground mb-3 text-center">
            The VILVA Promise
          </h2>
          <p className="text-center">
            At M/s. Manjushree Enterprises, we are committed to offering
            superior products, competitive pricing, and excellent customer
            service — all under one roof.
          </p>
          <div className="group relative mx-auto mt-6 w-fit max-w-full overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-8 py-6 shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5">
            <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl transition-opacity duration-300 group-hover:opacity-80" />
            <p className="relative italic text-foreground text-lg text-center">
              &ldquo;Reliable Company, Quality Products, and Committed
              Service.&rdquo;
            </p>
            <p className="relative text-center mt-2 text-base font-medium text-primary">
              All you need, and at VILVA, we have it.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
