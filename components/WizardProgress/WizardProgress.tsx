import { useEffect, useState } from 'react';
import { WizardProgressProps } from '@/app/_utils/schema';
import classes from './WizardProgress.module.css';

export default function WizardProgress(props: WizardProgressProps) {
  const [progressBar, setProgressBar] = useState(<div />);
  const stepList = props.stepList;
  const currentStep = props.currentStep;

  //let localIndex = stepList.length;
  let localIndex = 3;
  // Adjust spacing based on number of steps
  const progressBarWidth = {
    width: 720 / stepList.length + 'px',
  };

  // This would return the type of bar in between the steps
  const progressBarType = (rendered: boolean, index: number) => {
    if (rendered) {
      return (
        <div key={index} style={progressBarWidth} className={classes.barContainer}>
          <div className={classes.progressBar} />
        </div>
      );
    }
    return (
      <div key={index} style={progressBarWidth} className={classes.barContainer}>
        <div className={classes.awaitingBar}>|||||||||||||||||||||||||||||||||||||||</div>
      </div>
    );
  };

  // This would determine if the step number if filled or empty
  const stepType = (rendered: boolean, stepName: string, index: number, localIndex: number) => {
    if (rendered) {
      return (
        <div key={localIndex} className={classes.stepContainer}>
          <div className={classes.progressCircle}>{index + 1}</div>
          <div className={classes.stepTitle}>{stepName}</div>
        </div>
      );
    }
    return (
      <div key={localIndex} className={classes.stepContainer}>
        <div className={classes.awaitingCircle}>{index + 1}</div>
        <div className={classes.stepTitle}>{stepName}</div>
      </div>
    );
  };

  useEffect(() => {
    setProgressBar(
      <>
        {stepList.map((step, index) => {
          const currentStepDisplay = [];
          if (index > 0) {
            currentStepDisplay.push(progressBarType(index < currentStep, index));
          }
          currentStepDisplay.push(stepType(index < currentStep, step, index, localIndex));

          localIndex++;
          return currentStepDisplay;
        })}
      </>
    );
  }, [currentStep]);

  return <div className={classes.header}>{progressBar}</div>;
}
