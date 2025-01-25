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

    const progressBarType = (rendered: boolean) => {
        if (rendered) {
            return (
                <div className={classes.barContainer}>
                    <div className={classes.progressBar}></div>
                </div>
            );
        }
        else {
            return (
                <div className={classes.barContainer}>
                    <div className={classes.awaitingBar}>
                        ||||||||||||||||||||
                    </div>
                </div>
            )
        }
    }

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