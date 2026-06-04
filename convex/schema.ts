import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    reference: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.string(),
    subcategory: v.optional(v.string()),
    price: v.number(),
    oldPrice: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    isBestSeller: v.optional(v.boolean()),
    isNew: v.optional(v.boolean()),
    active: v.boolean(),
  }).index("by_category", ["category"]),
  reviews: defineTable({
    name: v.string(),
    rating: v.number(),
    message: v.string(),
    createdAt: v.number(),
    approved: v.boolean(),
  }),
  productRequests: defineTable({
    name: v.string(),
    phone: v.optional(v.string()),
    product: v.string(),
    createdAt: v.number(),
    status: v.string(),
  }),
  cartItems: defineTable({
    sessionId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
  }).index("by_session", ["sessionId"]),
});
