import type { InputHTMLAttributes, ReactNode } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  trailing?: ReactNode;
}

export function FormField({ label, error, trailing, className, id, ...rest }: FormFieldProps) {
  const inputId = id || rest.name;
  return (
    <label htmlFor={inputId} className="flex flex-col gap-1.5 text-[11px] uppercase tracking-[0.2em] text-white/40">
      <span className="flex items-center justify-between">
        <span>{label}</span>
        {trailing}
      </span>
      <input
        id={inputId}
        {...rest}
        className={
          className ||
          "h-11 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 text-sm normal-case tracking-normal text-white placeholder:text-white/25 focus:border-[#00d4ff]/60 focus:outline-none"
        }
      />
      {error && <span className="text-[11px] normal-case tracking-normal text-[#ef4444]">{error}</span>}
    </label>
  );
}
