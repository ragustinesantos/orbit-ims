'use client';

import { useEffect, useState } from 'react';
import { Button, Group, Select, Table, TableData, Text, TextInput } from '@mantine/core';
import { useInventory } from '@/app/_utils/inventory-context';
import { defaultItem, Item } from '@/app/_utils/schema';
import CustomNotification from '@/components/CustomNotification/CustomNotification';
import TableDeleteBtn from '../TableDeleteBtn/TableDeleteBtn';
import classnames from './CreateRorTemplate.module.css';

export default function CreateRorTemplate() {
  const { inventory, supplierList, setRefresh } = useInventory();

  const [searchValue, setSearchValue] = useState<string | null>('');
  const [selectedItem, setSelectedItem] = useState<Item>({ ...defaultItem });
  const [itemList, setItemList] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(<div />);

  // Find item to search in inventory and set as selectedItem
  useEffect(() => {
    const matchedItem = inventory?.find((item) => item.itemId === searchValue);
    setSelectedItem(matchedItem || { ...defaultItem });
    setRefresh((prev: number) => prev + 1);
  }, [searchValue]);

  const closeNotification = () => {
    setShowNotification(false);
  };

  const revealNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Adding items to the template's item list
  const handleAddToItemList = () => {
    if (!selectedItem.itemId) {
      setNotificationMessage(
        CustomNotification('error', 'Error Encountered', 'Item cannot be empty.', closeNotification)
      );
      revealNotification();
    } else if (itemList.includes(selectedItem.itemId)) {
      setNotificationMessage(
        CustomNotification(
          'error',
          'Error Encountered',
          'Item has already been added to the template.',
          closeNotification
        )
      );
      revealNotification();
    } else if (selectedItem.itemId && !itemList.includes(selectedItem.itemId)) {
      setItemList((prev) => [...prev, selectedItem.itemId]);
      setSearchValue('');
    }
  };

  // Deleting items from the template's item list
  const handleDeleteFromItemList = (itemId: string) => {
    setItemList((prev) => prev.filter((prevItem) => prevItem !== itemId));
  };

  // Map through the list of item id's to retrieve data for the template table body
  const mappedItemList = itemList.map((itemId) => {
    const currentItem = inventory?.find((invItem) => invItem.itemId === itemId);
    const currentSupplier = supplierList?.find(
      (supplier) => supplier.supplierId === currentItem?.supplierId
    );
    return [
      currentItem?.itemName,
      currentItem?.category,
      currentItem?.supplyUnit,
      currentItem?.packageUnit,
      currentSupplier?.supplierName,
      <TableDeleteBtn itemId={currentItem?.itemId} handleDelete={handleDeleteFromItemList} />,
    ];
  });

  // Table information (keys are caption, head and body)
  const tableData: TableData = {
    head: ['Item', 'Category', 'Unit of Measurement', 'Package Unit', 'Supplier', 'Remove'],
    body: mappedItemList,
  };

  return (
    <main className={classnames.rootMain}>
      <Group
        classNames={{
          root: classnames.rootOuterGroup,
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
            Create ROR Template
          </Text>
          <TextInput label="Template Name" withAsterisk placeholder="Enter Template Name..." />
          <Group
            classNames={{
              root: classnames.searchGroup,
            }}
          >
            <Select
              label="Add an Item"
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
              size="sm"
              withAsterisk
            />
            <Button variant="filled" color="#1B4965" size="sm" onClick={handleAddToItemList}>
              +
            </Button>
          </Group>
          {itemList.length > 0 && <Table striped classNames={{table: classnames.rootTable}} data={tableData} />}
        </Group>
        <Button classNames={{root: classnames.submitButton}} variant="filled" color="#1B4965" size="md">
          Create Template
        </Button>
      </Group>
      {showNotification && notificationMessage}
    </main>
  );
}
