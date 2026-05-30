import { cn } from "@/shared/lib/cn";

type BrandCoinIconProps = {
  className?: string;
};

export function BrandCoinIcon({ className }: BrandCoinIconProps) {
  return (
    <img
      alt=""
      aria-hidden
      className={cn(className)}
      draggable={false}
      src="/brand/coin.png"
    />
  );
}
