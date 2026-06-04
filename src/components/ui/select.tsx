import {
  createContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectContextValue = {
  open: boolean;
  selectedLabel: string;
  setOpen: (open: boolean) => void;
  choose: (value: string, label: string) => void;
};

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used inside <Select>");
  }
  return context;
}

type SelectProps = PropsWithChildren<{
  onValueChange?: (value: string) => void;
}>;

export function Select({ children, onValueChange }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");

  const choose = (value: string, label: string) => {
    setSelectedLabel(label);
    setOpen(false);
    onValueChange?.(value);
  };

  return (
    <SelectContext.Provider value={{ open, selectedLabel, setOpen, choose }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = useSelectContext();

  return (
    <button
      type="button"
      className={cn("ui-select-trigger", className)}
      onClick={() => setOpen(!open)}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown className="h-4 w-4 opacity-60" />
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { selectedLabel } = useSelectContext();

  return (
    <span className={selectedLabel ? "text-foreground" : "text-muted-foreground"}>
      {selectedLabel || placeholder}
    </span>
  );
}

export function SelectContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { open } = useSelectContext();

  if (!open) {
    return null;
  }

  return (
    <div className={cn("ui-select-content", className)} {...props}>
      {children}
    </div>
  );
}

export function SelectItem({
  value,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLButtonElement> & { value: string }) {
  const { choose } = useSelectContext();
  const label = typeof children === "string" ? children : value;

  return (
    <button
      type="button"
      className={cn("ui-select-item", className)}
      onClick={() => choose(value, label)}
      {...props}
    >
      {children}
    </button>
  );
}
