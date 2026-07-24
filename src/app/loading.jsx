import {Spinner} from "@heroui/react";

export default function Loading() {
  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <span className="text-xs text-muted">Large</span>
      </div>
    </div>
  );
}