import { Button, Text } from "@mantine/core";
import classnames from './CreateRor.module.css';
import WizardProgress from "../WizardProgress/WizardProgress";
import { useEffect, useState } from "react";
import SelectRorTemplate from "../SelectRorTemplate/SelectRorTemplate";



export default function CreateRor() {

    const [currentStep, setCurrentStep] = useState(0);
    const [currentContent, setCurrentContent] = useState(<div />);
    const steps: String[] = ['Template', 'Order', 'Confirmation', 'Summary'];
    const stepHeaders: String[] = [
        'Select Template',
        'Enter Quantity',
        'Order Review',
        'Order Complete'
    ];
    const stepContent: JSX.Element[] = [
        <SelectRorTemplate />,
        <div />,
        <div />,
        <div />,
    ];

    useEffect(() => {
        setCurrentContent(stepContent[currentStep]);
    }, [currentStep]);

    return (
        <div
            className={classnames.rorContainer}
        >
            <Text
                classNames={{
                    root: classnames.rootText,
                }}
            >
                Recurring Order Requisition
            </Text>
            <div
                className={classnames.progressBar}
            >
                <WizardProgress
                    stepList={steps}
                    currentStep={currentStep + 1}
                />
            </div>
            <Text
                classNames={{
                    root: classnames.stepHeader,
                }}
            >
                {stepHeaders[currentStep]}
            </Text>
            {currentContent}
            <div
                className={classnames.navButtonContainer}
            >
                {
                    currentStep != 0 &&
                    <Button
                        variant="filled"
                        color="#54D0ED"
                        onClick={() => {
                            setCurrentStep(currentStep - 1);
                        }}
                    >
                        Back
                    </Button>
                }
                {
                    currentStep + 1 < stepContent.length &&
                    <Button
                        variant="filled"
                        color="#1B4965"
                        onClick={() => {
                            setCurrentStep(currentStep + 1);
                        }}
                    >
                        Next
                    </Button>
                }
            </div>
        </div>
    );
}