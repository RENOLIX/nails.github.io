import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCart = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db.query("cartItems").withIndex("by_session", (q) => q.eq("sessionId", args.sessionId)).collect();
  },
});

export const addToCart = mutation({
  args: {
    sessionId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db.query("cartItems").withIndex("by_session", (q) => q.eq("sessionId", args.sessionId)).collect();
    const existing = items.find((item) => item.productId === args.productId);

    if (existing) {
      await ctx.db.patch(existing._id, { quantity: existing.quantity + args.quantity });
      return existing._id;
    }

    return ctx.db.insert("cartItems", args);
  },
});
