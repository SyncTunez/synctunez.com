'use client';

import { cn } from "@/lib/utils";
import { Check, ChevronRight } from "lucide-react";
import { Card, CardContent } from "./card";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: {
    title: string;
    description: string;
  }[];
}

export function OnboardingProgress({ currentStep, totalSteps, steps }: OnboardingProgressProps) {
  return (
    <Card className="w-full bg-muted shadow-lg border border-muted-foreground/10 !py-2">
      <CardContent className="flex items-center !px-8">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex-1 flex items-center justify-center">
              <div className={cn(
                "flex flex-col items-center",
                "w-full max-w-[180px]"
              )}>
                <div className="relative w-full flex justify-center">
                  {/* Step circle */}
                  <div
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                      isCompleted && "bg-gradient-to-r from-[#0f766e] to-[#14b8a6] border-[#0f766e] text-white shadow-lg",
                      isCurrent && "bg-[#0f766e] border-[#0f766e] text-white shadow-md",
                      !isCompleted && !isCurrent && "border-[#0f766e] bg-[#0f766e]/10 text-[#0f766e]"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-7 h-7" />
                    ) : (
                      <span className="text-base font-semibold">{stepNumber}</span>
                    )}
                  </div>

                  {/* Arrow connector */}
                  {index < steps.length - 1 && (
                    <div className="absolute right-[-5rem] top-1/2 -translate-y-1/2 flex gap-[-0.5rem]">
                      <ChevronRight className={cn(
                        "w-10 h-10 transition-all duration-300 text-[#0f766e]"
                      )} strokeWidth={1.5} />
                      <ChevronRight className={cn(
                        "w-10 h-10 transition-all duration-300 text-[#0f766e] -ml-6"
                      )} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                
                {/* Step info */}
                <div className="mt-2 text-center">
                  <p className={cn(
                    "text-base font-medium text-[#0f766e] transition-colors duration-300",
                  )}>
                    {step.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
} 