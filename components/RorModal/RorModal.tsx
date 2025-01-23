import { useEffect, useState } from 'react';
import { Text, Modal, SimpleGrid, Table, TableData, TextInput } from '@mantine/core';
import { useInventory } from '@/app/_utils/inventory-context';
import {
  defaultEmployee,
  defaultOrderRequisition,
  Employee,
  OrderRequisition,
  RecurringOrder,
} from '@/app/_utils/schema';
import { fetchEmployee, fetchOrderRequisition } from '@/app/_utils/utility';
import classnames from './RorModal.module.css';

interface rorModalProps {
  opened: boolean;
  close: () => void;
  recurringOrder: RecurringOrder | null;
}

export default function RorModal({ opened, close, recurringOrder }: rorModalProps) {
  const { inventory, supplierList } = useInventory();

  const [employee, setEmployee] = useState<Employee>({ ...defaultEmployee });
  const [currentOr, setCurrentOr] = useState<OrderRequisition>({ ...defaultOrderRequisition });
  const [orDate, setOrDate] = useState<string>('');

  // Retrieve the matching order requisition every time a new ROR is passed
  useEffect(() => {
    const retrieveOrderRequisitionById = async () => {
      recurringOrder && setCurrentOr(await fetchOrderRequisition(recurringOrder.requisitionId));
    };
    retrieveOrderRequisitionById();
  }, [recurringOrder]);

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
    caption: 'Order List',
    head: ['Item', 'Category', 'Unit of Measurement', 'Package Unit', 'Supplier', 'Quantity'],
    body: mappedItemList,
  };

  const approvalData: TableData = {
    head: [currentOr.approvalE2 ? `Approved By: ${currentOr.approvalE2}`:'E2 Approval', currentOr.approvalE3 ? `Approved By: ${currentOr.approvalE3}`:'E3 Approval', currentOr.approvalP1 ? `Approved By: ${currentOr.approvalP1}`:'P1 Approval'],
    body: []
  }

  return (
    <Modal opened={opened} onClose={close} size="xl">
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
        value={employee.firstName + employee.lastName}
        size="md"
        classNames={{ root: classnames.rootSection }}
      />
      <SimpleGrid cols={3} classNames={{ root: classnames.rootSection }}>
        <TextInput disabled label="Employee ID" value={employee.employeeId} size="md" />
        <TextInput disabled label="Date" value={orDate} size="md" />
        <TextInput disabled label="Requisition ID" value={currentOr.requisitionId} size="md" />
      </SimpleGrid>
      <Table striped classNames={{ table: classnames.rootTable }} data={tableData} />
      <Table striped classNames={{ table: classnames.rootTable }} data={approvalData} />
    </Modal>
  );
}
