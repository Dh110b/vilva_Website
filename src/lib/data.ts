import fs from "fs";
import path from "path";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  demoUrl?: string;
  createdAt: string;
};

export type ReviewReply = {
  id: string;
  name: string;
  message: string;
  isOwner: boolean;
  createdAt: string;
};

export type Review = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  description: string;
  images: string[];
  replies: ReviewReply[];
  createdAt: string;
};

export type Enquiry = {
  id: string;
  productId: string;
  productName: string;
  name: string;
  email: string;
  phone?: string;
  numberOfTanks?: string;
  address: string;
  pincode: string;
  sumpOrBoreCapacity?: string;
  motorPhaseType?: string;
  motorType?: string;
  starterType?: string;
  numberOfMotors?: string;
  waterSource?: string;
  message?: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const productsFile = path.join(dataDir, "products.json");
const enquiriesFile = path.join(dataDir, "enquiries.json");
const reviewsFile = path.join(dataDir, "reviews.json");

function ensureFile(file: string) {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, "[]", "utf-8");
}

function readJson<T>(file: string): T[] {
  ensureFile(file);
  const raw = fs.readFileSync(file, "utf-8");
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeJson<T>(file: string, data: T[]) {
  ensureFile(file);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

export function getProducts(): Product[] {
  return readJson<Product>(productsFile).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getProduct(id: string): Product | undefined {
  return readJson<Product>(productsFile).find((p) => p.id === id);
}

export function createProduct(input: Omit<Product, "id" | "createdAt">): Product {
  const products = readJson<Product>(productsFile);
  const product: Product = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  products.push(product);
  writeJson(productsFile, products);
  return product;
}

export function updateProduct(
  id: string,
  input: Partial<Omit<Product, "id" | "createdAt">>
): Product | undefined {
  const products = readJson<Product>(productsFile);
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  products[idx] = { ...products[idx], ...input };
  writeJson(productsFile, products);
  return products[idx];
}

export function deleteProduct(id: string): boolean {
  const products = readJson<Product>(productsFile);
  const next = products.filter((p) => p.id !== id);
  writeJson(productsFile, next);
  return next.length !== products.length;
}

export function getEnquiries(): Enquiry[] {
  return readJson<Enquiry>(enquiriesFile).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createEnquiry(input: Omit<Enquiry, "id" | "createdAt">): Enquiry {
  const enquiries = readJson<Enquiry>(enquiriesFile);
  const enquiry: Enquiry = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  enquiries.push(enquiry);
  writeJson(enquiriesFile, enquiries);
  return enquiry;
}

export function getReviews(productId: string): Review[] {
  return readJson<Review>(reviewsFile)
    .filter((r) => r.productId === productId)
    .map((r) => ({ ...r, replies: r.replies ?? [] }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getProductRatings(): Record<string, { average: number; count: number }> {
  const reviews = readJson<Review>(reviewsFile);
  const byProduct = new Map<string, number[]>();
  for (const review of reviews) {
    const ratings = byProduct.get(review.productId) ?? [];
    ratings.push(review.rating);
    byProduct.set(review.productId, ratings);
  }
  const result: Record<string, { average: number; count: number }> = {};
  for (const [productId, ratings] of byProduct) {
    result[productId] = {
      average: ratings.reduce((sum, r) => sum + r, 0) / ratings.length,
      count: ratings.length,
    };
  }
  return result;
}

export function createReview(
  input: Omit<Review, "id" | "createdAt" | "replies">
): Review {
  const reviews = readJson<Review>(reviewsFile);
  const review: Review = {
    ...input,
    replies: [],
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);
  writeJson(reviewsFile, reviews);
  return review;
}

export function addReviewReply(
  reviewId: string,
  input: Omit<ReviewReply, "id" | "createdAt">
): ReviewReply | undefined {
  const reviews = readJson<Review>(reviewsFile);
  const idx = reviews.findIndex((r) => r.id === reviewId);
  if (idx === -1) return undefined;

  const reply: ReviewReply = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const existingReplies = reviews[idx].replies ?? [];
  reviews[idx] = { ...reviews[idx], replies: [...existingReplies, reply] };
  writeJson(reviewsFile, reviews);
  return reply;
}
