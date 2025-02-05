import { useEffect, useState } from 'react';
import classes from './WizardProgress.module.css';
import { WizardProgressProps } from '@/app/_utils/schema';
import { increment } from 'firebase/firestore';

export default function WizardProgress(props: WizardProgressProps) {

    const [progressBar, setProgressBar] = useState(<div />);
    const stepList = props.stepList;
    const currentStep = props.currentStep;

    //let localIndex = stepList.length;
    let localIndex = 3;
    // Adjust spacing based on number of steps
    const progressBarWidth = {
        "width": 720 / stepList.length + "px",
    }

    // This would return the type of bar in between the steps
    const progressBarType = (rendered: boolean, index: number) => {
        if (rendered) {
            return (
                <div key={index} style={progressBarWidth} className={classes.barContainer}>
                    <div className={classes.progressBar}></div>
                </div>
            );
        }
        else {
            return (
                <div key={index} style={progressBarWidth} className={classes.barContainer}>
                    <div className={classes.awaitingBar}>
                        |||||||||||||||||||||||||||||||||||||||
                    </div>
                </div>
            )
        }
    }

    // This would determine if the step number if filled or empty
    const stepType = (rendered: boolean, stepName: String, index: number, localIndex: number) => {
        if (rendered) {
            return (
                <div key={localIndex} className={classes.stepContainer}>
                    <div className={classes.progressCircle}>
                        {index + 1}
                    </div>
                    <div className={classes.stepTitle}>
                        {stepName}
                    </div>
                </div>
            );
        }
        else {
            return (
                <div key={localIndex} className={classes.stepContainer}>
                    <div className={classes.awaitingCircle}>
                        {index + 1}
                    </div>
                    <div className={classes.stepTitle}>
                        {stepName}
                    </div>
                </div>
            );
        }
    }

    useEffect(() => {
        setProgressBar(
            <>
                {
                    stepList.map((step, index) => {
                        let currentStepDisplay = [];
                        if (index > 0) {
                            currentStepDisplay.push(progressBarType(index < currentStep, index));
                        }
                        currentStepDisplay.push(stepType(index < currentStep, step, index, localIndex));

                        console.log("ror wizard index1:" + index);
                        console.log("ror wizard index2:" + localIndex);
                        localIndex++;
                        return currentStepDisplay;
                        
                    })
                }
            </>
        )
    }, [currentStep]);

    return (
        <div className={classes.header}>
            {progressBar}
        </div>
    );
}