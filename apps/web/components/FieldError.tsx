interface FieldErrorProps {
  errors: Array<string | { message: string }>;
}

export function FieldError({ errors }: FieldErrorProps) {
  if (typeof errors === "undefined") {
    return
  }
  if (errors.length === 0) return null;

  const error = errors[0];

  return (
    <p className="absolute top-0 mt-1 text-sm text-red-500">
      {typeof error === "string" ? error : error?.message}
    </p>
  );
}