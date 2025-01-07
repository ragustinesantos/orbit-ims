/* eslint-disable no-console */
'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Group, Select, SimpleGrid, Text, TextInput } from '@mantine/core';
import { useInventory } from '@/app/_utils/inventory-context';
import { defaultItem, Item } from '@/app/_utils/schema';
import CustomNotification from '@/components/CustomNotification/CustomNotification';
import classnames from './AddItem.module.css';

export default function AddItem() {
  const [itemName, setItemName] = useState('');
  const [packageUnit, setPackageUnit] = useState('');
  const [unitOfMeasurement, setUnitOfMeasurement] = useState('');
  const [supplier, setSupplier] = useState<string | null>('');
  const [category, setCategory] = useState<string | null>('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(<div />);

  const { supplierList, categoryList, setRefresh, setCurrentPage, setCurrentSection } =
    useInventory();

  const handleItemNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    setItemName(event.target.value);
  const handlePackageUnitChange = (event: ChangeEvent<HTMLInputElement>) =>
    setPackageUnit(event.target.value);
  const handleUnitOfMeasurementChange = (event: ChangeEvent<HTMLInputElement>) =>
    setUnitOfMeasurement(event.target.value);

  const handleAddItem = async () => {
    if (
      itemName === '' ||
      packageUnit === '' ||
      unitOfMeasurement === '' ||
      supplier === '' ||
      category === ''
    ) {
      setNotificationMessage(
        CustomNotification(
          'error',
          'Fill Up Required Fields',
          'Please fill up all required fields before submitting.',
          closeNotification
        )
      );
    } else {
      const newItemObj: Item = {
        ...defaultItem,
        supplierId: supplier ?? '',
        itemName,
        packageUnit,
        supplyUnit: unitOfMeasurement,
        category: category ?? '',
      };

      // Create a new request
      const request = new Request('/api/items/', {
        method: 'POST',
        body: JSON.stringify(newItemObj),
      });

      try {
        // Fetch the request created
        const response = await fetch(request);

        // If it is successful provide feedback
        if (response.ok) {
          console.log('Success');
          setNotificationMessage(
            CustomNotification(
              'success',
              'Item Added!',
              `Item ${itemName} successfully added.`,
              closeNotification
            )
          );
        }

        // Trigger a refresh to retrieve updated inventory information
        setRefresh((prev: number) => prev + 1);

        //Reset Fields
        setItemName('');
        setPackageUnit('');
        setUnitOfMeasurement('');
        setSupplier('');
        setCategory('');
      } catch (error) {
        console.log(error);
        setNotificationMessage(
          CustomNotification(
            'error',
            'Error Encountered',
            'Unexpected Error encountered. Please try again.',
            closeNotification
          )
        );
      }
    }
    // Display notification for 3 seconds.
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  useEffect(() => {
    setCurrentPage('Add Item');
    setCurrentSection('inventory');
  }, []);

  return (
    <main>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minWidth: '50vw',
          height: '100vh',
          padding: 10,
        }}
      >
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
            Add
          </Text>
          <SimpleGrid cols={2} spacing="xl" verticalSpacing="xl">
            <TextInput
              label="Item Name"
              withAsterisk
              placeholder="Enter Item Name..."
              value={itemName}
              onChange={handleItemNameChange}
            />
            <TextInput label="Item ID" disabled />
            <TextInput
              label="Package Unit"
              withAsterisk
              placeholder="Enter Package Unit..."
              value={packageUnit}
              onChange={handlePackageUnitChange}
            />
            <TextInput
              label="Unit of Measurement"
              withAsterisk
              placeholder="pc / kg / pounds / bottle / etc."
              value={unitOfMeasurement}
              onChange={handleUnitOfMeasurementChange}
              size="md"
            />
            <Select
              label="Supplier/Source"
              withAsterisk
              placeholder="Select Supplier"
              data={
                supplierList
                  ? supplierList.map((supplier) => ({
                      value: supplier.supplierId,
                      label: supplier.supplierName,
                    }))
                  : []
              }
              size="md"
              allowDeselect
              value={supplier || null}
              onChange={setSupplier}
            />
            <Select
              label="Category"
              withAsterisk
              placeholder="Select Category"
              data={
                categoryList
                  ? categoryList.map((category) => {
                      return category;
                    })
                  : []
              }
              size="md"
              allowDeselect
              value={category || null}
              onChange={setCategory}
            />
          </SimpleGrid>
          <Button variant="filled" color="#1B4965" size="md" mt="xl" onClick={handleAddItem}>
            Submit
          </Button>
          {showNotification && notificationMessage}
        </Group>
      </div>
    </main>
  );
}
