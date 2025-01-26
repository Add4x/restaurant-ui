export function Divider() {
  return (
    <div className="container relative mx-auto">
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center mx-auto"
      >
        <div className="w-full h-px bg-linear-to-r from-transparent via-primary to-transparent" />
      </div>
    </div>
  );
}
