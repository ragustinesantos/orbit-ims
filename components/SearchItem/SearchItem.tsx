'use client';

import { useEffect, useState } from 'react';
import { Group, Select, Table, Text } from '@mantine/core';
import { useInventory } from '@/app/_utils/inventory-context';
import ImgModal from '../ImgModal/ImgModal';
import classnames from './SearchItem.module.css';

export default function SearchItem() {
  const [searchValue, setSearchValue] = useState<string | null>('');
  const { inventory, setCurrentPage, setCurrentSection } = useInventory();
  const [modalStateTracker, setModalStateTracker] = useState<Record<string, boolean>>({});

  // Every time an ID is clicked this should run and set the state of modal visibility to the opposite of its previous value
  const toggleImgModalState = (itemId: string) => {
    setModalStateTracker((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const rows = inventory?.map((item) => {
    return item.itemName.includes(searchValue || '') ? (
      <Table.Tr key={item.itemId}>
        <ImgModal
          item={item}
          isOpened={!!modalStateTracker[item.itemId]}
          isClosed={() => setModalStateTracker((prev) => ({ ...prev, [item.itemId]: false }))}
        ></ImgModal>
        <Table.Td
          style={{ maxWidth: '20px', overflowX: 'scroll', scrollbarWidth: 'none', height: 'fit' }}
        >
          <Text
            onClick={() => toggleImgModalState(item.itemId)}
            classNames={{ root: classnames.tableID }}
          >
            {item.itemId}
          </Text>
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
        <div className={classnames.rootTable}>
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
        </div>
      </Group>
    </main>
  );
}
