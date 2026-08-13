import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Vilva Distributors and Services — our story, our promoter's background in the two-wheeler and battery distribution industry, and our mission to build reliable, made-in-India water level controllers.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-10">About Us</h1>

      <div className="space-y-10 rounded-lg border border-foreground/25 bg-white/10 p-6 text-muted-foreground shadow-lg backdrop-blur-md dark:border-white/20 dark:bg-white/5">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Profile of the Promoter
          </h2>
          <p>
            Mr. Vijaya Kumar is a B.Sc graduate with deep roots in the two-wheeler
            industry. He began his career as Works In-charge at a reputed Yamaha
            two-wheeler showroom for 8 years, later being promoted to Works Manager at
            a reputed Bajaj two-wheeler showroom for 6 years.
          </p>
          <p className="mt-3">
            Drawing on this extensive experience in the two-wheeler industry, he went
            on to found M/s Manjushree Enterprises as a distributor for MINDA
            batteries across Mysore, Chamarajnagar, and Kodagu districts. With
            dedication and the support of partners and colleagues, the business grew
            its monthly sales from 20 units to 1,500 units, and expanded its
            authorization from 3 districts to 7 districts — Bangalore, Kolar,
            Ramnagar, and Tumkur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            About the Name &ldquo;Vilva&rdquo;
          </h2>
          <p>
            Bilvapatra, or vilva leaves — otherwise known as Bel leaves — are among
            the most sacred offerings to Lord Shiva. It is a herb of very high
            medicinal value, and the vilva leaf has found its presence across the
            various Puranas, playing an important role in various mythologies.
          </p>
          <p className="mt-3">
            The word bilva (Bel tree) is usually used as bilva-patra (leaf of Bel). It
            is a sacred tree of great ceremonial importance. Leaves of this sacred
            tree are generally trifoliate — a form symbolic of the Trikal (Brahma,
            Vishnu, and Mahesh), the three eyes of Lord Shiva, and Trishakti
            (Volition, Action, and Knowledge).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            About Our Caption
          </h2>
          <p className="italic text-foreground mb-3">
            &ldquo;Volition, Action &amp; Knowledge&rdquo;
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <span className="font-medium text-foreground">Volition</span> — an act
              of making a choice or decision; the power of choosing or determining:
              will.
            </li>
            <li>
              <span className="font-medium text-foreground">Action</span> — a process
              of acting or moving, the exertion of power or effort toward a purpose.
            </li>
            <li>
              <span className="font-medium text-foreground">Knowledge</span> —
              familiarity, awareness, or understanding gained through experience or
              study.
            </li>
          </ul>
          <p className="mt-3">
            At Vilva Distributors and Services Private Limited, we believe that all
            three of these elements are required for any successful and sustainable
            venture.
          </p>
        </section>

        <section className="border-y py-8">
          <p className="italic text-foreground text-lg text-center">
            &ldquo;Vision without action is a daydream. Action without vision is a
            nightmare.&rdquo;
          </p>
          <p className="text-center mt-2 text-sm">— Soichiro Honda</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Our Vision</h2>
          <p>
            Our core business vision is to be a leading distributor and a committed
            service provider. We are expanding on this vision by manufacturing
            high-quality, customized products and providing the best possible
            customer and consumer experience at every moment of truth.
          </p>
          <p className="mt-3">
            Using this strategy, we strive to make life easier for our customers and
            consumers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Our Mission</h2>
          <p>
            A vision statement is what an organization wants to become. A mission
            statement concerns what an organization is all about.
          </p>
          <p className="mt-3">
            Since our founding, our mission has centered on growing our product range
            — including MINDA products, cables, brake shoes, clutch plates, and
            batteries — building out retail counters and service centres across
            district headquarters, and steadily expanding our retail partner network.
            We have also worked toward manufacturing and marketing in-house products
            such as heavy-capacity tubular batteries, battery chargers, de-ionised
            water, electrolyte, and petroleum jelly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Registered Business Details
          </h2>
          <p>
            Vilva is operated under M/s Manjushree Enterprises, a GST-registered
            business (GSTIN: <span className="font-medium text-foreground">29AZRPV9644D1ZG</span>),
            based at #163, Vinayaka Layout, Bengaluru, Karnataka.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Get in Touch
          </h2>
          <p>
            Have a question about our products? Visit our{" "}
            <a href="/contact" className="underline underline-offset-4">
              Contact Us
            </a>{" "}
            page or send an enquiry directly from any product page.
          </p>
        </section>
      </div>
    </div>
  );
}
