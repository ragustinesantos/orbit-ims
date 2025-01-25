import classes from './WizardProgress.module.css';


export default function WizardProgress() {

    return (
        <div className={classes.header}>
            <div className={classes.stepContainer}>
                <div className={classes.progressCircle}>
                    1
                </div>
                <div className={classes.stepTitle}>
                    Template
                </div>
            </div>
            <div className={classes.barContainer}>
                <div className={classes.progressBar}>

                </div>
            </div>
            <div className={classes.stepContainer}>
                <div className={classes.progressCircle}>
                    2
                </div>
                <div className={classes.stepTitle}>
                    Order
                </div>
            </div>
            <div className={classes.barContainer}>
                <div className={classes.awaitingBar}>
                    ||||||||||||||||||||
                </div>
            </div>
            <div className={classes.stepContainer}>
                <div className={classes.awaitingCircle}>
                    3
                </div>
                <div className={classes.stepTitle}>
                    Confirmation
                </div>
            </div>
            <div className={classes.barContainer}>
                <div className={classes.awaitingBar}>
                    ||||||||||||||||||||
                </div>
            </div>
            <div className={classes.stepContainer}>
                <div className={classes.awaitingCircle}>
                    4
                </div>
                <div className={classes.stepTitle}>
                    Summary
                </div>
            </div>
        </div>
    );
}