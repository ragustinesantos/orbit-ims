/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { Button, Flex, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useInventory } from '@/app/_utils/inventory-context';
import {
  defaultOrderRequisitionToEdit,
  defaultRecurringOrderToEdit,
  ItemOrder,
  OrderRequisitionToEdit,
  RecurringOrderTemplate,
  RecurringOrderToEdit,
} from '@/app/_utils/schema';
import {
  patchOrderRequisition,
  postOrderRequisition,
  postRecurringOrderRequisition,
  sendPOMsgRor,
} from '@/app/_utils/utility';
import CustomNotification from '../CustomNotification/CustomNotification';
import OrderRor from '../OrderRor/OrderRor';
import SelectRorTemplate from '../SelectRorTemplate/SelectRorTemplate';
import WizardProgress from '../WizardProgress/WizardProgress';
import classnames from './CreateRor.module.css';

export default function CreateRor() {
  const { inventory, currentEmployee } = useInventory();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentContent, setCurrentContent] = useState(<div />);
  const [recurringOrder, setrecurringOrder] = useState<RecurringOrderToEdit | null>(null);
  const [buttonName, setButtonName] = useState('Next');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(<div />);
  const [showButton, setShowButton] = useState(true);
  const [itemListEmail, setItemListEmail] = useState<ItemOrder[]>();

  // Confirmation Modal State
  const [opened, { close, open }] = useDisclosure(false);

  // These are the titles of the steps and their respective headers
  const steps: string[] = ['Template', 'Order', 'Confirmation', 'Summary'];
  const stepHeaders: string[] = [
    'Select Template',
    'Enter Quantity',
    'Order Review',
    'Order Complete',
  ];

  // This would update the ROR template that would be used in later steps
  const handleSelectRORTemplate = (paramRorTemplate: RecurringOrderTemplate) => {
    const itemList: ItemOrder[] = [];

    paramRorTemplate.itemList.forEach((item) => {
      const newItemObj: ItemOrder = {
        itemId: item,
        orderQty: 0,
        pendingQty: 0,
        servedQty: 0,
      };

      itemList.push(newItemObj);
    });

    const orderObj: RecurringOrderToEdit = {
      ...defaultRecurringOrderToEdit,
      rorTemplateId: paramRorTemplate.rorTemplateId,
      itemOrders: itemList,
    };
    setrecurringOrder(orderObj);
  };

  const handleSetRor = (paramRecurringOrder: RecurringOrderToEdit) => {
    setrecurringOrder(paramRecurringOrder);
    //Email notification code
    setItemListEmail(paramRecurringOrder.itemOrders);
  };

  // This is an array of content to display based on the current index
  const stepContent: JSX.Element[] = [
    <SelectRorTemplate recurringOrder={recurringOrder} handleSelectRor={handleSelectRORTemplate} />,
    <OrderRor recurringOrder={recurringOrder} setRor={handleSetRor} adjustQuantity />,
    <OrderRor recurringOrder={recurringOrder} setRor={handleSetRor} adjustQuantity={false} />,
    <OrderRor recurringOrder={recurringOrder} setRor={handleSetRor} adjustQuantity={false} />,
  ];

  useEffect(() => {
    setCurrentContent(stepContent[currentStep]);
    if (currentStep + 1 === stepContent.length) {
      setButtonName('Finish');
    } else if (currentStep + 2 === stepContent.length) {
      setButtonName('Confirm');
    } else {
      setButtonName('Next');
    }
  }, [currentStep]);

  const checkQuantity = () => {
    const itemList = recurringOrder?.itemOrders;
    if (!itemList?.find((item) => item.orderQty > 0)) {
      setNotificationMessage(
        CustomNotification(
          'error',
          'Zero Quantity',
          'Please enter a quantity to any item to proceed.',
          closeNotification
        )
      );
      // Display notification for 3 seconds.
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      setShowButton(true);
      return false;
    }
    return true;
  };

  const resetPage = () => {
    setCurrentStep(0);
    setrecurringOrder(null);
  };

  const handleSubmit = async () => {
    setShowButton(false);

    try {
      const date: Date = new Date();
      const formattedDate: string = date.toLocaleString();
      // Create new order object
      const newOrderReqObj: OrderRequisitionToEdit = {
        ...defaultOrderRequisitionToEdit,
        requisitionType: 'ror',
        requisitionTypeId: '',
        requisitionDate: formattedDate,
        employeeId: currentEmployee?.employeeId || '',
      };

      // Create the requisition that would be linked with ROR vice versa
      const newOrdReqId = await postOrderRequisition(newOrderReqObj);

      const newRorObj: RecurringOrderToEdit = {
        ...defaultRecurringOrderToEdit,
        ...recurringOrder,
        requisitionId: newOrdReqId,
      };

      // Ensure POST is awaited and promise is resolved; store directly in a variable to avoid delays in states
      const newRorId = await postRecurringOrderRequisition(newRorObj);

      // Update the order requisition with the new ROR ID created
      await patchOrderRequisition(newOrdReqId, newRorId);

      // Only change the page if it was successful
      setCurrentStep(currentStep + 1);

      setNotificationMessage(
        CustomNotification(
          'success',
          'ROR Submitted!',
          `Recurring Order Requisition successfully added.`,
          closeNotification
        )
      );

      //Email notification code
      let empfullname = currentEmployee?.firstName + ' ' + currentEmployee?.lastName;
      if (itemListEmail && inventory) {
        // rememeber to use await for async functions always!!!
        //await sendPOMsgRor(newOrdReqId,itemListEmail,inventory,empfullname);
      }
    } catch (error) {
      console.log(error);
      setNotificationMessage(
        CustomNotification(
          'error',
          'Error Encountered',
          'Unexpected Error encountered. Please try again.',
          closeNotification
        )
      );
    }
    // Display notification for 3 seconds.
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
    setShowButton(true);
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  return (
    <div className={classnames.rorContainer}>
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
        <Flex justify="center" align="center">
          <Text mt={10} mb={30} size="lg" fw={500}>
            Do you want to submit this Recurring Order Requisiton?
          </Text>
        </Flex>
        <Flex justify="center" align="center" direction="row" gap="xl">
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
              handleSubmit();
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
        Create Recurring Order Requisition
      </Text>
      <div className={classnames.progressBar}>
        <WizardProgress stepList={steps} currentStep={currentStep + 1} />
      </div>
      <div className={classnames.outerScrollBox}>
        <Text
          classNames={{
            root: classnames.stepHeader,
          }}
        >
          {stepHeaders[currentStep]}
        </Text>
        <div className={`${classnames.scrollableContainer} scrollableContainer`}>
          <div className={classnames.rorTemplateContainer}>{currentContent}</div>
        </div>
      </div>
      <div className={classnames.navButtonContainer}>
        {currentStep > 0 && currentStep < 3 && showButton && (
          <Button
            classNames={{ root: classnames.navButton }}
            size="md"
            radius="md"
            variant="filled"
            color="#54D0ED"
            onClick={() => {
              setCurrentStep(currentStep - 1);
            }}
          >
            Previous
          </Button>
        )}
        {currentStep < stepContent.length && recurringOrder && showButton && (
          <Button
            classNames={{ root: classnames.navButton }}
            size="md"
            radius="md"
            variant="filled"
            color="#1B4965"
            onClick={() => {
              if (currentStep + 3 === stepContent.length && !checkQuantity()) {
                return;
              }

              if (currentStep + 2 < stepContent.length) {
                setCurrentStep(currentStep + 1);
              }

              if (currentStep + 2 === stepContent.length) {
                open();
              }

              // This is the summary page and resets it after clicking finish
              if (currentStep + 1 === stepContent.length) {
                resetPage();
              }
            }}
          >
            {buttonName}
          </Button>
        )}
      </div>
      {showNotification && notificationMessage}
    </div>
  );
}
