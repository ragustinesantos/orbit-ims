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
} from '@/app/_utils/schema';
import { fetchEmployee, fetchOrderRequisition } from '@/app/_utils/utility';
import classnames from './PoModal.module.css';

export default function PoModal({
  purchaseOrder,
  isOpened,
  isClosed,
}: poModalProps) {
  const { currentEmployee } = useInventory();
  
  const [opened, { open, close }] = useDisclosure(false);
  const [employee, setEmployee] = useState<Employee>({ ...defaultEmployee });
  const [currentOr, setCurrentOr] = useState<OrderRequisition | null>(null);
  const [orDate, setOrDate] = useState<string>('');

  // Retrieve the matching order requisition
  useEffect(() => {
    const retrieveOrderRequisitionById = async () => {
      purchaseOrder && setCurrentOr(await fetchOrderRequisition(purchaseOrder.requisitionId));
    };
    retrieveOrderRequisitionById();
  }, [purchaseOrder]);

  // Retrieve the employee from the matching order requisition
  useEffect(() => {
    const retrieveEmployeeById = async () => {
      currentOr && setEmployee(await fetchEmployee(currentOr?.employeeId));
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

  const foodTemplateData: TableData = {
    caption: 'End of List',
    head: ['Item', 'Category', 'Unit of Measurement', 'Package Unit', 'Supplier', 'Quantity'],
    body: [
      ['', '', '', '', '', ''],
    ],
  };

  return (
    <Modal
      centered
      opened={isOpened}
      onClose={isClosed}
      size="xl"
      scrollAreaComponent={ScrollArea.Autosize}
    >
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

      <Text classNames={{ root: classnames.rootHeaderTxt }}>Food Template</Text>
      <Table
        striped
        classNames={{ table: classnames.rootTable }}
        data={foodTemplateData}
      />

      <Text classNames={{ root: classnames.rootHeaderTxt }}>Approvals:</Text>
      <Table
        withTableBorder
        withColumnBorders
        withRowBorders
        classNames={{ table: classnames.rootApprovalTable, td: classnames.tableTd }}
      />

      <div className={classnames.rootBtnArea}>
        <Button 
          classNames={{ root: classnames.rootBtn }}
          onClick={isClosed}
          color="#1B4965"
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}
