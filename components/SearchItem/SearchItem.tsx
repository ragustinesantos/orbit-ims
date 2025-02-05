'use client';

import { useEffect, useState } from 'react';
import { Group, Select, Table, Text } from '@mantine/core';
import classnames from './SearchItem.module.css';
import { useInventory } from '@/app/_utils/inventory-context';

export default function SearchItem() {
  const [searchValue, setSearchValue] = useState<string | null>('');
  const { inventory, setCurrentPage, setCurrentSection } =
    useInventory();

  const rows = inventory?.map((item) => {
    return item.itemName.includes(searchValue || '') ? (
      <Table.Tr key={item.itemId}>
        <Table.Td style={{ maxWidth: '20px', overflowX: 'scroll', scrollbarWidth: 'none' }}>
          {item.itemId}
        </Table.Td>
        <Table.Td>{item.itemName}</Table.Td>
        <Table.Td>{item.currentStockInStoreRoom}</Table.Td>
        <Table.Td>{item.supplyUnit}</Table.Td>
        <Table.Td>{item.isCritical ? 'In Stock' : 'Critical'}</Table.Td>
      </Table.Tr>
    ) : null;
  });

  useEffect(() => {
    setCurrentPage('Search Item');
    setCurrentSection('inventory');
  }, []);

  return (
    <main>
      <Group
        classNames={{
          root: classnames.rootGroup,
        }}
      >
        <Text
          classNames={{
            root: classnames.rootText,
          }}
        >
          Search
        </Text>

        <Select
          label="Search Item"
          placeholder="Select an item from the list..."
          data={inventory?.map((item) => ({
            value: item.itemName,
            label: item.itemName,
          }))}
          allowDeselect
          searchable
          value={searchValue || null}
          onChange={setSearchValue}
          classNames={{
            root: classnames.selectRoot,
          }}
          size="md"
          withAsterisk
        />

        <Table
          stickyHeader
          horizontalSpacing="xl"
          verticalSpacing="lg"
          classNames={{
            thead: classnames.thead,
            td: classnames.td,
          }}
        >

          <Table.Thead>
            <Table.Tr>
              <Table.Th>Item ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Stock</Table.Th>
              <Table.Th>UOM</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Group>
    </main>
  );
}
