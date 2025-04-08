import { create } from 'zustand';

 interface WordCard {
  word: string;
  frequency: number;
  meanings: string[];
  index: number;
}

 interface FlashcardStore {
  cards: WordCard[];
  currentIndex: number;
  showAnswer: boolean;
  indexInput: number;
  isShuffled: boolean;
  alwaysShowAnswer: boolean;
  setCards: (cards: WordCard[]) => void;
  setCurrentIndex: (index: number) => void;
  setShowAnswer: (show: boolean) => void;
  setIndexInput: (index: number) => void;
  nextCard: () => void;
  prevCard: () => void;
  goToIndex: () => void;
  toggleShuffle: () => void;
  toggleShowAnswer: () => void;
  toggleAlwaysShowAnswer: () => void;
}

export const useFlashcardStore = create<FlashcardStore>((set, get) => ({
  cards: [],
  currentIndex: 0,
  showAnswer: false,
  indexInput: 0,
  isShuffled: false,
  alwaysShowAnswer: false,

  setCards: (cards) => set({ cards }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  setShowAnswer: (show) => set({ showAnswer: show }),
  setIndexInput: (index) => set({ indexInput: index }),

  nextCard: () => {
    const { cards, currentIndex, isShuffled, alwaysShowAnswer } = get();
    const nextIndex = isShuffled 
      ? Math.floor(Math.random() * cards.length)
      : (currentIndex + 1) % cards.length;
    set({
      currentIndex: nextIndex,
      indexInput: nextIndex,
      showAnswer: alwaysShowAnswer
    });
  },

  prevCard: () => {
    const { cards, currentIndex, alwaysShowAnswer } = get();
    const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
    set({
      currentIndex: prevIndex,
      indexInput: prevIndex,
      showAnswer: alwaysShowAnswer
    });
  },

  toggleShuffle: () => {
    set((state) => ({ isShuffled: !state.isShuffled }));
  },

  toggleShowAnswer: () => {
    set((state) => ({ showAnswer: !state.showAnswer }));
  },

  toggleAlwaysShowAnswer: () => {
    set((state) => {
      const newAlwaysShow = !state.alwaysShowAnswer;
      return { 
        alwaysShowAnswer: newAlwaysShow,
        showAnswer: newAlwaysShow
      };
    });
  },

  goToIndex: () => {
    const { indexInput, cards, alwaysShowAnswer } = get();
    if (indexInput >= 0 && indexInput < cards.length) {
      set({
        currentIndex: indexInput,
        showAnswer: alwaysShowAnswer
      });
    }
  },
})); 