import { Badge } from "@/shared/components/ui/badge";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="space-y-3">
      <Badge>{eyebrow}</Badge>
      <div className="space-y-2">
        <h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">
          {title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-[color:var(--muted-foreground)]">
          {description}
        </p>
      </div>
    </div>
  );
}
