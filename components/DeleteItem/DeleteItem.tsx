/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { Button, Flex, Group, Modal, Select, SimpleGrid, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useInventory } from '@/app/_utils/inventory-context';
import { defaultItem, Item } from '@/app/_utils/schema';
import { deleteItem, fetchSupplier } from '@/app/_utils/utility';
import CustomNotification from '../CustomNotification/CustomNotification';
import classnames from './DeleteItem.module.css';

export default function UpdateItem() {
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

  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Nullable states due to Select Mantine component handling
  const [category, setCategory] = useState<string | null>('');
  const [supplierId, setSupplierId] = useState<string | null>('');

  const { inventory, supplierList, categoryList, setRefresh, setCurrentPage, setCurrentSection } =
    useInventory();

  // Handle delete submit
  const handleSubmit = async () => {
    try {
      await deleteItem(staticItemId);

      setSuccessMessage(`The ${itemName} has been successfully deleted`);
      setSearchValue('');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      setErrorTitle('Error Encountered');
      setErrorMessage('Unexpected Error encountered. Please try again.');
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  // Find item to search in inventory and set as selectedItem
  useEffect(() => {
    const matchedItem = inventory?.find((item) => item.itemId === searchValue);
    setSelectedItem(matchedItem || { ...defaultItem });
    setRefresh((prev: number) => prev + 1);
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

  useEffect(() => {
    setCurrentPage('Delete Item');
    setCurrentSection('inventory');
  }, []);

  return (
    <main className={classnames.rootMain}>
      <Text
        classNames={{
          root: classnames.rootText,
        }}
      >
        Archive Item
      </Text>
      <Group
        classNames={{
          root: classnames.rootMainGroup,
        }}
      >
        {inventory ? (
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
              <Text mb={20}>Are you sure you want to delete item {itemName}?</Text>
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
                    classNames={{ root: classnames.button }}
                  >
                    Archive
                  </Button>
                </Group>
              </Flex>
            </Modal>
            <Select
              label="Search Item"
              placeholder="Select an item from the list..."
              data={inventory?.map((item) => ({
                value: item.itemId,
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
                placeholder="Enter Item Name..."
                classNames={{ input: classnames.disabledText }}
                size="md"
                withAsterisk
                disabled
              />
              <TextInput
                label="Item ID"
                disabled
                value={staticItemId}
                placeholder="Enter Item ID..."
                classNames={{ input: classnames.disabledText }}
                size="md"
              />
              <TextInput
                label="Package Unit"
                value={packageUnit}
                placeholder="Enter Package Unit..."
                classNames={{ input: classnames.disabledText }}
                withAsterisk
                disabled
              />
              <TextInput
                label="Unit of Measurement"
                value={supplyUnit}
                placeholder="pc / kg / pounds / bottle / etc."
                size="md"
                classNames={{ input: classnames.disabledText }}
                withAsterisk
                disabled
              />
              <TextInput
                label="Current Stock"
                value={currentStockInStoreRoom}
                placeholder="Enter quantity in storage..."
                classNames={{ input: classnames.disabledText }}
                size="md"
                type="number"
                withAsterisk
                disabled
              />
              <TextInput
                label="Minimum Purchase Quantity"
                value={minPurchaseQty}
                placeholder="Enter minimum purchase quantity..."
                classNames={{ input: classnames.disabledText }}
                size="md"
                type="number"
                withAsterisk
                disabled
              />
              <TextInput
                label="Minimum Storage Quantity"
                value={minStorageQty}
                placeholder="Enter minimum storage quantity..."
                classNames={{ input: classnames.disabledText }}
                size="md"
                type="number"
                withAsterisk
                disabled
              />
              <Select
                label="Supplier/Source"
                placeholder="Select a supplier from the list..."
                classNames={{ input: classnames.disabledText }}
                searchable
                data={supplierList?.map((supplier) => ({
                  value: supplier.supplierId,
                  label: supplier.supplierName,
                }))}
                allowDeselect
                value={supplierId || null}
                size="md"
                withAsterisk
                disabled
              />
              <Select
                label="Category"
                searchable
                placeholder="Select a category from the list..."
                classNames={{ input: classnames.disabledText }}
                data={categoryList?.map((category) => ({
                  value: category,
                  label: category,
                }))}
                allowDeselect
                value={category || null}
                size="md"
                withAsterisk
                disabled
              />
            </SimpleGrid>
            <Button
              variant="filled"
              size="md"
              mt="xl"
              classNames={{ root: classnames.button }}
              onClick={async () => {
                if (!itemName) {
                  setErrorTitle('No Item Selected');
                  setErrorMessage('Please select an item to delete.');
                  setShowError(true);
                  setTimeout(() => {
                    setShowError(false);
                  }, 3000);
                } else {
                  open();
                }
              }}
            >
              Archive
            </Button>
          </Group>
        ) : (
          <Group classNames={{ root: classnames.loadingContainer }}>
            <img src="/assets/loading/Spin@1x-1.0s-200px-200px.gif" alt="Loading..." />
          </Group>
        )}
        {showError && CustomNotification('error', errorTitle, errorMessage, setShowError)}
        {showSuccess &&
          CustomNotification('success', 'Item Deleted', successMessage, setShowSuccess)}
      </Group>
    </main>
  );
}
