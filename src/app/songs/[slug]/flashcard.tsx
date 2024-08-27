"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ChevronLeft, ChevronRight, Repeat } from "lucide-react";
import React, { useState } from "react";

export default function Flashcard({
  lyrics,
  translations,
}: {
  lyrics: string[];
  translations: string[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % lyrics.length);
    setShowTranslation(false);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + lyrics.length) % lyrics.length,
    );
    setShowTranslation(false);
  };

  const toggleTranslation = () => {
    setShowTranslation((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="flex h-64 w-96 flex-col items-center justify-center p-6 text-center shadow-lg">
        <CardContent>
          <p className="mb-4 text-xl font-semibold">
            {showTranslation
              ? translations[currentIndex]
              : lyrics[currentIndex]}
          </p>
          <Button onClick={toggleTranslation} className="mt-4">
            <Repeat className="mr-2 h-4 w-4" /> Flip
          </Button>
        </CardContent>
      </Card>
      <div className="mt-4 flex w-96 justify-between">
        <Button onClick={handlePrevious} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={handleNext} variant="outline">
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
