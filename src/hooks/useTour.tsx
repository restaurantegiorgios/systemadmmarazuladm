import { useContext, useEffect } from 'react';
import { ShepherdTourContext } from 'react-shepherd';

export const useTour = (steps: any[], tourId: string) => {
  const tour: any = useContext(ShepherdTourContext);

  useEffect(() => {
    const tourCompleted = localStorage.getItem(`tour_${tourId}_completed`);
    
    if (!tourCompleted && tour && steps.length > 0) {
      // Timeout to ensure the page elements are rendered
      setTimeout(() => {
        tour.addSteps(steps);
        tour.start();

        const onComplete = () => {
          localStorage.setItem(`tour_${tourId}_completed`, 'true');
          tour.off('complete', onComplete);
          tour.off('cancel', onCancel);
        };
        
        const onCancel = () => {
          localStorage.setItem(`tour_${tourId}_completed`, 'true');
          tour.off('complete', onComplete);
          tour.off('cancel', onCancel);
        };

        tour.on('complete', onComplete);
        tour.on('cancel', onCancel);
      }, 500);
    }
  }, [tour, steps, tourId]);

  const startTour = () => {
    if (tour) {
      // The tour instance might not clear steps automatically, so we do it manually.
      // This is a common pattern when dynamically adding steps.
      while (tour.steps.length > 0) {
        tour.removeStep(tour.steps[0].id);
      }
      tour.addSteps(steps);
      tour.start();
    }
  };

  return { startTour };
};