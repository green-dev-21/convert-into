"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Tab = {
  title: string;
  value: string;
  content?: React.ReactNode;
};

export const Tabs = ({
  tabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {
  const [active, setActive] = useState<Tab>(tabs[0]);

  return (
    <div className="flex flex-col w-full h-full">
      <div
        className={cn(
          "flex flex-row items-center justify-start overflow-auto no-visible-scrollbar [perspective:1000px] relative transition-all duration-300 ease-in-out gap-2 p-1",
          containerClassName
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActive(tab)}
            className={cn(
              "relative px-4 py-2 rounded-full text-sm md:text-base transition-colors duration-200",
              active.value === tab.value ? "text-white" : "text-neutral-400 hover:text-neutral-200",
              tabClassName
            )}
          >
            {active.value === tab.value && (
              <motion.div
                layoutId="active-tab"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn(
                  "absolute inset-0 bg-blue-600 rounded-full z-0",
                  activeTabClassName
                )}
              />
            )}
            <span className="relative z-10">{tab.title}</span>
          </button>
        ))}
      </div>
      <div className={cn("mt-4 w-full h-full min-h-[150px]", contentClassName)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {active.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
