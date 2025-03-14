'use client';

import { useEffect, useState } from 'react';
import { Group, Table, Text, Title } from '@mantine/core';
import { useInventory } from '@/app/_utils/inventory-context';
import { Item, StockInOrder, StockOutOrder } from '@/app/_utils/schema';
import { fetchStockInOrders, fetchStockOutOrders } from '@/app/_utils/utility';
import ImgModal from '../ImgModal/ImgModal';
import classnames from './RecentStockInOutTable.module.css';

export default function RecentStockInOutTable() {
  const [stockInOrders, setStockInOrders] = useState<StockInOrder[]>([]);
  const [stockOutOrders, setStockOutOrders] = useState<StockOutOrder[]>([]);
  const { inventory } = useInventory();

  const [showAllStockIn, setShowAllStockIn] = useState(false);
  const [showAllStockOut, setShowAllStockOut] = useState(false);
  //Image modal state
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    fetchStockInOrders(setStockInOrders);
    fetchStockOutOrders(setStockOutOrders);
  }, []);

  const isRecent = (dateString: string) => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const orderDate = new Date(dateString);
    return orderDate >= sevenDaysAgo;
  };

  const getItemDetails = (itemId: string) => {
    const foundItem = inventory?.find((item) => item.itemId === itemId);
    return {
      name: foundItem?.itemName || 'Unknown Item',
      unit: foundItem?.supplyUnit || 'N/A',
    };
  };

  // Close handler
  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  // Handler to toggle modal state and set selected item
  const handleToggleModal = (itemId: string) => {
    const item = inventory?.find((inv) => inv.itemId === itemId) || null;
    setSelectedItem(item);
  };

  // Stock In data in recent 7 days
  const recentStockInOrders = stockInOrders.filter((order) => isRecent(order.stockInDate));
  const stockInRows = (showAllStockIn ? recentStockInOrders : recentStockInOrders.slice(0, 3))
    .sort((a, b) => new Date(b.stockInDate).getTime() - new Date(a.stockInDate).getTime())
    .map((stockInOrder) => {
      const { name, unit } = getItemDetails(stockInOrder.itemId);
      return (
        <Table.Tr key={stockInOrder.stockInId}>
          <Table.Td>{stockInOrder.stockInId}</Table.Td>
          <Table.Td>{stockInOrder.stockInDate}</Table.Td>
          <Table.Td>
            <Text
              onClick={() => handleToggleModal(stockInOrder.itemId)}
              classNames={{ root: classnames.imgModalID }}
            >
              {name}
            </Text>
          </Table.Td>
          <Table.Td>{stockInOrder.stockInQuantity}</Table.Td>
          <Table.Td>{unit}</Table.Td>
          <Table.Td>{stockInOrder.receivedBy}</Table.Td>
        </Table.Tr>
      );
    });

  // Stock Out data in recent 7 days
  const recentStockOutOrders = stockOutOrders.filter((order) => isRecent(order.stockOutDate));
  const stockOutRows = (showAllStockOut ? recentStockOutOrders : recentStockOutOrders.slice(0, 3))
    .sort((a, b) => new Date(b.stockOutDate).getTime() - new Date(a.stockOutDate).getTime())
    .map((stockOutOrder) => {
      const { name, unit } = getItemDetails(stockOutOrder.itemId);
      return (
        <Table.Tr key={stockOutOrder.stockOutId}>
          <Table.Td>{stockOutOrder.stockOutId}</Table.Td>
          <Table.Td>{stockOutOrder.stockOutDate}</Table.Td>
          <Table.Td>
            <Text
              onClick={() => handleToggleModal(stockOutOrder.itemId)}
              classNames={{ root: classnames.imgModalID }}
            >
              {name}
            </Text>
          </Table.Td>
          <Table.Td>{stockOutOrder.stockOutQuantity}</Table.Td>
          <Table.Td>{unit}</Table.Td>
          <Table.Td>{stockOutOrder.dispatchedBy}</Table.Td>
        </Table.Tr>
      );
    });

  // TODO: Pagination Logic

  return (
    <main className={classnames.main}>
      <Title order={5} classNames={{ root: classnames.heading }}>
        Recent Stock In/Out (Last 7 Days)
      </Title>
      <div className={classnames.rootTableGroup}>
        {/* Stock In Table */}
        <Group classNames={{ root: classnames.rootPaginationGroupRequisition }}>
          <Table
            classNames={{
              table: classnames.rootRequisitionTable,
              td: classnames.rootRequisitionTd,
              thead: classnames.rootRequisitionThead,
            }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Stock In ID</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Item Name</Table.Th>
                <Table.Th>Quantity</Table.Th>
                <Table.Th>Unit</Table.Th>
                <Table.Th>Received By</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{stockInRows}</Table.Tbody>
          </Table>
          <>{/* INSERT PAGINATION HERE AND REMOVE FRAGMENT*/}</>
        </Group>

        {/* Stock Out Table */}
        <Group classNames={{ root: classnames.rootPaginationGroupRequisition }}>
          <Table
            classNames={{
              table: classnames.rootRequisitionTable,
              td: classnames.rootRequisitionTd,
              thead: classnames.rootRequisitionThead,
            }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Stock Out ID</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Item Name</Table.Th>
                <Table.Th>Quantity</Table.Th>
                <Table.Th>Unit</Table.Th>
                <Table.Th>Dispatched By</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{stockOutRows}</Table.Tbody>
          </Table>
          <>{/* INSERT PAGINATION HERE AND REMOVE FRAGMENT*/}</>
        </Group>
      </div>
      <ImgModal
        item={selectedItem}
        //!!null = false, !!true = true. !!false = false.
        isOpened={!!selectedItem}
        isClosed={handleCloseModal}
      />
    </main>
  );
}
