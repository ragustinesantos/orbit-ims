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
import { poModalProps } from '@/app/_utils/schema';
import classnames from './PoModal.module.css';

export default function PoModal({
  isOpened,
  isClosed,
  purchaseOrder,
}: poModalProps) {
  const [opened, { open, close }] = useDisclosure(false);

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
        value=""
        size="md"
        classNames={{ root: classnames.rootSection }}
      />

      <SimpleGrid cols={3} classNames={{ root: classnames.rootSection }}>
        <TextInput disabled label="Employee ID" value="" size="md" />
        <TextInput disabled label="Date" value="" size="md" />
        <TextInput disabled label="Requisition ID" value="" size="md" />
      </SimpleGrid>

      <SimpleGrid cols={2} classNames={{ root: classnames.rootSection }}>
        <TextInput disabled label="Prepared By" value="" size="md" />
        <TextInput disabled label="PO ID" value="" size="md" />
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
