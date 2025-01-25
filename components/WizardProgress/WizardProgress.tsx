import { useEffect, useState } from 'react';
import classes from './WizardProgress.module.css';

interface WizardProgressProps {
    stepList: String[],
    currentStep: number
}

export default function WizardProgress(props: WizardProgressProps) {

    const [progressBar, setProgressBar] = useState(<div />);
    const stepList = props.stepList;
    const currentStep = props.currentStep;
    // Adjust spacing based on number of steps
    const progressBarWidth = {
        "width": 720 / stepList.length + "px",
    }

    // This would return the type of bar in between the steps
    const progressBarType = (rendered: boolean) => {
        if (rendered) {
            return (
                <div style={progressBarWidth} className={classes.barContainer}>
                    <div className={classes.progressBar}></div>
                </div>
            );
        }
        else {
            return (
                <div style={progressBarWidth} className={classes.barContainer}>
                    <div className={classes.awaitingBar}>
                        ||||||||||||||||||||
                    </div>
                </div>
            )
        }
    }

    // This would determine if the step number if filled or empty
    const stepType = (rendered: boolean, stepName: String, index: number) => {
        if (rendered) {
            return (
                <div className={classes.stepContainer}>
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
                <div className={classes.stepContainer}>
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
                            currentStepDisplay.push(progressBarType(index < currentStep));
                        }
                        currentStepDisplay.push(stepType(index < currentStep, step, index));

                        return currentStepDisplay;
                    })
                }
            </>
        )
    }, []);

    return (
        <div className={classes.header}>
            {progressBar}
        </div>
    );
}