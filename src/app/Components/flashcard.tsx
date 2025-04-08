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
import { Switch } from "@/components/ui/switch";

export default function FlashcardApp() {
  const {
    cards,
    currentIndex,
    showAnswer,
    indexInput,
    isShuffled,
    alwaysShowAnswer,
    setCards,
    setIndexInput,
    nextCard,
    prevCard,
    goToIndex,
    toggleShuffle,
    toggleShowAnswer,
    toggleAlwaysShowAnswer,
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
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();
        toggleAlwaysShowAnswer();
      }
      else if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        toggleShowAnswer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextCard, prevCard, goToIndex, toggleShuffle, toggleShowAnswer, toggleAlwaysShowAnswer]);

  if (!cards.length)
    return <div className="text-center mt-10 text-white">Loading...</div>;

  const card = cards[currentIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 bg-black text-white">
      <div className="w-full max-w-3xl mx-auto">
        <Card className="text-center bg-zinc-900 border-zinc-700 min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-2 sm:p-4">
            <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={toggleShuffle}
                      variant={isShuffled ? "outline" : "default"}
                      className="text-sm sm:text-lg w-32 sm:w-40"
                    >
                      Shuffle: {isShuffled ? "On" : "Off"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Ctrl + S to toggle</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Switch 
                      checked={alwaysShowAnswer}
                      onCheckedChange={toggleAlwaysShowAnswer} 
                      className={`${alwaysShowAnswer ? 'bg-blue-500' : 'bg-gray-500'}`}
                    />      
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Ctrl + A to toggle</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-sm sm:text-base text-white">Always {alwaysShowAnswer? 'show': 'hide'} meaning</p>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={goToIndex} variant="outline" className="text-sm sm:text-lg">
                Go to
              </Button>
              <Input
                type="number"
                min={1}
                max={cards.length}
                value={indexInput + 1}
                onChange={(e) => setIndexInput(Number(e.target.value) - 1)}
                className="w-16 sm:w-20 text-black text-sm sm:text-lg bg-white"
              />
            </div>
          </div>

          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
              {card.word}
            </CardTitle>
            <p className="text-sm sm:text-md text-zinc-300">Frequency: {card.frequency}</p>
          </CardHeader>
          <CardContent className="m-4 sm:m-8 md:m-16 min-h-[300px]  flex items-center justify-center">
            {showAnswer && (
              <ul className="text-left list-disc text-white text-base sm:text-lg max-w-[90%] mx-auto">
                {card.meanings.map((meaning, idx) => (
                  <li key={idx}>{meaning}</li>
                ))}
              </ul>
            )}
          </CardContent>
          <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2 sm:gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={toggleShowAnswer} variant="outline" className="text-sm sm:text-lg">
                    {showAnswer ? "Hide Answer" : "Show Answer"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Alt + A to toggle</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button onClick={prevCard} variant="outline" className="text-sm sm:text-lg">
              Previous
            </Button>
            <Button onClick={nextCard} variant="outline" className="text-sm sm:text-lg">
              Next
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
