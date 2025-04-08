"use client";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFlashcardStore } from "../store/flashcardStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function FlashcardApp() {
  const {
    cards,
    currentIndex,
    showAnswer,
    indexInput,
    isShuffled,
    setCards,
    setIndexInput,
    nextCard,
    prevCard,
    goToIndex,
    toggleShuffle,
  } = useFlashcardStore();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/vocab.txt");
      const text = await res.text();
      const lines = text.trim().split("\n");
      const parsedCards: {
        word: string;
        frequency: number;
        meanings: string[];
        index: number;
      }[] = [];
      const cards = lines
        .map((line) => {
          const match = line.match(/^(.*?)\[(\d+)]\s*:\s*(\[.*])/);
          if (!match) return null;

          const word = match[1].trim();
          const frequency = parseInt(match[2], 10);

          let meanings: string[];
          try {
            meanings = eval(match[3]);
          } catch {
            meanings = [];
          }

          return { word, frequency, meanings, index: parsedCards.length };
        })
        .filter(
          (
            card
          ): card is {
            word: string;
            frequency: number;
            meanings: string[];
            index: number;
          } => card !== null
        );

      parsedCards.push(...cards);
      setCards(parsedCards);
    }
    fetchData();
  }, [setCards]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextCard();
      else if (e.key === "ArrowLeft") prevCard();
      else if (e.key === "Enter") goToIndex();
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        toggleShuffle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextCard, prevCard, goToIndex, toggleShuffle]);

  if (!cards.length)
    return <div className="text-center mt-10 text-white">Loading...</div>;

  const card = cards[currentIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white">
      <div className="w-full max-w-2xl">
        <Card className="text-center bg-zinc-900 border-zinc-700">
          <div className="flex justify-between items-center p-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={toggleShuffle}
                    variant={isShuffled ? "outline" : "default"}
                    className="text-lg w-40 mx-4"
                  >
                    Shuffle: {isShuffled ? "On" : "Off"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Ctrl + S to toggle</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={cards.length}
                value={indexInput + 1}
                onChange={(e) => setIndexInput(Number(e.target.value) - 1)}
                className="w-20 text-black text-lg bg-white"
               
              />
              <Button onClick={goToIndex} variant="outline" className="text-lg">
                Go to
              </Button>
            </div>
          </div>

          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white">
              {card.word}
            </CardTitle>
            <p className="text-md text-zinc-300">Frequency: {card.frequency}</p>
          </CardHeader>
          <CardContent className="m-16 h-40">
            {showAnswer || (
              <ul className="text-left list-disc text-white text-lg">
                {card.meanings.map((meaning, idx) => (
                  <li key={idx}>{meaning}</li>
                ))}
              </ul>
            )}
          </CardContent>
          <div className="mt-6 flex justify-center gap-4">
            <Button onClick={prevCard} variant="outline" className="text-lg">
              Previous
            </Button>
            <Button onClick={nextCard} variant="outline">
              Next
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
