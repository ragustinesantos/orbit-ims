/* eslint-disable no-console */
'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Group, Select, SimpleGrid, Text, TextInput } from '@mantine/core';
import { useInventory } from '@/app/_utils/inventory-context';
import { defaultItem, Item } from '@/app/_utils/schema';
import CustomNotification from '@/components/CustomNotification/CustomNotification';
import classnames from './CreateRorTemplate.module.css';

export default function CreateRorTemplate() {
  const { inventory, setRefresh } = useInventory();

  const [searchValue, setSearchValue] = useState<string | null>('');
  const [selectedItem, setSelectedItem] = useState<Item>({ ...defaultItem });
  const [itemList, setItemList] = useState<string[]>([]);

  // Find item to search in inventory and set as selectedItem
  useEffect(() => {
    const matchedItem = inventory?.find((item) => item.itemId === searchValue);
    setSelectedItem(matchedItem || { ...defaultItem });
    setRefresh((prev: number) => prev + 1);
  }, [searchValue]);

  const handleAddToItemList = () => {
    const newItemList = [...itemList, selectedItem.itemId];
    setItemList(newItemList);
  };

  return (
    <main>
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
      </Group>
    </main>
  );
}
