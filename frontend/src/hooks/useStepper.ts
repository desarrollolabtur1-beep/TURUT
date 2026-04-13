/**
 * useStepper — Hook para manejar navegación entre pasos
 *
 * Uso:
 *   const stepper = useStepper(3); // 3 pasos totales
 *   stepper.currentStep  // 0-indexed
 *   stepper.next()       // avanza
 *   stepper.back()       // retrocede
 *   stepper.isFirst      // true si estamos en paso 0
 *   stepper.isLast       // true si estamos en el último paso
 *   stepper.progress     // 0.0 → 1.0
 */
import { useState, useCallback } from 'react';

interface StepperState {
  currentStep: number;
  totalSteps: number;
  next: () => void;
  back: () => void;
  goTo: (step: number) => void;
  reset: () => void;
  isFirst: boolean;
  isLast: boolean;
  progress: number; // 0.0 a 1.0
}

export function useStepper(totalSteps: number, initialStep = 0): StepperState {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const next = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const back = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goTo = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps]
  );

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  return {
    currentStep,
    totalSteps,
    next,
    back,
    goTo,
    reset,
    isFirst: currentStep === 0,
    isLast: currentStep === totalSteps - 1,
    progress: totalSteps <= 1 ? 1 : currentStep / (totalSteps - 1),
  };
}
