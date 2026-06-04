import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const products = args.category
      ? await ctx.db.query("products").withIndex("by_category", (q) => q.eq("category", args.category as string)).collect()
      : await ctx.db.query("products").collect();

    return products.filter((product) => {
      if (!product.active) return false;
      if (args.subcategory && product.subcategory !== args.subcategory) return false;
      return true;
    });
  },
});

export const getNew = query({
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return products.filter((product) => product.active && product.isNew);
  },
});

export const getBestSellers = query({
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return products.filter((product) => product.active && product.isBestSeller);
  },
});
