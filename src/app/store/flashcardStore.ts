import { create } from 'zustand';

 interface WordCard {
  word: string;
  frequency: number;
  meanings: string[];
}

 interface FlashcardStore {
  cards: WordCard[];
  currentIndex: number;
  showAnswer: boolean;
  isShuffled: boolean;
  indexInput: number;
  setCards: (cards: WordCard[]) => void;
  setCurrentIndex: (index: number) => void;
  setShowAnswer: (show: boolean) => void;
  setIsShuffled: (shuffled: boolean) => void;
  setIndexInput: (index: number) => void;
  nextCard: () => void;
  prevCard: () => void;
  toggleShuffle: () => void;
  goToIndex: () => void;
}

export const useFlashcardStore = create<FlashcardStore>((set, get) => ({
  cards: [],
  currentIndex: 0,
  showAnswer: false,
  isShuffled: false,
  indexInput: 0,

  setCards: (cards) => set({ cards }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  setShowAnswer: (show) => set({ showAnswer: show }),
  setIsShuffled: (shuffled) => set({ isShuffled: shuffled }),
  setIndexInput: (index) => set({ indexInput: index }),

  nextCard: () => {
    const { cards, currentIndex } = get();
    set({
      currentIndex: (currentIndex + 1) % cards.length,
      indexInput: currentIndex,
      showAnswer: false
    });
  },

  prevCard: () => {
    const { cards, currentIndex } = get();
    set({
      currentIndex: (currentIndex - 1 + cards.length) % cards.length,
      indexInput: currentIndex,
      showAnswer: false
    });
  },

  toggleShuffle: () => {
    set((state) => ({ isShuffled: !state.isShuffled }));
  },

  goToIndex: () => {
    const { indexInput, cards } = get();
    if (indexInput >= 0 && indexInput < cards.length) {
      set({
        currentIndex: indexInput,
        showAnswer: false
      });
    }
  },
})); 