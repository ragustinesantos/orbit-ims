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
  rorModalProps,
} from '@/app/_utils/schema';
import { fetchEmployee, fetchOrderRequisition, patchRorApproval } from '@/app/_utils/utility';
import ApprovalBadge from '../ApprovalBadge/ApprovalBadge';
import classnames from './RorModal.module.css';

export default function RorModal({
  recurringOrder,
  isOpened,
  isClosed,
  handleApprovalActivity,
}: rorModalProps) {
  const { currentEmployee, inventory, supplierList } = useInventory();

  const [opened, { open, close }] = useDisclosure(false);
  const [employee, setEmployee] = useState<Employee>({ ...defaultEmployee });
  const [currentOr, setCurrentOr] = useState<OrderRequisition>({ ...defaultOrderRequisition });
  const [p1Approver, setP1Approver] = useState<Employee>({ ...defaultEmployee });
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const [orDate, setOrDate] = useState<string>('');
  const [approval, setApproval] = useState<boolean>(false);

  // Retrieve the matching order requisition every time a new ROR is passed
  useEffect(() => {
    const retrieveOrderRequisitionById = async () => {
      recurringOrder && setCurrentOr(await fetchOrderRequisition(recurringOrder.requisitionId));
    };
    retrieveOrderRequisitionById();
  }, [recurringOrder, approval]);

  // Retrieve the employee from the matching order requisition
  useEffect(() => {
    const retrieveEmployeeById = async () => {
      currentOr && setEmployee(await fetchEmployee(currentOr?.employeeId));
    };
    retrieveEmployeeById();
  }, [currentOr]);

  // Format date retrieved from matching order requisition
  useEffect(() => {
    const date = new Date(currentOr.requisitionDate);
    setOrDate(date.toLocaleString('en-us'));
  }, [currentOr]);

  // Retrieve P1 approver information from
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
    if (currentEmployee && handleApprovalActivity) {
      try {
        await patchRorApproval(currentOr.requisitionId, isApproved, currentEmployee.employeeId);
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
  };

  // Map through the list of item id's to retrieve data for the template table body
  const mappedItemList = recurringOrder?.itemOrders.map((item) => {
    const currentItem = inventory?.find((invItem) => invItem.itemId === item.itemId);
    const currentSupplier = supplierList?.find(
      (supplier) => supplier.supplierId === currentItem?.supplierId
    );
    return [
      currentItem?.itemName,
      currentItem?.category,
      currentItem?.supplyUnit,
      currentItem?.packageUnit,
      currentSupplier?.supplierName,
      item.orderQty,
    ];
  });

  // Table information (keys are caption, head and body)
  const tableData: TableData = {
    caption: 'End of Order List',
    head: ['Item', 'Category', 'Unit of Measurement', 'Package Unit', 'Supplier', 'Quantity'],
    body: mappedItemList,
  };

  const approvalData: TableData = {
    head: [
      currentOr.isApprovedP1 !== null
        ? `${currentOr.isApprovedP1 ? 'Approved' : 'Rejected'} By: ${p1Approver?.firstName} ${p1Approver?.lastName}`
        : 'P1 Approval',
    ],
    body: [[<ApprovalBadge isApproved={currentOr.isApprovedP1} />]],
  };

  return (
    <Modal
      centered
      opened={isOpened}
      onClose={isClosed}
      size="xl"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Modal opened={opened} onClose={close} title="Confirmation" centered>
        <Text
          classNames={{
            root: classnames.rootConfirmationText,
          }}
        >
          Do you want to proceed with the {confirmation ? 'approval' : 'rejection'} of the ROR?
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
        Recurring Order Requisition
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
        <TextInput disabled label="Requisition ID" value={currentOr.requisitionId} size="md" />
      </SimpleGrid>
      <Table striped classNames={{ table: classnames.rootTable }} data={tableData} />
      <Text classNames={{ root: classnames.rootHeaderTxt }}>Approvals:</Text>
      <Table
        withTableBorder
        withColumnBorders
        withRowBorders
        classNames={{ table: classnames.rootApprovalTable, td: classnames.tableTd }}
        data={approvalData}
      />
      {currentEmployee?.employeeLevel.includes('P1') && currentOr.isApprovedP1 == null && (
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
