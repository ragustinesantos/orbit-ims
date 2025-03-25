/* eslint-disable no-console */
'useclient';

import { ChangeEvent, useEffect, useState } from 'react';
import { Button, NumberInput, SimpleGrid, Table, Text, TextInput } from '@mantine/core';
import { NewItemOrder } from '@/app/_utils/schema';
import CustomNotification from '@/components/CustomNotification/CustomNotification';
import classnames from './odor2.module.css';

interface setpropstype {
  newItemOrders: NewItemOrder[];
  setNewItemOrders: React.Dispatch<React.SetStateAction<NewItemOrder[]>>;
  totalCost: number;
  setTotalCost: React.Dispatch<React.SetStateAction<number>>;
  showTemplate: boolean;
  setShowTemplate: React.Dispatch<React.SetStateAction<boolean>>;
  nextPage: () => void;
}

export default function OdorComponent2({
  newItemOrders,
  setNewItemOrders,
  totalCost,
  setTotalCost,
  showTemplate,
  setShowTemplate,
  nextPage,
}: setpropstype) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemProductCode, setNewItemProductCode] = useState('');
  const [newItemPurchaseQTY, setNewItemPurchaseQTY] = useState<string | number>('');
  const [newItemUnitPrice, setNewItemUnitPrice] = useState<string | number>('');
  const [disposalPlan, setDisposalPlan] = useState('');
  const [purposeForPurchase, setPurposeForPurchase] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(<div />);

  function handleShowTemplate() {
    setShowTemplate(true);
  }

  const handleNewItemNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewItemName(event.target.value);
  };

  const handleNewItemDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewItemDescription(event.target.value);
  };
  const handleNewItemProductCode = (event: ChangeEvent<HTMLInputElement>) => {
    setNewItemProductCode(event.target.value);
  };

  const handleSetDisposalPlan = (event: ChangeEvent<HTMLInputElement>) => {
    setDisposalPlan(event.target.value);
  };

  const handleSetPurposeForPurchase = (event: ChangeEvent<HTMLInputElement>) => {
    setPurposeForPurchase(event.target.value);
  };

  // Create new Object and add to new Item orders Array, Calculate Subtotal
  function handleAddItem() {
    console.log('handle add item pressed');

    if (
      newItemName === '' ||
      newItemDescription === '' ||
      newItemProductCode === '' ||
      newItemPurchaseQTY === '' ||
      newItemUnitPrice === '' ||
      disposalPlan === '' ||
      purposeForPurchase === ''
    ) {
      setNotificationMessage(
        CustomNotification(
          'error',
          'Fill Up Required Fields',
          'Please fill up all required fields before submitting.',
          setShowNotification
        )
      );
      revealNotification();
    } else {
      const newItem: NewItemOrder = {
        itemName: newItemName,
        itemDescription: newItemDescription,
        productCode: newItemProductCode,
        disposalPlan,
        purposeForPurchase,
        purchaseQty: Number(newItemPurchaseQTY),
        unitPrice: Number(newItemUnitPrice),
        itemSubtotal: Number(newItemPurchaseQTY) * Number(newItemUnitPrice),
      };
      setNewItemOrders((prevOrders) => [...prevOrders, newItem]);
      setNewItemName('');
      setNewItemDescription('');
      setNewItemProductCode('');
      setNewItemPurchaseQTY(0);
      setNewItemUnitPrice(0);
      setDisposalPlan('');
      setPurposeForPurchase('');
    }
  }

  // Function to reveal any triggered notification
  const revealNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Everytime NewItemOrders is modified re calculate the total Cost
  useEffect(() => {
    setTimeout(() => {
      let holder: number = 0;
      for (const item of newItemOrders) {
        holder += item.purchaseQty * item.unitPrice;
      }
      setTotalCost(Math.round(holder * 100) / 100);
    }, 200);
  }, [newItemOrders]);

  function cancelOrder() {
    setNewItemName('');
    setNewItemDescription('');
    setNewItemProductCode('');
    setNewItemPurchaseQTY(0);
    setNewItemUnitPrice(0);
    setDisposalPlan('');
    setPurposeForPurchase('');
    setNewItemOrders([]);
  }

  const template = (
    <div>
      <SimpleGrid cols={4} spacing="xs" verticalSpacing="xs">
        <TextInput
          label="Item Name"
          withAsterisk
          placeholder="Enter Item Name..."
          size="xs"
          value={newItemName}
          onChange={handleNewItemNameChange}
        />
        {/*<TextInput label="Item ID" disabled />*/}
        <TextInput
          label="Item Description or Source Link"
          withAsterisk
          placeholder="Description or URL..."
          size="xs"
          value={newItemDescription}
          onChange={handleNewItemDescriptionChange}
        />
        <TextInput
          label="Product Code"
          withAsterisk
          placeholder="Enter ID# or SIN#..."
          size="xs"
          value={newItemProductCode}
          onChange={handleNewItemProductCode}
        />
        <div className={classnames.buttonDiv}>
          <Button onClick={handleAddItem}>Add</Button>
          <Button
            classNames={{ root: classnames.cancel }}
            onClick={() => {
              setShowTemplate(false);
              cancelOrder();
            }}
            color="red"
          >
            Cancel Order
          </Button>
        </div>
        <NumberInput
          label="Purchase Quantity"
          withAsterisk
          placeholder="Enter Quantity of item..."
          size="xs"
          value={newItemPurchaseQTY}
          onChange={setNewItemPurchaseQTY}
          allowDecimal={false}
        />
        <NumberInput
          label="Unit Price"
          withAsterisk
          placeholder="Enter Cost of one item..."
          size="xs"
          value={newItemUnitPrice}
          onChange={setNewItemUnitPrice}
          min={0}
        />
        <TextInput
          label="Disposal Plan"
          withAsterisk
          placeholder="Recyclable..."
          size="xs"
          value={disposalPlan}
          onChange={handleSetDisposalPlan}
        />
        <div>
          <Text classNames={{ root: classnames.orderTotalLabel }}>Total Cost</Text>
          <Text classNames={{ root: classnames.orderTotalText }}>{`$${totalCost}`}</Text>
        </div>
        <TextInput
          label="Purpose For Purchase"
          withAsterisk
          placeholder="Please explain why we need this item..."
          size="xs"
          value={purposeForPurchase}
          onChange={handleSetPurposeForPurchase}
        />
      </SimpleGrid>
    </div>
  );

  const rows = newItemOrders.map((item) => {
    return (
      <Table.Tr key={newItemOrders.indexOf(item)}>
        <Table.Td
          style={{
            maxWidth: '100px',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {item?.itemName}
        </Table.Td>
        <Table.Td
          style={{
            maxWidth: '100px',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {item?.itemDescription}
        </Table.Td>
        <Table.Td
          style={{
            maxWidth: '100px',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {item?.productCode}
        </Table.Td>
        <Table.Td
          style={{
            maxWidth: '100px',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {item?.disposalPlan}
        </Table.Td>
        <Table.Td
          style={{
            maxWidth: '100px',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {item?.purposeForPurchase}
        </Table.Td>
        <Table.Td>{`$${item?.unitPrice}`}</Table.Td>
        <Table.Td>{`$${Math.round(item?.unitPrice * item?.purchaseQty * 100) / 100}`}</Table.Td>
        <Table.Td>
          <Button
            classNames={{ root: `${classnames.buttonDecrement} ${classnames.button}` }}
            onClick={() => decrement(newItemOrders.indexOf(item))}
            variant="filled"
            size="xs"
            radius="md"
          >
            -
          </Button>
          <span style={{ width: '30px', textAlign: 'center', display: 'inline-block' }}>
            {item.purchaseQty}
          </span>
          <Button
            classNames={{ root: `${classnames.buttonIncrement} ${classnames.button}` }}
            onClick={() => increment(newItemOrders.indexOf(item))}
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
            color="red"
            variant="filled"
            size="xs"
            radius="xl"
          >
            Delete
          </Button>
        </Table.Td>
      </Table.Tr>
    );
  });

  function increment(index: number) {
    setNewItemOrders((prevItems) =>
      prevItems.map((item) =>
        newItemOrders.indexOf(item) === index
          ? {
              ...item,
              purchaseQty: item.purchaseQty + 1,
              itemSubtotal: item.purchaseQty * item.unitPrice,
            }
          : item
      )
    );
  }

  function decrement(index: number) {
    setNewItemOrders((prevItems) =>
      prevItems.map((item) =>
        newItemOrders.indexOf(item) === index && item.purchaseQty > 1
          ? {
              ...item,
              purchaseQty: item.purchaseQty - 1,
              itemSubtotal: item.purchaseQty * item.unitPrice,
            }
          : item
      )
    );
  }

  function handleRemoveItem(item: NewItemOrder) {
    const position = newItemOrders.indexOf(item);
    newItemOrders.splice(position, 1);
    setNewItemOrders([...newItemOrders]);
  }

  return (
    <div className={classnames.outerScrollBox}>
      {showTemplate && <div className={classnames.templateTitle}>Non-Inventory Item</div>}
      <div className={`${classnames.scrollableContainer} scrollableContainer`}>
        {showTemplate ? (
          template
        ) : (
          <div className={classnames.interiorDiv}>
            <Text classNames={{ root: classnames.rootText }}>Order Non Inventory Item</Text>
            <Text>Would you like to order a item that is not in the Inventory?</Text>
            <div>
              <Button style={{ marginLeft: '0.5vw' }} onClick={handleShowTemplate}>
                Yes
              </Button>
              <Button style={{ marginLeft: '0.5vw' }} onClick={nextPage}>
                No
              </Button>
            </div>
          </div>
        )}
        <div>
          {showTemplate ? (
            newItemOrders.length > 0 && (
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Item Name</Table.Th>
                    <Table.Th>Item Description</Table.Th>
                    <Table.Th>Product Code</Table.Th>
                    <Table.Th>Disposal Plan</Table.Th>
                    <Table.Th>Purpose for Purchase</Table.Th>
                    <Table.Th>Unit Price</Table.Th>
                    <Table.Th>Item Subtotal</Table.Th>
                    <Table.Th>Purchase Quantity</Table.Th>
                    <Table.Th>Delete</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            )
          ) : (
            <></>
          )}
        </div>
        {showNotification && notificationMessage}
      </div>
    </div>
  );
}
