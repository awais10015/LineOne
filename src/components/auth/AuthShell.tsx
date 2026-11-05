"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Users, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  wide?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  badge,
  wide = false,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#ff6500]/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#ff6500]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center gap-10 px-4 py-10 lg:flex-row lg:gap-16 lg:px-8">
        <motion.section
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-lg space-y-6 text-center lg:text-left"
        >
          <div className="flex items-center justify-center gap-3 lg:justify-start">
            <Image src="/logo.svg" alt="LineOne" width={48} height={48} />
            <span className="text-2xl font-semibold tracking-tight">LineOne</span>
          </div>

          <div className="space-y-3">
            {badge && (
              <Badge
                variant="secondary"
                className="bg-[#ff6500]/15 text-[#ff6500] border-[#ff6500]/30"
              >
                {badge}
              </Badge>
            )}
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Building community that actually connects
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Real-time feeds, stories, and chat — one place to follow people
              you care about and discover what&apos;s happening.
            </p>
          </div>

          <ul className="hidden space-y-3 text-sm text-muted-foreground lg:block">
            <li className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#ff6500]" />
              Following and Discover feeds tailored to you
            </li>
            <li className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-[#ff6500]" />
              Follow creators and grow your circle
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#ff6500]" />
              Free to start — no credit card required
            </li>
          </ul>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className={`w-full ${wide ? "max-w-lg" : "max-w-md"}`}
        >
          <Card className="border-border/80 bg-card/90 shadow-xl backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-xl">{title}</CardTitle>
              {subtitle && <CardDescription>{subtitle}</CardDescription>}
            </CardHeader>
            <CardContent>{children}</CardContent>
            {footer && (
              <div className="px-6 pb-6 pt-0 flex flex-col gap-4">{footer}</div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
