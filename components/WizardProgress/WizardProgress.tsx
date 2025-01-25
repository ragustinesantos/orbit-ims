import classes from './WizardProgress.module.css';


export default function WizardProgress() {

    return (
        <div className={classes.header}>
            <div className={classes.progressCircle}>
                1
            </div>
            <div className={classes.barContainer}>
                <div className={classes.progressBar}>

                </div>
            </div>
            <div className={classes.progressCircle}>
                2
            </div>
            <div className={classes.barContainer}>
                <div className={classes.awaitingBar}>
                    ||||||||||||||||||||
                </div>
            </div>
            <div className={classes.awaitingCircle}>
                3
            </div>
            <div className={classes.barContainer}>
                <div className={classes.awaitingBar}>
                    ||||||||||||||||||||
                </div>
            </div>
            <div className={classes.awaitingCircle}>
                4
            </div>
        </div>
    );
}