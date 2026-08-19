import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  href,
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg",

    secondary:
      "bg-slate-900 text-white shadow-sm hover:bg-slate-800",

    outline:
      "border border-slate-300 bg-white text-slate-900 hover:border-blue-600 hover:text-blue-600",
  };

  const width = fullWidth ? "w-full" : "";

  const classes = `${base} ${variants[variant]} ${width} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}