import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { number: 1, title: "Informations de l'école" },
  { number: 2, title: "Compte administrateur" },
  { number: 3, title: "Confirmation" },
];

export default function StepIndicator({ currentStep, _totalSteps }: StepIndicatorProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  step.number < currentStep
                    ? "bg-linear-to-r from-blue-500 to-purple-500 text-white"
                    : step.number === currentStep
                    ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                    : "bg-gray-800 text-gray-500 border border-gray-700"
                }`}
              >
                {step.number < currentStep ? (
                  <Check size={24} />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  step.number <= currentStep ? "text-white" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 rounded transition-all ${
                  step.number < currentStep
                    ? "bg-linear-to-r from-blue-500 to-purple-500"
                    : "bg-gray-800"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
