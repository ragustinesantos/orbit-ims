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
  poModalProps,
  RecurringOrder,
  OnDemandOrder,
  ItemOrder,
  NewItemOrder,
  Item,
} from '@/app/_utils/schema';
import { 
  fetchEmployee, 
  fetchOrderRequisition, 
  fetchRecurringOrderRequisition,
  fetchOnDemandOrderRequisition,
  patchPurchaseOrder
} from '@/app/_utils/utility';
import classnames from './PoModal.module.css';
import ApprovalBadge from '../ApprovalBadge/ApprovalBadge';

export default function PoModal({
  purchaseOrder,
  isOpened,
  isClosed,
  onSubmit,
  handleApprovalActivity,
}: poModalProps) {
  const { currentEmployee, inventory, supplierList } = useInventory();
  
  const [opened, { open, close }] = useDisclosure(false);
  const [employee, setEmployee] = useState<Employee>({ ...defaultEmployee });
  const [currentOr, setCurrentOr] = useState<OrderRequisition | null>(null);
  const [orDate, setOrDate] = useState<string>('');
  const [requisitionItems, setRequisitionItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [orderQtyMap, setOrderQtyMap] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const [p1Approver, setP1Approver] = useState<Employee | null>(null);
  const [p2Approver, setP2Approver] = useState<Employee | null>(null);
  const [approval, setApproval] = useState<boolean>(false);
  const [odorData, setOdorData] = useState<OnDemandOrder | null>(null);

  // Check if user is P2
  const isP2User = currentEmployee?.employeeLevel?.includes('P2');

  // Handle approval or rejection of purchase order
  const handleApproval = async (approved: boolean) => {
    
    setApproval((prev) => !prev);
    
    if (purchaseOrder && currentEmployee) {
      setIsSubmitting(true);
      try {
        const result = await patchPurchaseOrder(
          purchaseOrder.purchaseOrderId,
          currentEmployee.employeeId,
          approved
        );
        
        if (result && handleApprovalActivity) {
          handleApprovalActivity(
            'success',
            purchaseOrder.purchaseOrderId,
            approved ? 'APPROVED' : 'REJECTED'
          );
        }
        
        if (onSubmit) {
          onSubmit(purchaseOrder.purchaseOrderId);
        }
        
        // Close the modal
        isClosed();
        
        // Close the confirmation modal
        close();
        
        setConfirmation(false);
        setIsSubmitting(false);
      } catch (error) {
        console.error("Error updating purchase order:", error);
        
        if (handleApprovalActivity) {
          handleApprovalActivity(
            'error',
            purchaseOrder.purchaseOrderId,
            approved ? 'APPROVED' : 'REJECTED'
          );
        }
        setIsSubmitting(false);
      }
    }
  };

  // Retrieve the matching order requisition
  useEffect(() => {
    const retrieveOrderRequisitionById = async () => {
      if (purchaseOrder) {
        setLoading(true);
        try {
          // Fetch the order requisition
          const requisitionData = await fetchOrderRequisition(purchaseOrder.requisitionId);
          setCurrentOr(requisitionData);
          
          if (requisitionData) {
            // Fetch ROR data
            let rorData = null;
            try {
              rorData = await fetchRecurringOrderRequisition(requisitionData.requisitionTypeId);
            } catch (error) {
              console.error("Error fetching ROR data:", error);
            }
            
            // Fetch ODOR data
            let odorData = null;
            try {
              odorData = await fetchOnDemandOrderRequisition(requisitionData.requisitionTypeId);
              setOdorData(odorData);
            } catch (error) {
              console.error("Error fetching ODOR data:", error);
            }
            
            // Determine which order to use
            let selectedOrder = null;
            if (rorData && rorData.itemOrders && rorData.itemOrders.length > 0) {
              selectedOrder = rorData;
            } else if (odorData && odorData.itemOrders) {
              selectedOrder = odorData;
            }
            
            if (selectedOrder && selectedOrder.itemOrders) {
              // Create a mapping of item IDs to quantity
              const orderQtyMapping: Record<string, number> = {};
              
              // Find the matching inventory items for each order item
              const matchedItems: Item[] = [];
              
              for (const order of selectedOrder.itemOrders) {
                if (inventory) {
                  for (const invItem of inventory) {
                    if (invItem.itemId === order.itemId) {
                      orderQtyMapping[order.itemId] = order.orderQty;
                      matchedItems.push(invItem);
                      break;
                    }
                  }
                }
              }
              
              setOrderQtyMap(orderQtyMapping);
              setRequisitionItems(matchedItems);
            }
            
            // Fetch P1 approval
            if (requisitionData.approvalP1) {
              try {
                const p1ApproverData = await fetchEmployee(requisitionData.approvalP1);
                setP1Approver(p1ApproverData);
              } catch (error) {
                console.error("Error fetching P1 approver:", error);
              }
            }
            
            // Fetch P2 approval
            if (purchaseOrder.approvalP2) {
              try {
                const p2ApproverData = await fetchEmployee(purchaseOrder.approvalP2);
                setP2Approver(p2ApproverData);
              } catch (error) {
                console.error("Error fetching P2 approver:", error);
              }
            }
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching order requisition:", error);
          setLoading(false);
        }
      }
    };
    retrieveOrderRequisitionById();
  }, [purchaseOrder, approval]);

  // Retrieve the employee from the matching order requisition
  useEffect(() => {
    const retrieveEmployeeById = async () => {
      try {
        if (currentOr) {
          const employeeData = await fetchEmployee(currentOr.employeeId);
          setEmployee(employeeData);
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };
    retrieveEmployeeById();
  }, [currentOr]);

  // Format date
  useEffect(() => {
    if (purchaseOrder) {
      const date = new Date(purchaseOrder.purchaseOrderDate);
      setOrDate(date.toLocaleString('en-us'));
    }
  }, [purchaseOrder]);

  // Mapping through the requisition items to get data for the table body
  const mappedOrderItems = [
    // Map inventory items
    ...requisitionItems.map((item) => {
      const currentSupplier = supplierList?.find(
        (supplier) => supplier.supplierId === item.supplierId
      );
      
      // Finding the item in the purchase order to get the quantity
      const poItem = purchaseOrder?.orderList?.find(poItem => poItem.itemId === item.itemId);
      const quantity = poItem ? poItem.quantity : orderQtyMap[item.itemId] || 0;
      
      return [
        <Text key={item.itemId}>
          {item.itemName}
        </Text>,
        item.category,
        item.supplyUnit,
        item.packageUnit,
        currentSupplier?.supplierName,
        quantity,
      ];
    }),
    // Add non-inventory items if they exist in the ODOR
    // '-' for fields that don't apply to non-inventory items
    ...(odorData?.newItemOrders?.map((item: NewItemOrder) => [
      <Text key={`new-${item.itemName}`}>
        {item.itemName}
      </Text>,
      'Non-Inventory',
      '-',
      '-',
      '-',
      item.purchaseQty,
    ]) || [])
  ];

  const orderItemsData: TableData = {
    caption: 'End of List',
    head: ['Item', 'Category', 'Unit of Measurement', 'Package Unit', 'Supplier', 'Quantity'],
    body: mappedOrderItems,
  };

  const p1ApprovalData: TableData = {
    head: [
      currentOr?.isApprovedP1 !== null
        ? `${currentOr?.isApprovedP1 ? 'Approved' : 'Rejected'} By: ${p1Approver?.firstName} ${p1Approver?.lastName}`
        : 'P1 Approval',
    ],
    body: [[currentOr && <ApprovalBadge isApproved={currentOr?.isApprovedP1 ?? null} />]],
  };

  const p2ApprovalData: TableData = {
    head: [
      purchaseOrder?.isApproved !== null
        ? `${purchaseOrder?.isApproved ? 'Approved' : 'Rejected'} By: ${p2Approver?.firstName} ${p2Approver?.lastName}`
        : 'P2 Approval',
    ],
    body: [[purchaseOrder && <ApprovalBadge isApproved={purchaseOrder?.isApproved ?? null} />]],
  };

  return (
    <Modal
      centered
      opened={isOpened}
      onClose={isClosed}
      size="xl"
      scrollAreaComponent={ScrollArea.Autosize}
      zIndex={400}
    >
      {loading ? (
        <div className={classnames.loadingContainer}>
          <img src="/assets/loading/Spin@1x-1.0s-200px-200px.gif" alt="Loading..." />
        </div>
      ) : (
        <>
          <Modal opened={opened} onClose={close} title="Confirmation" centered zIndex={500}>
            <Text
              classNames={{
                root: classnames.rootConfirmationText,
              }}
            >
              Do you want to proceed with the {confirmation ? 'approval' : 'rejection'} of the Purchase Order?
            </Text>
            <Group classNames={{ root: classnames.rootBtnArea }}>
              <Button
                classNames={{ root: classnames.rootBtn }}
                onClick={() => handleApproval(confirmation)}
                color="#1B4965"
              >
                Proceed
              </Button>
              <Button classNames={{ root: classnames.rootBtn }} onClick={() => close()} color="red">
                Cancel
              </Button>
            </Group>
          </Modal>
          
      <Text
        classNames={{
          root: classnames.rootText,
        }}
      >
        Purchase Order
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

      <SimpleGrid cols={2} classNames={{ root: classnames.rootSection }}>
            <TextInput disabled label="Prepared By" value={`${currentEmployee?.firstName} ${currentEmployee?.lastName}`} size="md" />
            <TextInput disabled label="PO ID" value={purchaseOrder?.purchaseOrderId} size="md" />
      </SimpleGrid>

          <Text classNames={{ root: classnames.rootHeaderTxt }}>Order Items</Text>
      <Table
        striped
        classNames={{ table: classnames.rootTable }}
            data={orderItemsData}
      />

      <Text classNames={{ root: classnames.rootHeaderTxt }}>Approvals:</Text>
          <Group gap="xl">
      <Table
        withTableBorder
        withColumnBorders
        withRowBorders
        classNames={{ table: classnames.rootApprovalTable, td: classnames.tableTd }}
              data={p1ApprovalData}
            />

            <Table
              withTableBorder
              withColumnBorders
              withRowBorders
              classNames={{ table: classnames.rootApprovalTable, td: classnames.tableTd }}
              data={p2ApprovalData}
            />
          </Group>

          {isP2User ? (
            <Group classNames={{ root: classnames.rootBtnArea }}>
              <Button
                classNames={{ root: classnames.rootBtn }}
                onClick={() => {
                  setConfirmation(true);
                  open();
                }}
                color="#1B4965"
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                Reject
              </Button>
            </Group>
          ) : (
      <div className={classnames.rootBtnArea}>
        <Button 
          classNames={{ root: classnames.rootBtn }}
                onClick={() => {
                  // Call onSubmit callback if provided
                  if (onSubmit && purchaseOrder) {
                    onSubmit(purchaseOrder.purchaseOrderId);
                  }
                }}
          color="#1B4965"
                disabled={isSubmitting}
        >
          Submit
        </Button>
      </div>
          )}
        </>
      )}
    </Modal>
  );
}