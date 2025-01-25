import { useEffect, useState } from 'react';
import classes from './WizardProgress.module.css';


export default function WizardProgress() {

    const [progressBar, setProgressBar] = useState(<div />);
    const steps: String[] = ['Template', 'Order', 'Confirmation', 'Summary'];
    const currentStep = 2;

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
                    steps.map((step, index) => {
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