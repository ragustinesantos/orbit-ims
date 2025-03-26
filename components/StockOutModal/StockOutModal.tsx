/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { useInventory } from '@/app/_utils/inventory-context';
import { defaultItem, Item, ItemOrder, OrderRequisition, StockOutOrder } from '@/app/_utils/schema';
import {
  fetchOnDemandOrderRequisition,
  fetchOrderRequisition,
  fetchRecurringOrderRequisition,
  fetchStockOutOrders,
  postStockOutOrder,
  putItem,
} from '@/app/_utils/utility';
import CustomNotification from '../CustomNotification/CustomNotification';
import classnames from './StockOutModal.module.css';

export default function StockOutModal({
  opened,
  close,
  requisitionId,
}: {
  opened: boolean;
  close: () => void;
  requisitionId: string;
}) {
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item>(defaultItem);
  const [requisitionItems, setRequisitionItems] = useState<Item[]>([]);
  const { inventory } = useInventory();

  // Notification State
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showUpdateError, setShowUpdateError] = useState<boolean>(false);

  const [stockOutQuantity, setStockOutQuantity] = useState<number>(0);
  const [stockOutDate, setStockOutDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dispatchedBy, setDispatchedBy] = useState<string>('');

  const [stockOutOrders, setStockOutOrders] = useState<StockOutOrder[]>([]);
  const [orderQtyMap, setOrderQtyMap] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchStockOutOrders(setStockOutOrders);
  }, [stockOutOrders]);

  const getItemDetails = (itemId: string) => {
    const foundItem = inventory?.find((item) => item.itemId === itemId);
    return {
      name: foundItem?.itemName || 'Unknown Item',
      unit: foundItem?.supplyUnit || 'N/A',
    };
  };

  useEffect(() => {
    const retrieveItemsInRO = async () => {
      try {
        const requisitionData: OrderRequisition = await fetchOrderRequisition(requisitionId);
        const [rorData, odorData] = await Promise.all([
          fetchRecurringOrderRequisition(requisitionData.requisitionTypeId),
          fetchOnDemandOrderRequisition(requisitionData.requisitionTypeId),
        ]);

        const selectedOrder = rorData?.itemOrders?.length ? rorData : odorData;
        const orderQtyMapping: Record<string, number> = {};
        const matchedItems = selectedOrder.itemOrders
          .map((order: ItemOrder) => {
            const inventoryItem = inventory?.find((invItem) => invItem.itemId === order.itemId);
            if (inventoryItem) {
              orderQtyMapping[order.itemId] = order.orderQty;
            }
            return inventoryItem;
          })
          .filter(Boolean) as Item[];

        setOrderQtyMap(orderQtyMapping);
        setRequisitionItems(matchedItems);
      } catch (error) {
        console.error('Error fetching requisition items:', error);
      }
    };

    retrieveItemsInRO();
  }, [requisitionId, inventory]);

  const relatedStockOutOrders = stockOutOrders.filter(
    (order) => order.requisitionId === requisitionId
  );

  //stock out data
  const stockOutRows = relatedStockOutOrders.map((stockOutOrder) => {
    const { name, unit } = getItemDetails(stockOutOrder.itemId);
    return (
      <Table.Tr key={stockOutOrder.stockOutId}>
        <Table.Td>{stockOutOrder.stockOutId}</Table.Td>
        <Table.Td>{stockOutOrder.stockOutDate}</Table.Td>
        <Table.Td>{name}</Table.Td>
        <Table.Td>{stockOutOrder.stockOutQuantity}</Table.Td>
        <Table.Td>{unit}</Table.Td>
        <Table.Td>{stockOutOrder.dispatchedBy}</Table.Td>
      </Table.Tr>
    );
  });

  useEffect(() => {
    if (!searchValue) {
      setSelectedItem(defaultItem);
      return;
    }

    const matchedItem = requisitionItems.find((item) => item.itemName === searchValue);
    if (matchedItem) {
      setSelectedItem(matchedItem);
      setStockOutQuantity(0);
      setStockOutDate(new Date().toISOString().split('T')[0]);
      setDispatchedBy('');
    }
  }, [searchValue, requisitionItems]);

  const handleStockOutQuantity = (newQty: number) => setStockOutQuantity(Number(newQty));
  const handleSubmit = async () => {
    if (!selectedItem.itemName || stockOutQuantity <= 0 || !stockOutDate || !dispatchedBy) {
      console.log('Error: Missing required fields');
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }

    const newStockOutOrder: StockOutOrder = {
      stockOutId: `SO-${Date.now()}`,
      itemId: selectedItem.itemId,
      requisitionId,
      stockOutQuantity,
      stockOutDate,
      dispatchedBy,
    };

    try {
      await postStockOutOrder(newStockOutOrder);
      await putItem(selectedItem.itemId, {
        ...selectedItem,
        currentStockInStoreRoom: selectedItem.currentStockInStoreRoom - stockOutQuantity,
      });

      console.log('Stock out success');
      fetchStockOutOrders(setStockOutOrders);
      setShowSuccess(true);
      setSearchValue(null);
      setSelectedItem(defaultItem);
      setStockOutQuantity(0);
      setStockOutDate(new Date().toISOString().split('T')[0]);
      setDispatchedBy('');
    } catch (error) {
      console.error('Unexpected error encountered. Please try again.');
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  return (
    <Modal opened={opened} onClose={close} size="100%">
      <Text className={classnames.rootText}>Stock Out Form</Text>

      <Select
        label="Search Item"
        placeholder="Select an item from the list..."
        data={requisitionItems.map((item) => ({
          value: item.itemName,
          label: `${item.itemName} (Request Qty: ${orderQtyMap[item.itemId] || 0})`,
        }))}
        allowDeselect
        searchable
        value={searchValue}
        onChange={setSearchValue}
        size="md"
        withAsterisk
        classNames={{
          root: classnames.selectRoot,
        }}
      />

      <SimpleGrid cols={2} spacing="xl" verticalSpacing="xl">
        <TextInput label="Item ID" disabled value={selectedItem.itemId} size="md" />
        <TextInput label="Package Unit" disabled value={selectedItem.packageUnit} size="md" />
        <TextInput label="Unit of Measurement" disabled value={selectedItem.supplyUnit} size="md" />
        <TextInput label="Category" disabled value={selectedItem.category} size="md" />
        <TextInput
          label="Current Stock"
          disabled
          value={selectedItem.currentStockInStoreRoom}
          size="md"
          type="number"
        />
        <NumberInput
          label="Stock Out Quantity"
          value={stockOutQuantity}
          onChange={(value) => handleStockOutQuantity(Number(value) || 0)}
          min={1}
          max={selectedItem.currentStockInStoreRoom || 0}
          size="md"
          withAsterisk
        />
        <TextInput
          label="Stock Out Date"
          value={stockOutDate}
          onChange={(e) => setStockOutDate(e.target.value)}
          type="date"
          size="md"
          withAsterisk
        />
        <TextInput
          label="Dispatched By"
          value={dispatchedBy}
          onChange={(e) => setDispatchedBy(e.target.value)}
          size="md"
          withAsterisk
        />
      </SimpleGrid>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px',
          marginTop: '30px',
        }}
      >
        <Button variant="filled" color="#1B4965" size="md" onClick={handleSubmit}>
          Generate SO
        </Button>
      </div>

      {showError &&
        CustomNotification(
          'error',
          'Incomplete Fields',
          'Please fill up all required fields before submitting.',
          setShowError
        )}
      {showSuccess &&
        CustomNotification(
          'success',
          'Item Stock Out',
          'The item has been successfully managed to stock out',
          setShowSuccess
        )}
      {showUpdateError &&
        CustomNotification(
          'error',
          'Item Stock Out Failed',
          'Item failed to update due to a server error',
          setShowUpdateError
        )}

      {/*stock out list table */}

      <Text className={classnames.rootText}>Stock Out List</Text>
      <Table
        stickyHeader
        stickyHeaderOffset={50}
        horizontalSpacing="xl"
        verticalSpacing="lg"
        style={{ width: '100%' }}
        classNames={{
          table: classnames.rootTable,
          td: classnames.td,
          thead: classnames.thead,
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
    </Modal>
  );
}
