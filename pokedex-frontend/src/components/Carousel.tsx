import { ReactNode, useCallback } from "react";

interface CarouselProps {
  children: ReactNode[];
  current: number;
  setCurrent: (index: number) => void;
}

function Carousel({ children, current, setCurrent }: CarouselProps) {
  const totalSlides = children.length;

  const handlePrev = useCallback(() => {
    setCurrent((current - 1 + totalSlides) % totalSlides);
  }, [current, totalSlides, setCurrent]);

  const handleNext = useCallback(() => {
    setCurrent((current + 1) % totalSlides);
  }, [current, totalSlides, setCurrent]);

  return (
    <div className="relative flex items-center justify-center w-full max-w-5xl mx-auto group">
      <button
        onClick={handlePrev}
        className="absolute left-0 z-20 text-4xl text-gray-700 dark:text-white p-4 hover:scale-125 transition-transform duration-200"
        aria-label="Previous slide"
      >
        ←
      </button>

      <div className="w-full px-4 md:px-16 transition-all duration-500 ease-in-out">
        {children[current]}
      </div>

      <button
        onClick={handleNext}
        className="absolute right-0 z-20 text-4xl text-gray-700 dark:text-white p-4 hover:scale-125 transition-transform duration-200"
        aria-label="Next slide"
      >
        →
      </button>
    </div>
  );
}

export default Carousel;