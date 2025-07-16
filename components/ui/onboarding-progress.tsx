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
      <CardContent className="flex items-center !px-4 sm:!px-8">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex-1 flex items-center justify-center relative">
              <div className={cn(
                "flex flex-col items-center relative",
                "w-full"
              )}>
                <div className="relative w-full flex justify-center">
                  {/* Step circle */}
                  <div
                    className={cn(
                      "w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10 overflow-hidden",
                      isCompleted && "bg-gradient-to-r from-[#0f766e] to-[#14b8a6] border-[#0f766e] text-white shadow-lg",
                      isCurrent && "bg-gradient-to-r from-[#0f766e] via-[#0d9488] to-[#14b8a6] border-[#0f766e] text-white shadow-md [background-size:200%_200%] animate-[gradientMove_3s_ease-in-out_infinite]",
                      !isCompleted && !isCurrent && "border-[#0f766e] bg-[#0f766e]/10 text-[#0f766e]"
                    )}
                  >

                    {isCompleted ? (
                      <Check className="w-5 h-5 sm:w-7 sm:h-7 relative z-10" />
                    ) : (
                      <span className="text-sm sm:text-base font-semibold relative z-10">{stepNumber}</span>
                    )}
                  </div>

                  {/* Arrow connector */}
                  {index < steps.length - 1 && (
                    <div className="absolute w-full left-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center z-0">
                      <div className="flex -ml-1">
                        <ChevronRight className={cn(
                          "w-6 h-6 sm:w-10 sm:h-10 transition-all duration-300 text-[#0f766e]"
                        )} strokeWidth={1.5} />
                        <ChevronRight className={cn(
                          "w-6 h-6 sm:w-10 sm:h-10 transition-all duration-300 text-[#0f766e] -ml-4 sm:-ml-6"
                        )} strokeWidth={1.5} />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Step info */}
                <div className="mt-2 text-center">
                  <p className={cn(
                    "text-xs sm:text-base font-medium text-[#0f766e] transition-colors duration-300",
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