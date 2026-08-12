import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getProduct, getReviews } from "@/lib/data";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";
import { EnquiryForm } from "@/components/enquiry-form";
import { ProductDetailPage } from "@/components/ui/product-detail-page";

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
  const isAuthed = isValidSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);

  return (
    <ProductDetailPage
      product={product}
      reviews={reviews}
      isAuthed={isAuthed}
      breadcrumbs={[
        { label: "Products", href: "/products" },
        { label: product.name, href: `/products/${product.id}` },
      ]}
      enquiryAction={<EnquiryForm productId={product.id} productName={product.name} />}
    />
  );
}
