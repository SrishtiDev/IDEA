"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { WordsPullUp } from "@/components/ui/prisma-hero";
import Link from "next/link";

export default function Home() {
  return (
    <div className="absolute bottom-0 left-0 right-0 px-4 pb-2 sm:px-6 md:px-10">
      <div className="grid grid-cols-12 items-end gap-4">
        <div className="col-span-12 lg:col-span-8">
          <h1
            className="font-medium leading-[0.85] tracking-[-0.07em] text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]"
            style={{ color: "#E1E0CC" }}
          >
            <WordsPullUp text="DEA" showAsterisk />
          </h1>
        </div>

        <div className="col-span-12 flex flex-col gap-5 pb-6 lg:col-span-4 lg:pb-10">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-xs text-primary/80 sm:text-sm md:text-base"
            style={{ lineHeight: 1.2 }}
          >
            Get project ideas based on your tech stack. DEA is an intelligence
            engine built for the future of creation.
          </motion.p>

          <Link href="/idea">
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group inline-flex items-center gap-2 self-start rounded-full bg-primary py-1 pl-5 pr-1 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base shadow-[0_0_15px_rgba(192,193,255,0.4)]"
            >
              Get Started
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                <ArrowRight
                  className="h-4 w-4"
                  style={{ color: "#E1E0CC" }}
                />
              </span>
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}
