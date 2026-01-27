"use client";

import { useState } from "react";
import { useFormStatus, useFormState } from "react-dom";
import { recommendDish, RecommendDishOutput } from "@/ai/flows/recommend-dish";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Terminal, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Thinking..." : "Get My Recommendation"}
    </Button>
  );
}

const initialState: { output: RecommendDishOutput | null; error: string | null } = {
  output: null,
  error: null,
};

async function submitSelections(
  prevState: typeof initialState,
  formData: FormData
): Promise<typeof initialState> {
  const selectedOccasion = formData.get("occasion") as string;
  const selectedMood = formData.get("mood") as string;
  const selectedFlavor = formData.get("flavor") as string;
  try {
    const output = await recommendDish({ 
      occasion: selectedOccasion,
      mood: selectedMood,
      flavor: selectedFlavor,
    });
    return { output, error: null };
  } catch (e: any) {
    return { output: null, error: e.message || "An unknown error occurred." };
  }
}

const questions = [
    {
        name: 'occasion',
        title: "What's the Occasion?",
        options: ["A quick bite", "A casual meal", "A special celebration"]
    },
    {
        name: 'mood',
        title: "How Are You Feeling?",
        options: ["Light & healthy", "Comfortable & classic", "Indulgent & celebratory"]
    },
    {
        name: 'flavor',
        title: "What's Your Flavor Craving?",
        options: ["Spicy & bold", "Rich & creamy", "Simple & authentic"]
    }
];

const RecommendationForm = () => {
  const [state, formAction] = useFormState(submitSelections, initialState);
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});

  const currentQuestion = questions[step];

  const handleNext = () => {
    if (step < questions.length - 1) {
        setStep(step + 1);
    }
  };

  const handleBack = () => {
      if (step > 0) {
          setStep(step - 1);
      }
  };

  const handleSelection = (name: string, value: string) => {
    setSelections(prev => ({...prev, [name]: value}));
  }

  const isNextDisabled = !selections[currentQuestion.name];


  if (state.output || state.error) {
    return (
        <Card className="w-full">
            <CardContent className="pt-6">
                {state.error && (
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}
                {state.output && (
                     <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Our Chef Recommends</AlertTitle>
                        <AlertDescription className="space-y-2">
                            <p className="font-bold text-lg text-primary mt-2">{state.output.dishName}</p>
                            <p>{state.output.reason}</p>
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter>
                 <Button onClick={() => window.location.reload()} className="w-full">Start Over</Button>
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card className="w-full">
        <form action={formAction}>
            <CardHeader>
                <CardTitle>{currentQuestion.title}</CardTitle>
                <CardDescription>
                    Step {step + 1} of {questions.length}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup 
                    name={currentQuestion.name}
                    onValueChange={(value) => handleSelection(currentQuestion.name, value)}
                    className="space-y-3"
                    value={selections[currentQuestion.name]}
                >
                    {currentQuestion.options.map(option => (
                        <div key={option}>
                            <RadioGroupItem value={option} id={option} className="sr-only" />
                            <Label htmlFor={option} 
                                className={cn(
                                    "flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors text-center",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    selections[currentQuestion.name] === option && "bg-primary text-primary-foreground border-primary"
                                )}>
                                {option}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
                {/* Hidden inputs to carry over selections */}
                {Object.entries(selections).map(([key, value]) => (
                    <input key={key} type="hidden" name={key} value={value} />
                ))}
            </CardContent>
            <CardFooter className="flex justify-between">
                {step > 0 && (
                    <Button variant="outline" type="button" onClick={handleBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                )}
                {step < questions.length - 1 ? (
                    <Button type="button" onClick={handleNext} disabled={isNextDisabled} className="ml-auto">
                        Next
                    </Button>
                ) : (
                    <SubmitButton />
                )}
            </CardFooter>
        </form>
    </Card>
  );
};

export default RecommendationForm;
