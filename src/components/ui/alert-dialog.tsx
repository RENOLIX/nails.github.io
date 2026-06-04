import * as React from "react";
import { cn } from "@/lib/utils.ts";
import { buttonVariants } from "@/components/ui/button.tsx";

function AlertDialog({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

function AlertDialogTrigger({ className, ...props }: React.ComponentProps<"button">) {
  return <button type="button" data-slot="alert-dialog-trigger" className={className} {...props} />;
}

function AlertDialogPortal({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

function AlertDialogOverlay({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-overlay" className={cn("fixed inset-0 z-50 bg-black/50", className)} {...props} />;
}

function AlertDialogContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-content"
      className={cn("bg-background fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg", className)}
      {...props}
    />
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-header" className={cn("flex flex-col gap-2 text-center sm:text-left", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-footer" className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="alert-dialog-title" className={cn("text-lg font-semibold", className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="alert-dialog-description" className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

function AlertDialogAction({ className, ...props }: React.ComponentProps<"button">) {
  return <button type="button" className={cn(buttonVariants(), className)} {...props} />;
}

function AlertDialogCancel({ className, ...props }: React.ComponentProps<"button">) {
  return <button type="button" className={cn(buttonVariants({ variant: "outline" }), className)} {...props} />;
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
