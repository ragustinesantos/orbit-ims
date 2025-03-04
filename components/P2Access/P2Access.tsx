/* eslint-disable no-console */
'use client';

import { useState } from 'react';
import { Button, Group, Table, TableData, Text } from '@mantine/core';
import ApprovalBadge from '../ApprovalBadge/ApprovalBadge';
import classnames from './P2Access.module.css';

export default function P2AccessPage() {
  const pendingPoTableData: TableData = {
    head: ['Requisition ID', 'Employee', 'Date Submitted', 'Status', 'PO ID', 'PO Status'],
    body: [],
  };

  return (
    <main>
      <Text classNames={{ root: classnames.rootText }}>P2 Access</Text>
      <Group classNames={{ root: classnames.rootMainGroup }}>
        <Group classNames={{ root: classnames.rootSectionGroup }} style={{ width: '100%' }}>
          <Text classNames={{ root: classnames.rootSectionText }}>Pending Purchase Orders</Text>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <Table
              stickyHeader
              striped
              data={pendingPoTableData}
              classNames={{
                table: classnames.rootRequisitionTable,
                td: classnames.rootRequisitionTd,
                thead: classnames.rootRequisitionThead,
              }}
            />
          </div>
        </Group>
      </Group>
    </main>
  );
} 