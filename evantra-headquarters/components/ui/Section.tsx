import { ReactNode } from "react";
import { cn } from "../../lib/utils";
import Container from "../layout/Container";

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export default function Section({
  children,
  className,
  containerClassName,
}: SectionProps) {
  return (
    <section className={cn("py-20 lg:py-28", className)}>
      <Container className={containerClassName}>
        {children}
      </Container>
    </section>
  );
}