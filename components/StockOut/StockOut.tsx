/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  Group,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useInventory } from '@/app/_utils/inventory-context';
import { defaultItem, Item, StockOutOrder } from '@/app/_utils/schema';
import { fetchSupplier, postStockOutOrder, putItem } from '@/app/_utils/utility';
import CustomNotification from '../CustomNotification/CustomNotification';
import classnames from './StockOut.module.css';

export default function StockOut() {
  // Search and selected items from item search
  const [searchValue, setSearchValue] = useState<string | null>('');
  const [selectedItem, setSelectedItem] = useState<Item>({ ...defaultItem });

  // Confirmation Modal State
  const [opened, { close, open }] = useDisclosure(false);

  // Notification State
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showUpdateError, setShowUpdateError] = useState<boolean>(false);

  // States for Item object attributes
  const [itemName, setItemName] = useState<string>('');
  const [staticItemId, setStaticItemId] = useState<string>('');
  const [packageUnit, setPackageUnit] = useState<string>('');
  const [supplyUnit, setSupplyUnit] = useState<string>('');
  const [supplierName, setSupplierName] = useState<string>('');
  const [itemId, setItemId] = useState<string>('');
  const [stockOutQuantity, setStockOutQuantity] = useState<number>(0);
  const [currentStockInStoreRoom, setCurrentStockInStoreRoom] = useState<string>('');
  const [stockOutDate, setStockOutDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dispatchedBy, setDispatchedBy] = useState<string>('');

  // Nullable states due to Select Mantine component handling
  const [category, setCategory] = useState<string | null>('');
  const [supplierId, setSupplierId] = useState<string | null>('');

  const { inventory, supplierList, categoryList, setRefresh, setCurrentPage, setCurrentSection } =
    useInventory();

  // Handle state changes based on new values
  const handleItemName = (newTxt: string) => setItemName(newTxt);
  const handlePackageUnit = (newTxt: string) => setPackageUnit(newTxt);
  const handleSupplyUnit = (newTxt: string) => setSupplyUnit(newTxt);
  const handleStockOutQuantity = (newQty: number) => setStockOutQuantity(Number(newQty));
  const handleCurrentStockInStoreRoom = (newTxt: string) => setCurrentStockInStoreRoom(newTxt);

  // Handle update submit
  const handleSubmit = async () => {
    if (itemName === '' || stockOutQuantity === 0 || stockOutDate === '' || dispatchedBy === '') {
      console.log('error: field no filled');
    } else {
      const newStockOutOrder: StockOutOrder = {
        stockOutId: `SO-${Date.now()}`,
        itemId: selectedItem.itemId,
        requisitionId: '',
        stockOutQuantity,
        stockOutDate,
        dispatchedBy,
      };

      const updatedStock = selectedItem.currentStockInStoreRoom - stockOutQuantity;

      try {
        await postStockOutOrder(newStockOutOrder);

        console.log('success stock out');

        setSearchValue('');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);

        await putItem(staticItemId, {
          ...selectedItem,
          currentStockInStoreRoom: updatedStock,
        });

        setSelectedItem((prevItem) => ({
          ...prevItem,
          currentStockInStoreRoom: updatedStock,
        }));

        //Reset Fields
        setSelectedItem({ ...defaultItem });
        setStockOutQuantity(0);
        setStockOutDate('');
        setDispatchedBy('');
      } catch (error) {
        console.log(error);
        console.log('Unexpected Error encountered. Please try again.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      }
    }
  };
  // Find item to search in inventory and set as selectedItem
  useEffect(() => {
    const matchedItem = inventory?.find((item) => item.itemName === searchValue);
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
    const stockOutOrder = async () => {
      setSupplierId(selectedItem.supplierId || '');
      setSupplierName(supplierName || '');
      setStaticItemId(selectedItem.itemId || '');
      setItemName(selectedItem.itemName || '');
      setPackageUnit(selectedItem.packageUnit || '');
      setSupplyUnit(selectedItem.supplyUnit || '');
      setCategory(selectedItem.category || '');
      setCurrentStockInStoreRoom(String(selectedItem.currentStockInStoreRoom) || '');
      setStockOutQuantity(0);
      setStockOutDate('');
      setDispatchedBy('');
    };

    stockOutOrder();
  }, [selectedItem]);

  useEffect(() => {
    setItemId(selectedItem.itemId || '');
  }, [selectedItem]);

  useEffect(() => {
    setCurrentPage('Stock Out');
    setCurrentSection('inventory');
  }, []);

  return (
    <main className={classnames.rootMain}>
      <Text
        classNames={{
          root: classnames.rootText,
        }}
      >
        Stock Out
      </Text>
      <Group
        classNames={{
          root: classnames.rootMainGroup,
        }}
      >
        {inventory && supplierList && categoryList ? (
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
                    Stock Out Quantities:{' '}
                    <Text fw={700} td="underline" component="span" ml={5}>
                      {stockOutQuantity}
                    </Text>
                  </Text>
                  <Text>
                    Stock Out Date:{' '}
                    <Text fw={700} td="underline" component="span" ml={5}>
                      {stockOutDate}
                    </Text>
                  </Text>
                  <Text>
                    Received By:{' '}
                    <Text fw={700} td="underline" component="span" ml={5}>
                      {dispatchedBy}
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
            <SimpleGrid
              cols={2}
              spacing="xl"
              verticalSpacing="xl"
              classNames={{ root: classnames.simpleGridRoot }}
            >
              <TextInput
                label="Item Name"
                disabled
                value={itemName}
                onChange={(event) => handleItemName(event.target.value)}
                placeholder="Enter Item Name..."
                classNames={{ root: classnames.txtItemName }}
                size="md"
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
                disabled
                value={packageUnit}
                onChange={(event) => handlePackageUnit(event.target.value)}
                placeholder="Enter Package Unit..."
                size="md"
              />

              <TextInput
                label="Unit of Measurement"
                disabled
                value={supplyUnit}
                onChange={(event) => handleSupplyUnit(event.target.value)}
                placeholder="pc / kg / pounds / bottle / etc."
                size="md"
              />

              <Select
                label="Supplier/Source"
                placeholder="Select a supplier from the list..."
                searchable
                disabled
                data={supplierList?.map((supplier) => ({
                  value: supplier.supplierId,
                  label: supplier.supplierName,
                }))}
                allowDeselect
                value={supplierId || null}
                onChange={setSupplierId}
                size="md"
              />

              <Select
                label="Category"
                searchable
                disabled
                placeholder="Select a category from the list..."
                data={categoryList?.map((category) => ({
                  value: category,
                  label: category,
                }))}
                allowDeselect
                value={category || null}
                onChange={setCategory}
                size="md"
              />

              <TextInput
                label="Current Stock"
                disabled
                value={currentStockInStoreRoom}
                onChange={(value) => handleCurrentStockInStoreRoom(String(value))}
                placeholder="Enter quantity in storage..."
                size="md"
                type="number"
              />

              <TextInput label="Stock Out ID" disabled size="md" />

              <NumberInput
                label="Stock Out Quantity"
                value={stockOutQuantity}
                onChange={(value) => handleStockOutQuantity(Number(value) || 0)}
                placeholder="Enter quantity to stock out..."
                size="md"
                min={0}
                max={Number(currentStockInStoreRoom) || 0}
                step={1}
                withAsterisk
              />

              <TextInput
                label="Stock Out Date"
                value={stockOutDate}
                onChange={(event) => setStockOutDate(event.target.value)}
                type="date"
                max={new Date().toISOString().split('T')[0]}
                size="md"
                withAsterisk
              />

              <TextInput
                label="Dispatched By"
                value={dispatchedBy}
                onChange={(event) => setDispatchedBy(event.target.value)}
                placeholder="Enter name..."
                size="md"
                withAsterisk
              />
            </SimpleGrid>

            <Button
              variant="filled"
              color="#1B4965"
              size="md"
              mt="lg"
              onClick={async () => {
                if (!selectedItem.itemName || !stockOutQuantity || !dispatchedBy || !stockOutDate) {
                  setShowError(true);
                  setTimeout(() => {
                    setShowError(false);
                  }, 3000);
                } else {
                  open();
                }
              }}
            >
              Generate SO
            </Button>
          </Group>
        ) : (
          <Group classNames={{ root: classnames.loadingContainer }}>
            <img src="/assets/loading/Spin@1x-1.0s-200px-200px.gif" alt="Loading..." />
          </Group>
        )}
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
      </Group>
    </main>
  );
}
