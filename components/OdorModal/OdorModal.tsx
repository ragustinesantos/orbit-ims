/* eslint-disable no-console */
'use client';

import { useState } from 'react';
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
import { odorModalProps } from '@/app/_utils/schema';
import classnames from './OdorModal.module.css';

export default function OdorModal({
  isOpened,
  isClosed,
}: odorModalProps) {
  const [opened, { open, close }] = useDisclosure(false);

  // Temp UI data
  const nonInventoryTableData: TableData = {
    caption: 'End of Order List',
    head: ['Item', 'Description', 'Product Code', 'Disposal Plan', 'Purpose for Purchase', 'Unit Price', 'Item Subtotal', 'Quantity'],
    body: [
      ['', '', '', '', '', '', '', ''],
    ],
  };

  const tableData: TableData = {
    caption: 'End of Order List',
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
        On-Demand Order Requisition
      </Text>
      <TextInput
        disabled
        label="Employee Name"
        value=""
        size="md"
        classNames={{ root: classnames.rootSection }}
      />
      <SimpleGrid cols={3} classNames={{ root: classnames.rootSection }}>
        <TextInput disabled label="Employee ID" value="" size="md" />
        <TextInput disabled label="Date" value="" size="md" />
        <TextInput disabled label="Requisition ID" value="" size="md" />
      </SimpleGrid>
      <Text classNames={{ root: classnames.rootHeaderTxt }}>Inventory Items:</Text>
      <Table striped classNames={{ table: classnames.rootTable }} data={tableData} />
      <Text classNames={{ root: classnames.rootHeaderTxt }}>Non-Inventory Items:</Text>
      <Table
        striped
        classNames={{ table: classnames.rootTable }}
        data={nonInventoryTableData}
      />
      <Text classNames={{ root: classnames.rootHeaderTxt }}>Approvals:</Text>
      <Table
        withTableBorder
        withColumnBorders
        withRowBorders
        classNames={{ table: classnames.rootApprovalTable, td: classnames.tableTd }}
      />
    </Modal>
  );
}