'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Group, Notification, Select, SimpleGrid, Text, TextInput, rem } from '@mantine/core';
import { IconX, IconCheck } from '@tabler/icons-react';
import classnames from './AddItem.module.css';
import { defaultNewItem, item } from '@/app/_utils/schema';

interface supplierType {
  id: string,
  supplierName: string,
  contactNumber: string,
  email: string,
  address: string,
}

export default function AddItem() {

  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  const [itemName, setItemName] = useState('');
  const [packageUnit, setPackageUnit] = useState('');
  const [unitOfMeasurement, setUnitOfMeasurement] = useState('');
  const [supplier, setSupplier] = useState<string | null>('');
  const [category, setCategory] = useState<string | null>('');
  const [supplierList, setSupplierList] = useState<supplierType[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(<div></div>);

  const handleItemNameChange = (event: ChangeEvent<HTMLInputElement>) => setItemName(event.target.value);
  const handlePackageUnitChange = (event: ChangeEvent<HTMLInputElement>) => setPackageUnit(event.target.value);
  const handleUnitOfMeasurementChange = (event: ChangeEvent<HTMLInputElement>) => setUnitOfMeasurement(event.target.value);

  async function getAllSuppliers() {
    const response = await fetch("http://localhost:3000/api/suppliers/");
    const data = await response.json();
    setSupplierList(data);
  }

  const handleAddItem = async () => {

    if (itemName == '' ||
      packageUnit == '' ||
      unitOfMeasurement == '' ||
      supplier == '' ||
      category == '') {

      setNotificationMessage(
        <Notification
          withBorder icon={xIcon}
          color="red"
          title="Fill Up Required Fields"
          onClose={closeNotification}
        >
          Please fill up all required fields before submitting.
        </Notification>
      );
    }
    else {
      let newItemObj: item = {
        ...defaultNewItem,
        supplierId: supplier ?? '',
        itemName: itemName,
        packageUnit: packageUnit,
        supplyUnit: unitOfMeasurement,
        category: category ?? '',
      }

      let request = new Request(
        "http://localhost:3000/api/items/",
        {
          method: "POST",
          body: JSON.stringify(newItemObj)
        }
      );

      try {
        const response = await fetch(request);
        if (response.ok) {
          console.log("Success");
          setNotificationMessage(
            <Notification
              withBorder icon={checkIcon}
              color="green"
              title="Item Added!"
              onClose={closeNotification}
            >
              Item {itemName} successfully added.
            </Notification>
          );
        }
        setItemName('');
        setPackageUnit('');
        setUnitOfMeasurement('');
        setSupplier('');
        setCategory('');
      } catch (error) {
        console.log(error);
        setNotificationMessage(
          <Notification
            withBorder icon={checkIcon}
            color="red"
            title="Error Encountered"
            onClose={closeNotification}
          >
            Unexpected Error encountered. Please try again.
          </Notification>
        );
      }
    }
    // Display notification for 3 seconds.
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false)
    }, 3000);
  }

  const closeNotification = () => {
    setShowNotification(false);
  }

  useEffect(() => {
    getAllSuppliers();
  }, [])


  return (
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
          withAsterisk placeholder="Enter Item Name..."
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
          size='md'
        />
        <Select
          label="Supplier/Source"
          withAsterisk
          placeholder="Select Supplier"
          data={supplierList.map((supplier) => ({
            value: supplier.id,
            label: supplier.supplierName,
          }))}
          size='md'
          allowDeselect
          value={supplier || null}
          onChange={setSupplier}
        />
        <Select
          label="Category"
          withAsterisk
          placeholder="Select Category"
          data={['Food', 'Cleaning Supplies', 'Medicine', 'Office Supplies']}
          size='md'
          allowDeselect
          value={category || null}
          onChange={setCategory}
        />
      </SimpleGrid>
      <Button
        variant="filled"
        color="#1B4965"
        size="md"
        mt="xl"
        onClick={handleAddItem}
      >
        Submit
      </Button>
      {
        showNotification &&
        notificationMessage
      }
    </Group>
  );
}
