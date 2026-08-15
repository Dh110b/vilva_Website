import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getProduct, getReviews } from "@/lib/data";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";
import { EnquiryForm } from "@/components/enquiry-form";
import { ProductDetailPage } from "@/components/ui/product-detail-page";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return {};

  const description = product.description.slice(0, 160).trim();
  const image = product.images[0];

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title: product.name,
      description,
      url: `${SITE_URL}/products/${product.id}`,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  const reviews = await getReviews(product.id);
  const cookieStore = await cookies();
  const isAuthed = !!(await isValidSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value));

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : undefined;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    url: `${SITE_URL}/products/${product.id}`,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.id}`,
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
    ...(avgRating !== undefined && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toFixed(1),
        reviewCount: reviews.length,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailPage
        product={product}
        reviews={reviews}
        isAuthed={isAuthed}
        breadcrumbs={[
          { label: "Products", href: "/products" },
          { label: product.name, href: `/products/${product.id}` },
        ]}
        enquiryAction={
          <EnquiryForm
            productId={product.id}
            productName={product.name}
            productType={product.productType}
          />
        }
      />
    </>
  );
}
