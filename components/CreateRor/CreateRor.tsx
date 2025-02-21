import { Button, Flex, Modal, Text } from "@mantine/core";
import classnames from './CreateRor.module.css';
import WizardProgress from "../WizardProgress/WizardProgress";
import { useEffect, useState } from "react";
import SelectRorTemplate from "../SelectRorTemplate/SelectRorTemplate";
import { defaultRecurringOrder, ItemOrder, RecurringOrder, RecurringOrderTemplate } from "@/app/_utils/schema";
import OrderRor from "../OrderRor/OrderRor";
import { useDisclosure } from "@mantine/hooks";



export default function CreateRor() {

    const [currentStep, setCurrentStep] = useState<number>(0);
    const [currentContent, setCurrentContent] = useState(<div />);
    const [selectedRorTemplate, setSelectedRorTemplate] = useState<RecurringOrder | null>(null)
    const [buttonName, setButtonName] = useState("Next");

    // Confirmation Modal State
    const [opened, { close, open }] = useDisclosure(false);

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
        if (currentStep + 1 == stepContent.length) {
            setButtonName("Finish");
        }
        else if (currentStep + 2 == stepContent.length) {
            setButtonName("Confirm");
        }
        else {
            setButtonName("Next");
        }
    }, [currentStep]);

    const resetPage = () => {
        setCurrentStep(0);
        setSelectedRorTemplate(null);
    }

    return (
        <div
            className={classnames.rorContainer}
        >
            {/* Confirmation Modal */}
            <Modal
                centered
                opened={opened}
                onClose={close}
                size="md"
                title="Confirmation"
                classNames={{
                    title: classnames.modalTitle,
                }}
            >
                <Flex
                    justify="center"
                    align="center"
                >
                    <Text
                        mt={10}
                        mb={30}
                        size="lg"
                        fw={500}
                    >
                        Do you want to submit this Recurring Order Requisiton?
                    </Text>
                </Flex>
                <Flex
                    justify="center"
                    align="center"
                    direction="row"
                    gap={"xl"}
                >
                    <Button
                        onClick={() => {
                            close();
                        }}
                        color="#54D0ED"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            // handleSubmit();
                            close();
                        }}
                        color="#1B4965"
                    >
                        Confirm
                    </Button>
                </Flex>
            </Modal>

            {/* Page Content */}
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
                    currentStep < stepContent.length &&
                    selectedRorTemplate &&
                    <Button
                        variant="filled"
                        color="#1B4965"
                        onClick={() => {
                            if (currentStep + 2 < stepContent.length) {
                                setCurrentStep(currentStep + 1);
                            }

                            if (currentStep + 2 == stepContent.length) {
                                open();
                            }

                            // This is the summary page and resets it after clicking finish
                            if (currentStep + 1 == stepContent.length) {
                                resetPage();
                            }
                        }}
                    >
                        {buttonName}
                    </Button>
                }
            </div>
        </div >
    );
}