/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { Button, Flex, Group, Modal, Select, SimpleGrid, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { defaultItem, Item, ItemToEdit, Supplier } from '@/app/_utils/schema';
import { fetchSupplier, putItem } from '@/app/_utils/utility';
import CustomNotification from '../CustomNotification/CustomNotification';
import classnames from './UpdateItem.module.css';

export default function UpdateItem({
  inventory,
  supplierList,
  categoryList,
}: {
  inventory: Item[];
  supplierList: Supplier[];
  categoryList: string[];
}) {
  // Search and selected items from item search
  const [searchValue, setSearchValue] = useState<string | null>('');
  const [selectedItem, setSelectedItem] = useState<Item>({ ...defaultItem });

  // Confirmation Modal State
  const [opened, { close, open }] = useDisclosure(false);

  // Notification State
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // States for Item object attributes
  const [itemName, setItemName] = useState<string>('');
  const [staticItemId, setStaticItemId] = useState<string>('');
  const [packageUnit, setPackageUnit] = useState<string>('');
  const [supplyUnit, setSupplyUnit] = useState<string>('');
  const [supplierName, setSupplierName] = useState<string>('');
  const [minPurchaseQty, setMinPurchaseQty] = useState<string>('');
  const [minStorageQty, setMinStorageQty] = useState<string>('');
  const [currentStockInStoreRoom, setCurrentStockInStoreRoom] = useState<string>('');

  // Nullable states due to Select Mantine component handling
  const [category, setCategory] = useState<string | null>('');
  const [supplierId, setSupplierId] = useState<string | null>('');

  // Handle state changes based on new values
  const handleItemName = (newTxt: string) => setItemName(newTxt);
  const handlePackageUnit = (newTxt: string) => setPackageUnit(newTxt);
  const handleSupplyUnit = (newTxt: string) => setSupplyUnit(newTxt);
  const handleMinPurchaseQty = (newTxt: string) => setMinPurchaseQty(newTxt);
  const handleMinStorageQty = (newTxt: string) => setMinStorageQty(newTxt);
  const handleCurrentStockInStoreRoom = (newTxt: string) =>
    setCurrentStockInStoreRoom(newTxt);

  // Handle update submit
  const handleSubmit = () => {
    const updatedItem: ItemToEdit = {
      supplierId: supplierId || '',
      inventoryId: '',
      itemName,
      currentStockInStoreRoom: Number(currentStockInStoreRoom),
      packageUnit,
      supplyUnit,
      category: category || '',
      isCritical: Number(minStorageQty) >= Number(currentStockInStoreRoom),
      isCriticalThreshold: Number(minStorageQty),
      minPurchaseQty: Number(minPurchaseQty),
    };

    // Send updated item for PUT
    putItem(staticItemId, updatedItem);

    // Show success notification
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Find item to search in inventory and set as selectedItem
  useEffect(() => {
    const matchedItem = inventory.find((item) => item.itemName === searchValue);
    setSelectedItem(matchedItem || { ...defaultItem });
  }, [searchValue]);

  // Retrieve supplier name for corresponding id
  useEffect(() => {
    const retrieveSupplierName = async () => {
      try {
        const supplierData = await fetchSupplier(selectedItem.supplierId || '');
        const supplierName = await supplierData.supplierName;
        setSupplierName(supplierName);
      } catch (error) {
        console.log(error);
      }
    };

    retrieveSupplierName();
  }, [selectedItem]);

  // Update fields whenever there is a new selectedItem
  useEffect(() => {
    const updateValues = async () => {
      setSupplierId(selectedItem.supplierId || '');
      setSupplierName(supplierName || '');
      setStaticItemId(selectedItem.itemId || '');
      setItemName(selectedItem.itemName || '');
      setPackageUnit(selectedItem.packageUnit || '');
      setSupplyUnit(selectedItem.supplyUnit || '');
      setCategory(selectedItem.category || '');
      setMinPurchaseQty(String(selectedItem.minPurchaseQty));
      setMinStorageQty(String(selectedItem.isCriticalThreshold));
      setCurrentStockInStoreRoom(String(selectedItem.currentStockInStoreRoom));
    };

    updateValues();
  }, [selectedItem]);

  return (
    <Group
      classNames={{
        root: classnames.rootGroup,
      }}
    >
      <Modal
        centered
        opened={opened}
        onClose={close}
        size="xl"
        title="Confirmation"
        classNames={{
          title: classnames.modalTitle,
        }}
      >
        <Text mb={20}>Do you want to proceed with the changes?</Text>
        <Flex justify="center" align="center" direction="column" style={{ height: '100%' }}>
          <SimpleGrid
            cols={2}
            spacing="xl"
            verticalSpacing="xs"
            classNames={{ root: classnames.simpleGridRoot }}
          >
            <Text>
              Item Name:{' '}
              <Text fw={700} td="underline" component="span" ml={5}>
                {itemName}
              </Text>
            </Text>
            <Text>
              Supplier:{' '}
              <Text fw={700} td="underline" component="span" ml={5}>
                {supplierName}
              </Text>
            </Text>
            <Text>
              Package Unit:{' '}
              <Text fw={700} td="underline" component="span" ml={5}>
                {packageUnit}
              </Text>
            </Text>
            <Text>
              Supply Unit:{' '}
              <Text fw={700} td="underline" component="span" ml={5}>
                {supplyUnit}
              </Text>
            </Text>
            <Text>
              Category:{' '}
              <Text fw={700} td="underline" component="span" ml={5}>
                {category}
              </Text>
            </Text>
            <Text>
              Current Stock:{' '}
              <Text fw={700} td="underline" component="span" ml={5}>
                {currentStockInStoreRoom}
              </Text>
            </Text>
            <Text>
              Minimum Purchase Qty:{' '}
              <Text fw={700} td="underline" component="span" ml={5}>
                {minPurchaseQty}
              </Text>
            </Text>
            <Text>
              Minimum Storage Qty:{' '}
              <Text fw={700} td="underline" component="span" ml={5}>
                {minStorageQty}
              </Text>
            </Text>
          </SimpleGrid>
          <Group mt="xl">
            <Button
              onClick={() => {
                handleSubmit();
                close();
              }}
              color="#1B4965"
            >
              Confirm
            </Button>
          </Group>
        </Flex>
      </Modal>
      <Text
        classNames={{
          root: classnames.rootText,
        }}
      >
        Update
      </Text>
      <Select
        label="Search Item"
        placeholder="Select an item from the list..."
        data={inventory.map((item) => ({
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
      <SimpleGrid
        cols={2}
        spacing="xl"
        verticalSpacing="xl"
        classNames={{ root: classnames.simpleGridRoot }}
      >
        <TextInput
          label="Item Name"
          value={itemName}
          onChange={(event) => handleItemName(event.target.value)}
          placeholder="Enter Item Name..."
          classNames={{ root: classnames.txtItemName }}
          size="md"
          withAsterisk
        />
        <TextInput
          label="Item ID"
          disabled
          value={staticItemId}
          placeholder="Enter Item Name..."
          classNames={{ root: classnames.txtItemName }}
          size="md"
        />
        <TextInput
          label="Package Unit"
          value={packageUnit}
          onChange={(event) => handlePackageUnit(event.target.value)}
          placeholder="Enter Package Unit..."
          withAsterisk
        />
        <TextInput
          label="Unit of Measurement"
          value={supplyUnit}
          onChange={(event) => handleSupplyUnit(event.target.value)}
          placeholder="pc / kg / pounds / bottle / etc."
          size="md"
          withAsterisk
        />
        <TextInput
          label="Current Stock"
          value={currentStockInStoreRoom}
          onChange={(event) => handleCurrentStockInStoreRoom(event.target.value)}
          placeholder="Enter quantity in storage..."
          size="md"
          type="number"
          withAsterisk
        />
        <TextInput
          label="Minimum Purchase Quantity"
          value={minPurchaseQty}
          onChange={(event) => handleMinPurchaseQty(event.target.value)}
          placeholder="Enter minimum purchase quantity..."
          size="md"
          withAsterisk
        />
        <TextInput
          label="Minimum Storage Quantity"
          value={minStorageQty}
          onChange={(event) => handleMinStorageQty(event.target.value)}
          placeholder="Enter minimum storage quantity..."
          size="md"
          withAsterisk
        />
        <Select
          label="Supplier/Source"
          placeholder="Select a supplier from the list..."
          searchable
          data={supplierList.map((supplier) => ({
            value: supplier.supplierId,
            label: supplier.supplierName,
          }))}
          allowDeselect
          value={supplierId || null}
          onChange={setSupplierId}
          size="md"
          withAsterisk
        />
        <Select
          label="Category"
          searchable
          placeholder="Select a category from the list..."
          data={categoryList.map((category) => ({
            value: category,
            label: category,
          }))}
          allowDeselect
          value={category || null}
          onChange={setCategory}
          size="md"
          withAsterisk
        />
      </SimpleGrid>
      <Button
        variant="filled"
        color="#1B4965"
        size="md"
        mt="xl"
        onClick={async () => {
          if (!itemName || !packageUnit || !supplyUnit || !category || !supplierId) {
            setShowError(true);
            setTimeout(() => {
              setShowError(false);
            }, 3000);
          } else {
            open();
          }
        }}
      >
        Submit
      </Button>
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
          'Item Updated',
          'The item has been successfully updated',
          setShowSuccess
        )}
    </Group>
  );
}
