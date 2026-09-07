import type { ReactNode } from "react";

type Props = {
  device: "desktop" | "mobile";
  label: string;
  children: ReactNode;
};

export function DevicePreview({ device, label, children }: Props) {
  return (
    <div>
      <p className="settings-kicker">{label}</p>
      <div className="mt-2 overflow-x-auto rounded-xl border border-stone-200 bg-stone-100 p-4">
        <div
          className={
            device === "mobile"
              ? "mx-auto w-[375px] overflow-hidden rounded-[28px] border-8 border-stone-800 bg-white shadow-xl"
              : "overflow-hidden rounded-xl border border-stone-200 bg-white"
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
