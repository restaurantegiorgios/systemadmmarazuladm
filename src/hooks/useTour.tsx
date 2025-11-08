import { useContext, useEffect } from 'react';
import { ShepherdTourContext } from 'react-shepherd';

export const useTour = (steps: any[], tourId: string) => {
  const tour = useContext(ShepherdTourContext);

  useEffect(() => {
    const tourCompleted = localStorage.getItem(`tour_${tourId}_completed`);
    
    if (!tourCompleted && tour && steps.length > 0) {
      // Timeout to ensure the page elements are rendered
      setTimeout(() => {
        tour.addSteps(steps);
        tour.start();

        const onComplete = () => {
          localStorage.setItem(`tour_${tourId}_completed`, 'true');
          tour.removeListener('complete', onComplete);
          tour.removeListener('cancel', onCancel);
        };
        
        const onCancel = () => {
          localStorage.setItem(`tour_${tourId}_completed`, 'true');
          tour.removeListener('complete', onComplete);
          tour.removeListener('cancel', onCancel);
        };

        tour.on('complete', onComplete);
        tour.on('cancel', onCancel);
      }, 500);
    }
  }, [tour, steps, tourId]);

  const startTour = () => {
    if (tour) {
      tour.steps = []; // Clear existing steps
      tour.addSteps(steps);
      tour.start();
    }
  };

  return { startTour };
};