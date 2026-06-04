import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils.ts";

function NavigationMenu({ className, children, ...props }: React.ComponentProps<"nav"> & { viewport?: boolean }) {
  return <nav data-slot="navigation-menu" className={cn("relative flex max-w-max flex-1 items-center justify-center", className)} {...props}>{children}</nav>;
}

function NavigationMenuList({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="navigation-menu-list" className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)} {...props} />;
}

function NavigationMenuItem(props: React.ComponentProps<"li">) {
  return <li data-slot="navigation-menu-item" {...props} />;
}

function NavigationMenuTrigger({ className, children, ...props }: React.ComponentProps<"button">) {
  return (
    <button type="button" data-slot="navigation-menu-trigger" className={cn("group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent", className)} {...props}>
      {children}
      <ChevronDown className="relative top-px ml-1 h-3 w-3" aria-hidden="true" />
    </button>
  );
}

function NavigationMenuContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="navigation-menu-content" className={cn("left-0 top-0 w-full md:absolute md:w-auto", className)} {...props} />;
}

function NavigationMenuLink({ className, ...props }: React.ComponentProps<"a">) {
  return <a data-slot="navigation-menu-link" className={cn("block rounded-md p-2 text-sm transition hover:bg-accent hover:text-accent-foreground", className)} {...props} />;
}

function NavigationMenuViewport({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="navigation-menu-viewport" className={cn("origin-top-center relative mt-1.5 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow", className)} {...props} />;
}

function NavigationMenuIndicator({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="navigation-menu-indicator" className={cn("top-full z-1 flex h-1.5 items-end justify-center overflow-hidden", className)} {...props} />;
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
