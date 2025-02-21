import { Button, Text } from "@mantine/core";
import classnames from './CreateRor.module.css';
import WizardProgress from "../WizardProgress/WizardProgress";
import { useEffect, useState } from "react";
import SelectRorTemplate from "../SelectRorTemplate/SelectRorTemplate";
import { defaultRecurringOrder, ItemOrder, RecurringOrder, RecurringOrderTemplate } from "@/app/_utils/schema";
import OrderRor from "../OrderRor/OrderRor";



export default function CreateRor() {

    const [currentStep, setCurrentStep] = useState<number>(0);
    const [currentContent, setCurrentContent] = useState(<div />);
    const [selectedRorTemplate, setSelectedRorTemplate] = useState<RecurringOrder | null>(null)

    // These are the titles of the steps and their respective headers
    const steps: string[] = ['Template', 'Order', 'Confirmation', 'Summary'];
    const stepHeaders: String[] = [
        'Select Template',
        'Enter Quantity',
        'Order Review',
        'Order Complete'
    ];

    // This would update the ROR template that would be used in later steps
    const handleSelectRORTemplate = (paramRorTemplate: RecurringOrderTemplate) => {
        let itemList: ItemOrder[] = [];

        paramRorTemplate.itemList.forEach(item => {
            const newItemObj: ItemOrder = {
                itemId: item,
                orderQty: 0,
                pendingQty: 0,
                servedQty: 0
            }

            itemList.push(newItemObj);
        });

        let orderObj: RecurringOrder = {
            ...defaultRecurringOrder,
            rorTemplateId: paramRorTemplate.rorTemplateId,
            requisitionId: "",
            itemOrders: itemList,
            orderTotal: 0
        }
        setSelectedRorTemplate(orderObj)
    };

    const handleSetRor = (paramRecurringOrder: RecurringOrder) => {
        setSelectedRorTemplate(paramRecurringOrder);
    }

    // This is an array of content to display based on the current index
    const stepContent: JSX.Element[] = [
        <SelectRorTemplate
            selectedRorTemplate={selectedRorTemplate}
            handleSelectRor={handleSelectRORTemplate}
        />,
        <OrderRor
            selectedRorTemplate={selectedRorTemplate}
            setRor={handleSetRor}
            adjustQuantity={true}
        />,
        <OrderRor
            selectedRorTemplate={selectedRorTemplate}
            setRor={handleSetRor}
            adjustQuantity={false}
        />,
        <OrderRor
            selectedRorTemplate={selectedRorTemplate}
            setRor={handleSetRor}
            adjustQuantity={false}
        />,
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
            <div
                className={classnames.rorTemplateContainer}
            >
                {currentContent}
            </div>
            <div
                className={classnames.navButtonContainer}
            >
                {
                    currentStep > 0 &&
                    currentStep < 3 &&
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