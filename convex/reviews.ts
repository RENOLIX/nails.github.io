import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listApproved = query({
  handler: async (ctx) => {
    const reviews = await ctx.db.query("reviews").collect();
    return reviews.filter((review) => review.approved).sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    rating: v.number(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("reviews", {
      ...args,
      createdAt: Date.now(),
      approved: false,
    });
  },
});

export const requestProduct = mutation({
  args: {
    name: v.string(),
    phone: v.optional(v.string()),
    product: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("productRequests", {
      ...args,
      createdAt: Date.now(),
      status: "new",
    });
  },
});
