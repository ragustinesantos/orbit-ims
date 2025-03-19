'useclient';

import { useState } from 'react';
import { Group, Table, Text, TextInput } from '@mantine/core';
import { useInventory } from '@/app/_utils/inventory-context';
import { ItemOrder, NewItemOrder } from '@/app/_utils/schema';
import ImgModal from '../ImgModal/ImgModal';
import classnames from './odor3.module.css';

interface setpropstype {
  itemOrders: ItemOrder[];
  newItemOrders: NewItemOrder[];
  totalCost: number;
  orderTotal: number;
  remarks: string;
  setRemarks: React.Dispatch<React.SetStateAction<string>>;
  recipientName: string;
  setRecipientName: React.Dispatch<React.SetStateAction<string>>;
  recipientLocation: string;
  setRecipientLocation: React.Dispatch<React.SetStateAction<string>>;
}

export default function OdorComponent3({
  itemOrders,
  newItemOrders,
  totalCost,
  orderTotal,
  remarks,
  setRemarks,
  recipientName,
  setRecipientName,
  recipientLocation,
  setRecipientLocation,
}: setpropstype) {
  const { inventory, supplierList } = useInventory();
  const [modalStateTracker, setModalStateTracker] = useState<Record<string, boolean>>({});

  // Every time an ID is clicked this should run and set the state of modal visibility to the opposite of its previous value
  const toggleImgModalState = (itemId: string) => {
    setModalStateTracker((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const itemrows = itemOrders.map((item) => {
    const odorItem = inventory?.find((inv) => inv.itemId === item.itemId);
    const supplier = supplierList?.find((inv) => inv.supplierId === odorItem?.supplierId);
    return (
      <Table.Tr key={odorItem?.itemId}>
        <ImgModal
          item={odorItem}
          isOpened={!!modalStateTracker[item.itemId]}
          isClosed={() => setModalStateTracker((prev) => ({ ...prev, [item.itemId]: false }))}
        />
        <Table.Td
          style={{
            maxWidth: '100px',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            whiteSpace: 'nowrap',
          }}
        >
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
          <span style={{ width: '30px', textAlign: 'center', display: 'inline-block' }}>
            {item.orderQty}
          </span>
        </Table.Td>
      </Table.Tr>
    );
  });

  const rows = newItemOrders.map((item) => {
    return (
      <Table.Tr key={newItemOrders.indexOf(item)}>
        <Table.Td
          style={{
            maxWidth: '150px',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {item?.itemName}
        </Table.Td>
        <Table.Td
          style={{
            maxWidth: '150px',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {item?.itemDescription}
        </Table.Td>
        <Table.Td
          style={{
            maxWidth: '150px',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {item?.productCode}
        </Table.Td>
        <Table.Td
          style={{
            maxWidth: '150px',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {item?.disposalPlan}
        </Table.Td>
        <Table.Td
          style={{
            maxWidth: '150px',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {item?.purposeForPurchase}
        </Table.Td>
        <Table.Td>{'$' + item?.unitPrice} </Table.Td>
        <Table.Td>{'$' + Math.round(item?.unitPrice * item?.purchaseQty * 100) / 100}</Table.Td>
        <Table.Td>
          <span style={{ width: '30px', textAlign: 'center', display: 'inline-block' }}>
            {item.purchaseQty}
          </span>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <div className={classnames.outerScrollingBox}>
      <div className={`${classnames.scrollableContainer} scrollableContainer`}>
        <Text className={classnames.templateHeading}>Order Review</Text>
        <Group>
          <TextInput
            label="Recipient Name"
            withAsterisk
            placeholder="Recipient that will receive the order....."
            size="xs"
            value={recipientName}
            onChange={(event) => setRecipientName(event.target.value)}
          />
          <TextInput
            label="Recipient Location"
            withAsterisk
            placeholder="Location to deliver the order...."
            size="xs"
            value={recipientLocation}
            onChange={(event) => setRecipientLocation(event.target.value)}
          />
          <TextInput
            classNames={{ root: classnames.remarksStyle }}
            label="Remarks"
            placeholder="Add any additional Comments..."
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)}
            size="xs"
          />
        </Group>
        {itemOrders.length > 0 && (
          <div>
            <Text className={classnames.templateHeading}>Inventory Items</Text>
            <Table striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Item ID</Table.Th>
                  <Table.Th>Item</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Unit of Measurement</Table.Th>
                  <Table.Th>Package Unit</Table.Th>
                  <Table.Th>Supplier</Table.Th>
                  <Table.Th>QTY</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{itemrows}</Table.Tbody>
            </Table>
          </div>
        )}
        {newItemOrders.length > 0 && (
          <div>
            <Text className={classnames.templateHeading}>Non-Inventory Items</Text>
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
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </div>
        )}
        <Text className={classnames.templateHeading}>Order Summary</Text>
        <Group>
          <div>
            <Text classNames={{ root: classnames.orderTotalLabel }}>Total Items</Text>
            <Text classNames={{ root: classnames.orderTotalText }}>{String(orderTotal)}</Text>
          </div>
          {newItemOrders.length > 0 && (
            <div>
              <Text classNames={{ root: classnames.orderTotalLabel }}>Total Cost</Text>
              <Text classNames={{ root: classnames.orderTotalText }}>{'$' + totalCost}</Text>
            </div>
          )}
        </Group>
      </div>
    </div>
  );
}
