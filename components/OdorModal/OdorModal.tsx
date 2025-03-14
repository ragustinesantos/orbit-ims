/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Group,
  Modal,
  ScrollArea,
  SimpleGrid,
  Table,
  TableData,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useInventory } from '@/app/_utils/inventory-context';
import {
  defaultEmployee,
  defaultOrderRequisition,
  Employee,
  OrderRequisition,
  odorModalProps,
} from '@/app/_utils/schema';
import { fetchEmployee, fetchOrderRequisition, patchOdorApproval } from '@/app/_utils/utility';
import ApprovalBadge from '../ApprovalBadge/ApprovalBadge';
import classnames from './OdorModal.module.css';
import ImgModal from '../ImgModal/ImgModal';

export default function OdorModal({
  onDemandOrder,
  isOpened,
  isClosed,
  handleApprovalActivity,
}: odorModalProps) {
  const { currentEmployee, inventory, supplierList, setRefresh } = useInventory();

  const [opened, { open, close }] = useDisclosure(false);
  const [employee, setEmployee] = useState<Employee>({ ...defaultEmployee });
  const [currentOr, setCurrentOr] = useState<OrderRequisition | null>(null);
  const [p1Approver, setP1Approver] = useState<Employee>({ ...defaultEmployee });
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const [orDate, setOrDate] = useState<string>('');
  const [approval, setApproval] = useState<boolean>(false);

  const [modalStateTracker, setModalStateTracker] = useState<Record<string, boolean>>({});

  // Retrieve the matching order requisition every time a new ODOR is passed
  useEffect(() => {
    const retrieveOrderRequisitionById = async () => {
      onDemandOrder && setCurrentOr(await fetchOrderRequisition(onDemandOrder.requisitionId));
    };
    retrieveOrderRequisitionById();
  }, [onDemandOrder, approval]);

  // Retrieve the employee from the matching order requisition
  useEffect(() => {
    const retrieveEmployeeById = async () => {
      currentOr && setEmployee(await fetchEmployee(currentOr?.employeeId));
    };
    retrieveEmployeeById();
  }, [currentOr]);

  // Format date retrieved from matching order requisition
  useEffect(() => {
    if (currentOr) {
      const date = new Date(currentOr.requisitionDate);
      setOrDate(date.toLocaleString('en-us'));
    }
  }, [currentOr]);

  // Retrieve P1 approver information
  useEffect(() => {
    const retrieveApproverP1ById = async () => {
      currentOr && setP1Approver(await fetchEmployee(currentOr?.approvalP1));
    };
    retrieveApproverP1ById();
  }, [currentOr]);

  const handleApproval = async (isApproved: boolean) => {
    // Set approval value to trigger order requisition retrieval useEffect
    setApproval((prev) => !prev);

    // Send a request for approval update and provide feedback based on try-catch result
    if (currentOr && currentEmployee && handleApprovalActivity) {
      try {
        await patchOdorApproval(currentOr.requisitionId, isApproved, currentEmployee.employeeId);
        handleApprovalActivity(
          'success',
          currentOr.requisitionTypeId,
          isApproved ? 'APPROVED' : 'REJECTED'
        );
      } catch (error) {
        console.log(error);
        handleApprovalActivity(
          'error',
          currentOr.requisitionTypeId,
          isApproved ? 'APPROVED' : 'REJECTED'
        );
      }
    }

    // Close the main modal
    isClosed();

    //Close the confirmation modal
    close();

    // Return confirmation value to default
    setConfirmation(false);

    //Refresh Information
    setRefresh((prev: number) => prev + 1);
  };

  // Every time an ID is clicked this should run and set the state of modal visibility to the opposite of its previous value
  const toggleImgModalState = (itemId: string) => {
    setModalStateTracker((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  // Map through inventory items
  const mappedInventoryItems = onDemandOrder?.itemOrders.map((item) => {
    const currentItem = inventory?.find((invItem) => invItem.itemId === item.itemId);
    const currentSupplier = supplierList?.find(
      (supplier) => supplier.supplierId === currentItem?.supplierId
    );
    return [
      <Text onClick={()=> toggleImgModalState(item.itemId)} classNames={{root:classnames.imgModalID}}> {currentItem?.itemName}</Text>,
      currentItem?.category,
      currentItem?.supplyUnit,
      currentItem?.packageUnit,
      currentSupplier?.supplierName,
      item.orderQty,
      <ImgModal item={currentItem} isOpened={!!modalStateTracker[item.itemId]} isClosed={() => setModalStateTracker((prev) => ({ ...prev, [item.itemId]: false }))} ></ImgModal>
    ];
  });

  // Map through non-inventory items
  const mappedNonInventoryItems = onDemandOrder?.newItemOrders.map((item) => [
    item.itemName,
    item.itemDescription,
    item.productCode,
    item.disposalPlan,
    item.purposeForPurchase,
    item.unitPrice,
    item.itemSubtotal,
    item.purchaseQty,
  ]);

  // Table info for inventory items
  const inventoryTableData: TableData = {
    caption: 'End of Order List',
    head: ['Item', 'Category', 'Unit of Measurement', 'Package Unit', 'Supplier', 'Quantity'],
    body: mappedInventoryItems,
  };

  // Table info for non-inventory items
  const nonInventoryTableData: TableData = {
    caption: 'End of Order List',
    head: ['Item', 'Description', 'Product Code', 'Disposal Plan', 'Purpose for Purchase', 'Unit Price', 'Item Subtotal', 'Quantity'],
    body: mappedNonInventoryItems,
  };

  const approvalData: TableData = {
    head: [
      currentOr?.isApprovedP1 !== null
        ? `${currentOr?.isApprovedP1 ? 'Approved' : 'Rejected'} By: ${p1Approver?.firstName} ${p1Approver?.lastName}`
        : 'P1 Approval',
    ],
    body: [[currentOr && <ApprovalBadge isApproved={currentOr.isApprovedP1} />]],
  };

  // Total inventory and non-inventory items in the order 
  const totalItems = (onDemandOrder?.itemOrders?.length || 0) + (onDemandOrder?.newItemOrders?.length || 0);

  // Calculate totals for inventory and non-inventory items
  const calcInventoryTotal = () => {
    let inventoryTotal = 0;
  
    // Loop through inventory items
    onDemandOrder?.itemOrders?.forEach(item => {
      // Find the matching inventory item to get its price
      const inventoryItem = inventory?.find(invItem => invItem.itemId === item.itemId);
    
      // Calculate cost for item
      if (inventoryItem && item.orderQty) {
        const itemCost = inventoryItem.price * item.orderQty;
        inventoryTotal += itemCost;
      }
    });

    return inventoryTotal;
  };

  const calcNonInventoryTotal = () => {
    let nonInventoryTotal = 0;
  
    // Loop through non-inventory items
    onDemandOrder?.newItemOrders?.forEach(item => {
      // Add the subtotal for this item
      if (item.itemSubtotal) {
        nonInventoryTotal += item.itemSubtotal;
      }
    });

    return nonInventoryTotal;
  };

  // Calculate the final total
  const orderTotal = calcInventoryTotal() + calcNonInventoryTotal();

  return (
    <Modal
      centered
      opened={isOpened}
      onClose={isClosed}
      size="xl"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      {currentOr ? (
        <>
          <Modal opened={opened} onClose={close} title="Confirmation" centered>
            <Text classNames={{ root: classnames.rootConfirmationText }}>
              Do you want to proceed with the {confirmation ? 'approval' : 'rejection'} of the ODOR?
            </Text>
            <Group classNames={{ root: classnames.rootBtnArea }}>
              <Button
                classNames={{ root: classnames.rootBtn }}
                onClick={() => handleApproval(confirmation)}
                color="#1B4965"
              >
                Proceed
              </Button>
              <Button classNames={{ root: classnames.rootBtn }} onClick={close} color="red">
                Cancel
              </Button>
            </Group>
          </Modal>

          <Text classNames={{ root: classnames.rootText }}>
            On-Demand Order Requisition
          </Text>
          <TextInput
            disabled
            label="Employee Name"
            value={`${employee.firstName} ${employee.lastName}`}
            size="md"
            classNames={{ root: classnames.rootSection }}
          />
          <SimpleGrid cols={3} classNames={{ root: classnames.rootSection }}>
            <TextInput disabled label="Employee ID" value={employee.employeeId} size="md" />
            <TextInput disabled label="Date" value={orDate} size="md" />
            <TextInput disabled label="Requisition ID" value={currentOr?.requisitionId} size="md" />
          </SimpleGrid>
          <Text classNames={{ root: classnames.rootHeaderTxt }}>Inventory Items:</Text>
          <Table striped classNames={{ table: classnames.rootTable }} data={inventoryTableData} />
          <Text classNames={{ root: classnames.rootHeaderTxt }}>Non-Inventory Items:</Text>
          <Table striped classNames={{ table: classnames.rootTable }} data={nonInventoryTableData} />
          <Text classNames={{ root: classnames.rootHeaderTxt }}>Order Summary:</Text>
          <Group classNames={{ root: classnames.rootSection }}>
            <div>
              <Text>Total Items</Text>
              <Text>{totalItems}</Text>
            </div>
            <div>
              <Text>Total Cost</Text>
              <Text>${orderTotal.toFixed(2)}</Text>
            </div>
          </Group>
          <Text classNames={{ root: classnames.rootHeaderTxt }}>Approvals:</Text>
          <Table
            withTableBorder
            withColumnBorders
            withRowBorders
            classNames={{ table: classnames.rootApprovalTable, td: classnames.tableTd }}
            data={approvalData}
          />
        </>
      ) : (
        <Group classNames={{ root: classnames.loadingContainer }}>
          <img src="/assets/loading/Spin@1x-1.0s-200px-200px.gif" alt="Loading..." />
        </Group>
      )}

          {currentEmployee?.employeeLevel.includes('P1') && currentOr?.isApprovedP1 == null && (
            <Group classNames={{ root: classnames.rootBtnArea }}>
              <Button
                classNames={{ root: classnames.rootBtn }}
                onClick={() => {
                  setConfirmation(true);
                  open();
                }}
                color="#1B4965"
              >
                Approve
              </Button>
              <Button
                classNames={{ root: classnames.rootBtn }}
                onClick={() => {
                  setConfirmation(false);
                  open();
                }}
                color="red"
              >
                Reject
              </Button>
            </Group>
          )}
    </Modal>
  );
}