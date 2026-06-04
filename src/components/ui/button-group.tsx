import { cn } from "@/lib/utils.ts";
import { Separator } from "@/components/ui/separator.tsx";

function ButtonGroup({ className, orientation = "horizontal", ...props }: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn("flex w-fit items-stretch", orientation === "vertical" && "flex-col", className)}
      {...props}
    />
  );
}

function ButtonGroupText({ className, ...props }: React.ComponentProps<"div"> & { asChild?: boolean }) {
  return <div className={cn("bg-muted flex items-center gap-2 rounded-md border px-4 text-sm font-medium shadow-xs", className)} {...props} />;
}

function ButtonGroupSeparator({ className, orientation = "vertical", ...props }: React.ComponentProps<typeof Separator>) {
  return <Separator data-slot="button-group-separator" orientation={orientation} className={cn("bg-input relative !m-0 self-stretch", className)} {...props} />;
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText };
