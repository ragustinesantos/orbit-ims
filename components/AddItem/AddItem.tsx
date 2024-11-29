'use client';

import { Button, Group, Select, SimpleGrid, Text, TextInput } from '@mantine/core';
import classnames from './AddItem.module.css';

export default function AddItem() {
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
          withAsterisk
          placeholder="Enter Item Name..."
          classNames={{ root: classnames.txtItemName }}
          size='md'
        />
        <TextInput label="Package Unit" withAsterisk placeholder="Enter Package Unit..." />
        <TextInput
          label="Unit of Measurement"
          withAsterisk
          placeholder="pc / kg / pounds / bottle / etc."
          size='md'
        />
        <Select
          label="Supplier/Source"
          withAsterisk
          placeholder="Select Supplier"
          data={['Supplier 1', 'Supplier 2', 'Supplier 3', 'Supplier 4']}
          size='md'
          allowDeselect
        />
        <Select
          label="Category"
          withAsterisk
          placeholder="Select Category"
          data={['Food', 'Cleaning Supplies', 'Medicine', 'Office Supplies']}
          size='md'
          allowDeselect
        />
      </SimpleGrid>
      <Button variant="filled" color="#1B4965" size="md" mt="xl">
        Submit
      </Button>
    </Group>
  );
}
