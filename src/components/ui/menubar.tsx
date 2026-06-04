import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils.ts";

function Menubar({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="menubar" className={cn("flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs", className)} {...props} />;
}

function MenubarMenu({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

function MenubarTrigger({ className, ...props }: React.ComponentProps<"button">) {
  return <button type="button" data-slot="menubar-trigger" className={cn("flex items-center rounded-sm px-2 py-1 text-sm font-medium hover:bg-accent", className)} {...props} />;
}

function MenubarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="menubar-content" className={cn("z-50 min-w-44 rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)} {...props} />;
}

function MenubarItem({ className, inset, ...props }: React.ComponentProps<"div"> & { inset?: boolean }) {
  return <div data-slot="menubar-item" className={cn("relative flex items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent", inset && "pl-8", className)} {...props} />;
}

function MenubarCheckboxItem({ className, checked, children, ...props }: React.ComponentProps<"div"> & { checked?: boolean }) {
  return <div data-slot="menubar-checkbox-item" className={cn("relative flex items-center rounded-sm py-1.5 pr-2 pl-8 text-sm hover:bg-accent", className)} {...props}>{checked ? "✓" : null}{children}</div>;
}

function MenubarRadioGroup({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

function MenubarRadioItem({ className, children, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="menubar-radio-item" className={cn("relative flex items-center rounded-sm py-1.5 pr-2 pl-8 text-sm hover:bg-accent", className)} {...props}>{children}</div>;
}

function MenubarSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="menubar-separator" className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="menubar-shortcut" className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
}

function MenubarSub({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

function MenubarSubTrigger({ className, children, inset, ...props }: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div data-slot="menubar-sub-trigger" className={cn("flex items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent", inset && "pl-8", className)} {...props}>
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </div>
  );
}

function MenubarSubContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="menubar-sub-content" className={cn("z-50 min-w-44 rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)} {...props} />;
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
