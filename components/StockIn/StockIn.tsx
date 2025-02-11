/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { Button, Flex, Group, Modal, NumberInput, Select, SimpleGrid, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { defaultItem, Item, StockInOrder } from '@/app/_utils/schema';
import { fetchSupplier, postStockInOrder, putItem} from '@/app/_utils/utility';
import CustomNotification from '../CustomNotification/CustomNotification';
import classnames from './StockIn.module.css';
import { useInventory } from '@/app/_utils/inventory-context';

export default function StockIn() {
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
  const [stockInQuantity, setStockInQuantity] = useState<number>(0);
  const [purchaseOrderId, setPurchaseOrderId] = useState<string | null>('');
  const [stockInDate, setStockInDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [receivedBy, setReceivedBy] = useState<string>('');


  // Nullable states due to Select Mantine component handling
  const [category, setCategory] = useState<string | null>('');
  const [supplierId, setSupplierId] = useState<string | null>('');

   const { inventory, supplierList, categoryList, setRefresh, setCurrentPage, setCurrentSection } =
      useInventory();

  // Handle state changes based on new values
  const handleItemName = (newTxt: string) => setItemName(newTxt);
  const handlePackageUnit = (newTxt: string) => setPackageUnit(newTxt);
  const handleSupplyUnit = (newTxt: string) => setSupplyUnit(newTxt);
  const handleStockInQuantity = (newQty: number) => setStockInQuantity(Number(newQty));


  // Handle update submit
  const handleSubmit = async() => {
        if (
          itemName === '' ||
          stockInQuantity === 0 ||
          stockInDate === '' ||
          receivedBy === '' 
        ) {
          console.log("error: field no filled")
        }
        else{

        const newStockInOrder: StockInOrder = {
          stockInId: `SI-${Date.now()}`,
          itemId: selectedItem.itemId,
          purchaseOrderId: purchaseOrderId || "",
          stockInQuantity,
          stockInDate,
          receivedBy,
        };

        const updatedStock = selectedItem.currentStockInStoreRoom + stockInQuantity;
        
    try {

      await postStockInOrder(newStockInOrder);

      console.log("success stock in");

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
      setItemName('');
      setStockInQuantity(0);
      setStockInDate("");
      setReceivedBy("");
    } catch (error) {
      console.log(error);
      console.log('Unexpected Error encountered. Please try again.');
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  }
}
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
    const stockInOrder = async () => {
      setSupplierId(selectedItem.supplierId || '');
      setSupplierName(supplierName || '');
      setStaticItemId(selectedItem.itemId || '');
      setItemName(selectedItem.itemName || '');
      setPackageUnit(selectedItem.packageUnit || '');
      setSupplyUnit(selectedItem.supplyUnit || '');
      setCategory(selectedItem.category || '');
      setStockInQuantity(0);
      setStockInDate("");
      setReceivedBy("");
    };

    stockInOrder();
  }, [selectedItem]);

  useEffect(() => {
    setItemId(selectedItem.itemId || '');
  }, [selectedItem]);

  useEffect(() => {
    setCurrentPage('Stock In');
    setCurrentSection('inventory');
  }, []);


  return (
    <main>
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
              Stock In Quantities:{' '}
              <Text fw={700} td="underline" component="span" ml={5}>
                {stockInQuantity}
              </Text>
            </Text>
            <Text>
              Stock In Date:{' '}
              <Text fw={700} td="underline" component="span" ml={5}>
                {stockInDate}
              </Text>
            </Text>
            <Text>
              Received By:{' '}
              <Text fw={700} td="underline" component="span" ml={5}>
                {receivedBy}
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
        Stock In
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

        <TextInput label="Stock In ID" disabled size="md"/>

        <NumberInput
          label="Stock In Quantity"
          value={stockInQuantity}
          onChange={(value) => handleStockInQuantity(Number(value)||0)} 
          placeholder="Enter quantity to stock in..."
          size="md"
          min={0} 
          step={1} 
          withAsterisk
        />

        <TextInput
          label="Stock In Date"
          value={stockInDate}
          onChange={(event) => setStockInDate(event.target.value)} 
          type="date" 
          max={new Date().toISOString().split('T')[0]}
          size="md"
          withAsterisk
        />

        <TextInput
            label="Received By"
            value={receivedBy}
            onChange={(event) => setReceivedBy(event.target.value)}
            placeholder="Enter name..."
            size="md"
            withAsterisk
        />

        <Select
          label="Related Purchase Order"
          searchable
          placeholder="Select a related PO..."
          allowDeselect
          size="md"
        />
      </SimpleGrid>

      <Button
        variant="filled"
        color="#1B4965"
        size="md"
        mt="xl"
        onClick={async () => {
          if (!selectedItem.itemName || !stockInQuantity || !receivedBy|| !stockInDate) {
            setShowError(true);
            setTimeout(() => {
              setShowError(false);
            }, 3000);
          } else {
            open();
          }
        }}
      >
        Generate SI
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
          'Item Stock In',
          'The item has been successfully managed to stock in',
          setShowSuccess
        )}
      {showUpdateError &&
        CustomNotification(
          'error',
          'Item Stock In Failed',
          'Item failed to update due to a server error',
          setShowUpdateError
        )}
    </Group>
    </main>
  );}
