'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import OdorComponent from '@/components/Odor1/Odor1';
import OdorComponent2 from '@/components/Odor2/Odor2';
import OdorComponent3 from '@/components/Odor3/Odor3';
import classnames from './odorpage.module.css';
import { Text, Group,  } from '@mantine/core';
import { useState,useEffect } from 'react';
import CustomNotification from '@/components/CustomNotification/CustomNotification';
import WizardProgress from '@/components/WizardProgress/WizardProgress';
import { useInventory } from '../_utils/inventory-context';
import { Button } from '@mantine/core';
import { defaultOnDemandOrderToEdit, ItemOrder, NewItemOrder } from '../_utils/schema';
import { defaultOrderRequisitionToEdit, OnDemandOrderToEdit } from '../_utils/schema';
import { OrderRequisitionToEdit } from '../_utils/schema';
import { postOrderRequisition, postOnDemandOrderRequisition, patchOrderRequisition } from '../_utils/utility';

export default function OdorPage() {

  const [itemOrders, setitemOrders] = useState<ItemOrder[]>([]);
  const [newItemOrders, setNewItemOrders] = useState<NewItemOrder[]>([]);
  const [totalCost, setTotalCost] = useState<Number>(0);
  const [showTemplate, setShowTemplate] = useState<boolean>(false)
  const [pageNumber,setpageNumber] = useState<number>(0);
  const [orderTotal,setOrderTotal] = useState<number>(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(<div/>);
  const [recipientName, setRecipientName ] = useState('')
  const [recipientLocation, setRecipientLocation] = useState ('')
  const [remarks,setRemarks] = useState('');
  const [requisitionId, setRequisitionId] = useState ('');
  const [odorId, setOdorId] = useState ('');
  const stepList = ["Inventory Items","Non-Inventory Items", "Order Review"];

  const { currentEmployee, setRefresh, } = useInventory();

    const handleAddItem = async () => {
      if (
        recipientName === '' ||
        recipientLocation === '' 
      ) {
        setNotificationMessage(
          CustomNotification(
            'error',
            'Fill Up Required Fields',
            'Please Add Recipient name and location.',
            setShowNotification
          )
        );
      } else {
             try {
              const newOrderObj: OrderRequisitionToEdit = {
                ...defaultOrderRequisitionToEdit,
                requisitionType: 'odor',
                requisitionTypeId: '',
                requisitionDate: '',
                employeeId: currentEmployee?.employeeId || '',
                remarks: remarks,
              };
              await postOrderRequisition(newOrderObj,setRequisitionId);
              // const newOnDemandOrderObj: OnDemandOrderToEdit = {
              //   ...defaultOnDemandOrderToEdit,
              //   requisitionId: requisitionId,
              //   itemOrders: itemOrders,
              //   newItemOrders: newItemOrders,
              //   orderTotal: orderTotal,
              //   recipientName: recipientName,
              //   recipientLocation: recipientLocation,
              // };
              // await postOnDemandOrderRequisition(newOnDemandOrderObj, setOdorId);
              // await patchOrderRequisition(requisitionId, odorId)

            setNotificationMessage(
              CustomNotification(
                'success',
                'Requisition Added!',
                `Odor successfully added.`,
                setShowNotification
              )
            );
            revealNotification();
          
  
          // Trigger a refresh to retrieve updated inventory information
          setRefresh((prev: number) => prev + 1);
  
          //Reset Fields
          setRecipientName('');
          setRecipientLocation('');
          setRemarks('');
        } catch (error) {
          console.log(error);
          setNotificationMessage(
            CustomNotification(
              'error',
              'Error Encountered',
              'Unexpected Error encountered. Please try again.',
              setShowNotification
            )
            
          );
          revealNotification();
        }
      }
      // Display notification for 3 seconds.
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    };


    useEffect(() => {
      setOrderTotal(itemOrders.length+newItemOrders.length);
    },[itemOrders,newItemOrders]);

    // Function to reveal any triggered notification
    const revealNotification = () => {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    };


  const nav_array = [<OdorComponent 
                      itemOrders={itemOrders} setitemOrders={setitemOrders}>
                     </OdorComponent>,
                     <OdorComponent2 
                     totalCost={totalCost} setTotalCost={setTotalCost} 
                     newItemOrders={newItemOrders} setNewItemOrders={setNewItemOrders} 
                     setShowTemplate={setShowTemplate} showTemplate={showTemplate}>
                     </OdorComponent2>,
                     <OdorComponent3 
                     itemOrders={itemOrders} newItemOrders={newItemOrders} 
                     totalCost={totalCost} orderTotal={orderTotal}
                     setRemarks={setRemarks}remarks={remarks}
                     recipientName={recipientName} setRecipientName={setRecipientName}
                     recipientLocation={recipientLocation} setRecipientLocation={setRecipientLocation}>
                     </OdorComponent3>
                    ]

  function nextPage () {
    if(itemOrders.length == 0 && newItemOrders.length == 0 && pageNumber == 1 ) {
            setNotificationMessage(
                    CustomNotification(
                      'error',
                      'Fill Up Required Fields',
                      'Please Add an Inventory or Non Inventory Item to continue',
                      setShowNotification
                    )
                  );
                  revealNotification();
          }
    else if (pageNumber < 2) {
    setpageNumber((prevpageNum)=>prevpageNum+1)
    }
    
  }

  function previousPage () {
    if (pageNumber > 0) {
      setpageNumber((prevpageNum)=>prevpageNum-1)
    }
  }


  return (
    <main style={{ display: 'flex', width: '100vw', }}>
      <NavbarNested />
      <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        padding: 32,
      }}
      >
        <div>
        <Text classNames={{root: classnames.odorText,}}>On Demand Order Requisition</Text>
        <WizardProgress stepList={stepList} currentStep={pageNumber+1}></WizardProgress>
          {nav_array[pageNumber]}
        </div>
          <Group justify="flex-end">
            { pageNumber == 0 ? <></> : 
            <Button classNames={{root: classnames.navbutton,}} onClick={previousPage} 
            variant="filled" color="#1B4965" size="md" radius="md" 
            >Previous</Button>}
            { pageNumber == 2 ? <></> : 
            <Button classNames={{root: classnames.navbutton,}} onClick={nextPage} 
            variant="filled" color="#1B4965" size="md" radius="md"
            >Next</Button>}
            { pageNumber == 2 ?  
            <Button classNames={{root: classnames.navbutton,}} onClick={handleAddItem} 
            variant="filled" color="#1B4965" size="md" radius="md"
            >Submit</Button> : <></> }
          </Group>
          </div>
          {showNotification && notificationMessage}
    </main>
    
  );
}