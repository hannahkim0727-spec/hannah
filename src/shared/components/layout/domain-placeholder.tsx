import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type DomainPlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
};

export function DomainPlaceholder({
  eyebrow,
  title,
  description,
  bullets,
}: DomainPlaceholderProps) {
  return (
    <Card>
      <CardHeader>
        <Badge>{eyebrow}</Badge>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {bullets.map((bullet) => (
            <div
              key={bullet}
              className="rounded-[20px] border border-[color:var(--border)] bg-white/65 p-4 text-sm leading-6 text-[color:var(--muted-foreground)]"
            >
              {bullet}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
