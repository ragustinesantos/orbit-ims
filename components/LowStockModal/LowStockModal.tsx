import { useEffect } from 'react';
import { Group, Modal, Table, Text } from '@mantine/core';
import { useInventory } from '@/app/_utils/inventory-context';
import classnames from './LowStockModal.module.css';

export default function LowStockModal({ opened, close }: any) {
  const { inventory, setCurrentSection } = useInventory();

  useEffect(() => {
    setCurrentSection('Dashboard');
  }, []);

  const lowStockItems = inventory?.filter(
    (item) => item.currentStockInStoreRoom < item.isCriticalThreshold
  );

  const rows = lowStockItems?.map((item) => (
    <Table.Tr key={item.itemId}>
      <Table.Td style={{ maxWidth: '20px', overflowX: 'scroll', scrollbarWidth: 'none' }}>
        {item.itemId}
      </Table.Td>
      <Table.Td>{item.itemName}</Table.Td>
      <Table.Td>{item.currentStockInStoreRoom}</Table.Td>
      <Table.Td>{item.isCriticalThreshold}</Table.Td>
      <Table.Td>{item.currentStockInStoreRoom - item.isCriticalThreshold}</Table.Td>
      <Table.Td>{item.isCritical ? 'In Stock' : 'Critical'}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Modal opened={opened} onClose={close} size="xl">
      <Text
        classNames={{
          root: classnames.rootText,
        }}
      >
        Low Stock Summary
      </Text>

      <Group>
        <Table
          stickyHeader
          stickyHeaderOffset={60}
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
              <Table.Th>Threshold</Table.Th>
              <Table.Th>Difference</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Group>
    </Modal>
  );
}
