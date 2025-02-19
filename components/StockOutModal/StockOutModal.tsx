/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { Button, Modal, NumberInput, Select, SimpleGrid, Text, TextInput } from '@mantine/core';
import { useInventory } from '@/app/_utils/inventory-context';
import classnames from './StockOutModal.module.css';
import { defaultItem, Item, StockOutOrder } from '@/app/_utils/schema';
import { fetchInventory, fetchOnDemandOrderRequisition, fetchOrderRequisition, fetchRecurringOrderRequisition, postStockOutOrder, putItem } from '@/app/_utils/utility';
import CustomNotification from '../CustomNotification/CustomNotification';

export default function StockOutModal({ opened, close, requisitionId }: { opened: boolean; close: () => void; requisitionId: string }) {
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item>(defaultItem);
  const [requisitionItems, setRequisitionItems] = useState<Item[]>([]);
  const { inventory } = useInventory();


  const [stockOutQuantity, setStockOutQuantity] = useState<number>(0);
  const [stockOutDate, setStockOutDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dispatchedBy, setDispatchedBy] = useState<string>('');

  useEffect(() => {
    const retrieveItemsInRO = async () => {
      try {
        const requisitionData = await fetchOrderRequisition(requisitionId);
        const [rorData, odorData] = await Promise.all([
          fetchRecurringOrderRequisition(requisitionData.requisitionTypeId),
          fetchOnDemandOrderRequisition(requisitionData.requisitionTypeId),
        ]);

        const selectedOrder = rorData?.itemOrders?.length ? rorData : odorData;


        const itemIds = selectedOrder.itemOrders.map((item) => item.itemId);
        const matchedItems = inventory.filter((invItem) => itemIds.includes(invItem.itemId));

        setRequisitionItems(matchedItems);
      } catch (error) {
        console.error('Error fetching requisition items:', error);
      }
    };

    retrieveItemsInRO();
  }, [requisitionId, inventory]);


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
      await putItem(selectedItem.itemId, { ...selectedItem, currentStockInStoreRoom: selectedItem.currentStockInStoreRoom - stockOutQuantity });

      console.log('Stock out success');
      setSearchValue(null);
      setSelectedItem(defaultItem);
      setStockOutQuantity(0);
      setStockOutDate(new Date().toISOString().split('T')[0]);
      setDispatchedBy('');
    } catch (error) {
      console.error('Unexpected error encountered. Please try again.', error);
    }
  };

  return (
    <Modal opened={opened} onClose={close} size="xl">
      <Text className={classnames.rootText}>Stock Out Form</Text>

      <Select
        label="Search Item"
        placeholder="Select an item from the list..."
        data={requisitionItems.map((item) => ({ value: item.itemName, label: item.itemName }))}
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
        <TextInput label="Current Stock" disabled value={selectedItem.currentStockInStoreRoom} size="md" type="number" />


        <NumberInput label="Stock Out Quantity" value={stockOutQuantity} onChange={(value) => handleStockOutQuantity(Number(value)||0)} min={1} max={selectedItem.currentStockInStoreRoom || 0} size="md" withAsterisk />
        <TextInput label="Stock Out Date" value={stockOutDate} onChange={(e) => setStockOutDate(e.target.value)} type="date" size="md" withAsterisk />
        <TextInput label="Dispatched By" value={dispatchedBy} onChange={(e) => setDispatchedBy(e.target.value)} size="md" withAsterisk />
      </SimpleGrid>


      <Button variant="filled" color="blue" size="md" mt="xl" onClick={handleSubmit}>
        Generate SO
      </Button>
    </Modal>
  );
}
