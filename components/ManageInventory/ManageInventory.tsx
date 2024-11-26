import { IconChevronRight } from '@tabler/icons-react';
import { Group, Tabs, Text } from '@mantine/core';
import AddItem from '../AddItem/AddItem';
import DeleteItem from '../DeleteItem/DeleteItem';
import SearchItem from '../SearchItem/SearchItem';
import UpdateItem from '../UpdateItem/UpdateItem';
import classes from './ManageInventory.module.css';

export default function ManageInventory() {
  return (
    <Tabs
      defaultValue="Search"
      orientation="vertical"
      classNames={{
        tab: classes.tab,
        panel: classes.panel,
        list: classes.list,
        root: classes.root,
      }}
    >
      <Tabs.List>
        <Tabs.Tab value="searchItem">
          <Group classNames={{
            root: classes.rootGroup
          }}>
            <Text>Search Item</Text>
            <IconChevronRight size={24} stroke={1.5} />
          </Group>
        </Tabs.Tab>
        <Tabs.Tab value="addItem">
          <Group classNames={{
            root: classes.rootGroup
          }}>
            <Text>Add Item</Text>
            <IconChevronRight size={24} stroke={1.5} />
          </Group>
        </Tabs.Tab>
        <Tabs.Tab value="updateItem">
          <Group classNames={{
            root: classes.rootGroup
          }}>
            <Text>Update Item</Text>
            <IconChevronRight size={24} stroke={1} />
          </Group>
        </Tabs.Tab>
        <Tabs.Tab value="deleteItem">
          <Group classNames={{
            root: classes.rootGroup
          }}>
            <Text>Delete Item</Text>
            <IconChevronRight size={24} stroke={1.5} />
          </Group>
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="searchItem">
        <SearchItem />
      </Tabs.Panel>
      <Tabs.Panel value="addItem">
        <AddItem />
      </Tabs.Panel>
      <Tabs.Panel value="updateItem">
        <UpdateItem />
      </Tabs.Panel>
      <Tabs.Panel value="deleteItem">
        <DeleteItem />
      </Tabs.Panel>
    </Tabs>
  );
}
