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
  defaultItem,
  Employee,
  Item,
  odorModalProps,
  OrderRequisition,
} from '@/app/_utils/schema';
import { fetchEmployee, fetchOrderRequisition, patchOdorApproval, postItem } from '@/app/_utils/utility';
import ApprovalBadge from '../ApprovalBadge/ApprovalBadge';
import ImgModal from '../ImgModal/ImgModal';
import classnames from './OdorModal.module.css';

export default function OdorModal({
  onDemandOrder,
  isOpened,
  isClosed,
  handleApprovalE2,
  handleApprovalE3,
  handleApprovalP1,
  isE2Page,
  isE3Page,
}: odorModalProps) {
  const { currentEmployee, inventory, supplierList, setRefresh } = useInventory();

  const [opened, { open, close }] = useDisclosure(false);
  const [employee, setEmployee] = useState<Employee>({ ...defaultEmployee });
  const [currentOr, setCurrentOr] = useState<OrderRequisition | null>(null);
  const [p1Approver, setP1Approver] = useState<Employee>({ ...defaultEmployee });
  const [e2Approver, setE2Approver] = useState<Employee>({ ...defaultEmployee });
  const [e3Approver, setE3Approver] = useState<Employee>({ ...defaultEmployee });
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

  // Retrieve E2 approver information
  useEffect(() => {
    const retrieveApproverE2ById = async () => {
      currentOr && setE2Approver(await fetchEmployee(currentOr?.approvalE2));
    };
    retrieveApproverE2ById();
  }, [currentOr]);

  // Retrieve E3 approver information
  useEffect(() => {
    const retrieveApproverE3ById = async () => {
      currentOr && setE3Approver(await fetchEmployee(currentOr?.approvalE3));
    };
    retrieveApproverE3ById();
  }, [currentOr]);

  const handleApproval = async (isApproved: boolean) => {
    // Set approval value to trigger order requisition retrieval useEffect
    setApproval((prev) => !prev);

    if (currentOr && currentEmployee) {
      try {
        // Determine which approval handler to use based on page
        if (isE2Page && handleApprovalE2) {
          await patchOdorApproval(
            currentOr.requisitionId,
            isApproved,
            currentEmployee.employeeId,
            true, // is E2 employee
            false // is not E3 employee
          );
          handleApprovalE2('success', currentOr.requisitionTypeId, isApproved);
        } else if (isE3Page && handleApprovalE3) {
          await patchOdorApproval(
            currentOr.requisitionId,
            isApproved,
            currentEmployee.employeeId,
            false,
            true
          );
          handleApprovalE3('success', currentOr.requisitionTypeId, isApproved);
        } else if (handleApprovalP1) {
          await patchOdorApproval(
            currentOr.requisitionId,
            isApproved,
            currentEmployee.employeeId,
            false,
            false
          );
          onDemandOrder?.newItemOrders.map(async (newItem) => {
            const newItemObject: Item = {
              ...defaultItem,
              itemName: newItem.itemName,
              price: newItem.unitPrice,
            };
            await postItem(newItemObject);
          });
          handleApprovalP1('success', currentOr.requisitionTypeId, isApproved);
        }
      } catch (error) {
        console.log(error);
        if (isE2Page && handleApprovalE2) {
          handleApprovalE2('error', currentOr.requisitionTypeId, isApproved);
        } else if (isE3Page && handleApprovalE3) {
          handleApprovalE3('error', currentOr.requisitionTypeId, isApproved);
        } else if (handleApprovalP1) {
          handleApprovalP1('error', currentOr.requisitionTypeId, isApproved);
        }
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
      <>
        <ImgModal
          item={currentItem}
          isOpened={!!modalStateTracker[item.itemId]}
          isClosed={() => setModalStateTracker((prev) => ({ ...prev, [item.itemId]: false }))}
        />
        <Text
          className={classnames.rootTextItemName}
          onClick={() => toggleImgModalState(item.itemId)}
          classNames={{ root: classnames.imgModalID }}
        >
          {currentItem?.itemName}
        </Text>
      </>,
      currentItem?.category,
      currentItem?.supplyUnit,
      currentItem?.packageUnit,
      currentSupplier?.supplierName,
      item.orderQty,
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
    head: [
      'Item',
      'Description',
      'Product Code',
      'Disposal Plan',
      'Purpose for Purchase',
      'Unit Price',
      'Item Subtotal',
      'Quantity',
    ],
    body: mappedNonInventoryItems,
  };

  const e2ApprovalData: TableData = {
    head: [
      currentOr?.isApprovedE2 !== null
        ? `${currentOr?.isApprovedE2 ? 'Approved' : 'Rejected'} By: ${e2Approver?.firstName} ${e2Approver?.lastName}`
        : 'E2 Approval',
    ],
    body: [[currentOr && <ApprovalBadge isApproved={currentOr.isApprovedE2} />]],
  };

  const e3ApprovalData: TableData = {
    head: [
      currentOr?.isApprovedE3 !== null
        ? `${currentOr?.isApprovedE3 ? 'Approved' : 'Rejected'} By: ${e3Approver?.firstName} ${e3Approver?.lastName}`
        : 'E3 Approval',
    ],
    body: [[currentOr && <ApprovalBadge isApproved={currentOr.isApprovedE3} />]],
  };

  const p1ApprovalData: TableData = {
    head: [
      currentOr?.isApprovedP1 !== null
        ? `${currentOr?.isApprovedP1 ? 'Approved' : 'Rejected'} By: ${p1Approver?.firstName} ${p1Approver?.lastName}`
        : 'P1 Approval',
    ],
    body: [[currentOr && <ApprovalBadge isApproved={currentOr.isApprovedP1} />]],
  };

  // Total inventory and non-inventory items in the order
  const totalItems =
    (onDemandOrder?.itemOrders?.length || 0) + (onDemandOrder?.newItemOrders?.length || 0);

  // Calculate totals for inventory and non-inventory items
  const calcInventoryTotal = () => {
    let inventoryTotal = 0;

    // Loop through inventory items
    onDemandOrder?.itemOrders?.forEach((item) => {
      // Find the matching inventory item to get its price
      const inventoryItem = inventory?.find((invItem) => invItem.itemId === item.itemId);

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
    onDemandOrder?.newItemOrders?.forEach((item) => {
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
      size="100%"
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

          <Text classNames={{ root: classnames.rootText }}>On-Demand Order Requisition</Text>
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
          {onDemandOrder && onDemandOrder?.itemOrders.length > 0 && (
            <>
              <Text classNames={{ root: classnames.rootHeaderTxt }}>Inventory Items:</Text>
              <Table
                striped
                classNames={{
                  table: classnames.rootTable,
                  td: classnames.td,
                  thead: classnames.thead,
                }}
                data={inventoryTableData}
              />
            </>
          )}
          {onDemandOrder && onDemandOrder?.newItemOrders.length > 0 && (
            <>
              <Text classNames={{ root: classnames.rootHeaderTxt }}>Non-Inventory Items:</Text>
              <Table
                striped
                classNames={{
                  table: classnames.rootTable,
                  td: classnames.td,
                  thead: classnames.thead,
                }}
                data={nonInventoryTableData}
              />
            </>
          )}
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
          <Group gap="xl">
            <Table
              withTableBorder
              withColumnBorders
              withRowBorders
              classNames={{ table: classnames.rootApprovalTable, td: classnames.tableTd }}
              data={e2ApprovalData}
            />
            <Table
              withTableBorder
              withColumnBorders
              withRowBorders
              classNames={{ table: classnames.rootApprovalTable, td: classnames.tableTd }}
              data={e3ApprovalData}
            />
            <Table
              withTableBorder
              withColumnBorders
              withRowBorders
              classNames={{ table: classnames.rootApprovalTable, td: classnames.tableTd }}
              data={p1ApprovalData}
            />
          </Group>
        </>
      ) : (
        <Group classNames={{ root: classnames.loadingContainer }}>
          <img src="/assets/loading/Spin@1x-1.0s-200px-200px.gif" alt="Loading..." />
        </Group>
      )}

      {currentEmployee?.employeeLevel.includes('P1') &&
        !isE2Page &&
        !isE3Page &&
        currentOr?.isApprovedP1 == null && (
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

      {currentEmployee?.employeeLevel.includes('E2') &&
        isE2Page &&
        currentOr?.isApprovedE2 == null && (
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

      {currentEmployee?.employeeLevel.includes('E3') &&
        isE3Page &&
        currentOr?.isApprovedE3 == null && (
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
