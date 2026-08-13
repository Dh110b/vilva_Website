import Link from "next/link";
import { getProducts } from "@/lib/data";
import { HomeHero } from "@/components/home-hero";
import { ElasticGallery } from "@/components/ui/elastic-gallery";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CheckCircle2, XCircle } from "lucide-react";

const trustItems = [
  "24 Months Warranty*",
  "Made in India",
  "Single & Three Phase Compatible",
  "Submersible & Monoblock Pump Compatible",
];

const problems = [
  "Overflowing tanks wasting water every day?",
  "Motors burning out from dry runs?",
  "Manually checking sump and tank levels?",
  "Voltage fluctuations damaging your pump?",
];

const stopItems = ["Tank overflow", "Dry running of your motor", "Motor running in high/low voltage"];
const saveItems = ["Time", "Water", "Electricity", "Manpower & energy", "Your bore/sump motor pump"];

export default async function Home() {
  const featuredProducts = (await getProducts()).slice(0, 5);

  return (
    <div className="flex w-full flex-col">
      <HomeHero />

      <section className="border-y bg-muted/40">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-4 text-sm font-medium">
          {trustItems.map((item) => (
            <span key={item} className="flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="size-4 text-primary" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-3xl font-bold mb-6">Tired of...</h2>
        <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
          {problems.map((problem) => (
            <div
              key={problem}
              className="rounded-lg border border-accent/40 bg-accent/30 p-4 text-left text-lg text-accent-foreground shadow-lg backdrop-blur-md dark:border-accent/30 dark:bg-accent/20"
            >
              {problem}
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-xl font-medium">
          VILVA&rsquo;s Automatic Water Level Controller handles it all — automatically.
        </p>
      </section>

      <section className="py-10">
        <div className="container mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-2">
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 shadow-lg backdrop-blur-md dark:border-destructive/20 dark:bg-destructive/10">
            <h3 className="mb-4 text-3xl font-bold text-destructive">STOP</h3>
            <ul className="space-y-3">
              {stopItems.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <XCircle className="size-5 shrink-0 text-destructive" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-success/30 bg-success/10 p-6 shadow-lg backdrop-blur-md dark:border-success/20 dark:bg-success/10">
            <h3 className="mb-4 text-3xl font-bold text-success">SAVE</h3>
            <ul className="space-y-3">
              {saveItems.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Button variant="ghost" render={<Link href="/products" />} nativeButton={false}>
              View all <ArrowRightIcon className="size-4 ms-1" />
            </Button>
          </div>

          <ElasticGallery
            items={featuredProducts.map((product) => ({
              id: product.id,
              title: product.name,
              category: `₹${product.price.toLocaleString("en-IN")}`,
              src: product.images[0] ?? "",
              alt: product.name,
              href: `/products/${product.id}`,
            }))}
          />
        </section>
      )}
    </div>
  );
}
