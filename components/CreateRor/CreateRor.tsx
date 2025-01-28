import { Text } from "@mantine/core";
import classnames from './CreateRor.module.css';
import WizardProgress from "../WizardProgress/WizardProgress";
import { useState } from "react";
import SelectRorTemplate from "../SelectRorTemplate/SelectRorTemplate";



export default function CreateRor() {

    const [currentStep, setCurrentStep] = useState(0);
    const steps: String[] = ['Template', 'Order', 'Confirmation', 'Summary'];
    const stepHeaders: String[] = [
        'Select Template',
        'Enter Quantity',
        'Order Review',
        'Order Complete'
    ]

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
            <SelectRorTemplate />
        </div>
    );
}