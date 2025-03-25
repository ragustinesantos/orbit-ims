/* eslint-disable no-console */
'useclient';

import { useEffect, useState } from 'react';
import { Button, Group, Select, Table, Text } from '@mantine/core';
import { useInventory } from '@/app/_utils/inventory-context';
import { ItemOrder } from '@/app/_utils/schema';
import CustomNotification from '../CustomNotification/CustomNotification';
import ImgModal from '../ImgModal/ImgModal';
import classnames from './odor1.module.css';

// Set the Prop Data type so a useState Set function
//Always Remeber that props are passed as one object only!
interface setpropstype {
  itemOrders: ItemOrder[];
  setitemOrders: React.Dispatch<React.SetStateAction<ItemOrder[]>>;
}

export default function OdorComponent({ itemOrders, setitemOrders }: setpropstype) {
  const { inventory, supplierList } = useInventory();
  const [searchValue, setSearchValue] = useState<string | null>('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(<div />);
  const [modalStateTracker, setModalStateTracker] = useState<Record<string, boolean>>({});

  //Get item object from inventory and assign it to itemOrders Array
  function handleAddItem() {
    const matchedItem = inventory?.find((item) => item.itemId === searchValue);
    console.log(matchedItem);
    if (itemOrders.find((item) => item.itemId === matchedItem?.itemId)) {
      setNotificationMessage(
        CustomNotification(
          'error',
          'Error Encountered',
          'Item has already been added to the template.',
          setShowNotification
        )
      );
      revealNotification();
    } else if (matchedItem === undefined) {
      setNotificationMessage(
        CustomNotification(
          'error',
          'Error Encountered',
          'Item cannot be empty.',
          setShowNotification
        )
      );
      revealNotification();
    } else {
      const newItem: ItemOrder = {
        itemId: matchedItem ? matchedItem.itemId : '',
        orderQty: 1,
        pendingQty: 1,
        servedQty: 0,
      };
      setitemOrders((prevOrders) => [...prevOrders, newItem]);
    }
    setSearchValue('');
  }

  // To log the item orders array to the console to see the updated state
  useEffect(() => {
    console.log('Updated itemOrders:', itemOrders);
  }, [itemOrders]);

  // Function to reveal any triggered notification
  const revealNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  function increment(id: string) {
    setitemOrders((prevItems) =>
      prevItems.map((item) =>
        item.itemId === id
          ? { ...item, orderQty: item.orderQty + 1, pendingQty: item.pendingQty + 1 }
          : item
      )
    );
  }

  function decrement(id: string) {
    setitemOrders((prevItems) =>
      prevItems.map((item) =>
        item.itemId === id && item.orderQty > 1
          ? { ...item, orderQty: item.orderQty - 1, pendingQty: item.pendingQty - 1 }
          : item
      )
    );
  }

  function handleRemoveItem(item: ItemOrder) {
    const position = itemOrders.indexOf(item);
    itemOrders.splice(position, 1);
    setitemOrders([...itemOrders]);
  }

  // Every time an ID is clicked this should run and set the state of modal visibility to the opposite of its previous value
  const toggleImgModalState = (itemId: string) => {
    setModalStateTracker((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const rows = itemOrders.map((item) => {
    const odorItem = inventory?.find((inv) => inv.itemId === item.itemId);
    const supplier = supplierList?.find((inv) => inv.supplierId === odorItem?.supplierId);
    return (
      <Table.Tr key={odorItem?.itemId}>
        <ImgModal
          item={odorItem}
          isOpened={!!modalStateTracker[item.itemId]}
          isClosed={() => setModalStateTracker((prev) => ({ ...prev, [item.itemId]: false }))}
        />
        <Table.Td style={{ maxWidth: '100px', overflowX: 'scroll', scrollbarWidth: 'none' }}>
          <Text
            onClick={() => toggleImgModalState(item.itemId)}
            classNames={{ root: classnames.imgModalID }}
          >
            {odorItem?.itemId}
          </Text>
        </Table.Td>
        <Table.Td>{odorItem?.itemName}</Table.Td>
        <Table.Td>{odorItem?.category}</Table.Td>
        <Table.Td>{odorItem?.supplyUnit}</Table.Td>
        <Table.Td>{odorItem?.packageUnit}</Table.Td>
        <Table.Td>{supplier?.supplierName} </Table.Td>
        <Table.Td>
          <Button
            classNames={{ root: `${classnames.buttonDecrement} ${classnames.button}` }}
            onClick={() => decrement(item.itemId)}
            variant="filled"
            size="xs"
            radius="md"
          >
            -
          </Button>
          <span style={{ width: '30px', textAlign: 'center', display: 'inline-block' }}>
            {item.orderQty}
          </span>
          <Button
            classNames={{ root: `${classnames.buttonIncrement} ${classnames.button}` }}
            onClick={() => increment(item.itemId)}
            variant="filled"
            size="xs"
            radius="md"
          >
            +
          </Button>
        </Table.Td>
        <Table.Td>
          <Button
            onClick={() => handleRemoveItem(item)}
            variant="filled"
            color="red"
            size="xs"
            radius="xl"
          >
            Delete
          </Button>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <div className={classnames.outerScrollBox}>
      <div className={classnames.templateTitle}>Inventory Item</div>
      <div className={`${classnames.scrollableContainer} scrollableContainer`}>
        <Group
          classNames={{
            root: classnames.searchGroup,
          }}
        >
          <Select
            label="Add an item"
            placeholder="Select an item from the list..."
            data={inventory?.map((item) => ({
              value: item.itemId,
              label: item.itemName,
              invenvtoryID: item.inventoryId,
            }))}
            allowDeselect
            searchable
            value={searchValue || null}
            onChange={setSearchValue}
            classNames={{ root: classnames.selectBar }}
            size="sm"
            withAsterisk
          />
          <Button
            style={{ marginLeft: '1vw' }}
            variant="filled"
            color="#228BE6"
            size="sm"
            mt="xl"
            onClick={handleAddItem}
          >
            +
          </Button>
        </Group>
        <div>
          {itemOrders.length > 0 && (
            <Table striped classNames={{ thead: classnames.thead, td: classnames.td }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Item ID</Table.Th>
                  <Table.Th>Item</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Unit of Measurement</Table.Th>
                  <Table.Th>Package Unit</Table.Th>
                  <Table.Th>Supplier</Table.Th>
                  <Table.Th>QTY</Table.Th>
                  <Table.Th>Delete</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          )}
        </div>
        {showNotification && notificationMessage}
      </div>
    </div>
  );
}
