import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  value: string;
}

const Input = ({ label, className, ...props }: InputProps) => {
  return (
    <div className="w-full flex flex-col items-start justify-center gap-2 mb-2">
      <label className="text-md font-medium text-neutral-200">{label}</label>

      <input
        {...props}
        className={`w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 py-1 text-white placeholder:text-neutral-500 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 hover:border-neutral-500 ${className ?? ""}`}
      />
    </div>
  );
};

export default Input;
