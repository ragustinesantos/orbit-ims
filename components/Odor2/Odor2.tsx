'useclient';


import { ChangeEvent,useEffect, useState } from 'react';
import { Group, Select, Table, Text, Button , SimpleGrid, TextInput} from '@mantine/core';
import { Item } from '@/app/_utils/schema';
import classnames from './odor2.module.css';
import { useInventory } from '@/app/_utils/inventory-context';
import { number } from 'zod';
import { ItemOrder } from '@/app/_utils/schema';
import { NewItemOrder } from '@/app/_utils/schema';

interface setpropstype  {
  newItemOrders: NewItemOrder[];
  setNewItemOrders: React.Dispatch<React.SetStateAction<NewItemOrder[]>>;
  disposalPlan: string;
  setDisposalPlan: React.Dispatch<React.SetStateAction<string>>;
}

export default function OdorComponent2({disposalPlan,setDisposalPlan,newItemOrders,setNewItemOrders}: setpropstype) {

  const [showTemplate, setshowTemplate] = useState<boolean>(false)

  // Move to Parent Component
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemProductCode, setNewItemProductCode] = useState('');
  const [newItemPurchaseQTY, setNewItemPurchaseQTY] = useState(0);
  const [newItemUnitPrice, setNewItemUnitPrice] = useState(0);
  const [newItemSubtotal, setNewItemSubtotal] = useState(0);
  
  const [orderTotal, setorderTotal] = useState(0);

  function handleShowTemplate () {
    setshowTemplate(true);
  }


  const handleNewItemNameChange = (event: ChangeEvent<HTMLInputElement>) => {
      setNewItemName(event.target.value);
      console.log(newItemName)}
  const handleNewItemDescriptionChange = (event: ChangeEvent<HTMLInputElement>) =>{
    setNewItemDescription(event.target.value);
    console.log(newItemDescription)
  }
  const handleNewItemProductCode = (event: ChangeEvent<HTMLInputElement>) =>{
    setNewItemProductCode(event.target.value);
    console.log(newItemDescription)
  }
  const handleNewItemPurchaseQTY = (event: ChangeEvent<HTMLInputElement>) => {
    setNewItemPurchaseQTY(event.target.value);
    console.log(newItemPurchaseQTY)
  }

  const handleNewItemUnitPrice = (event: ChangeEvent<HTMLInputElement>) => {
    setNewItemUnitPrice(event.target.value);
    console.log(newItemPurchaseQTY)
  }

//Get item object from inventory and assign it to itemOrders Array
    function handleAddItem ( ) {
      console.log('handle add item pressed')
      let subtotal = newItemUnitPrice * newItemPurchaseQTY
      const newItem: NewItemOrder = {
        itemName: newItemName,
        itemDescription: newItemDescription,
        productCode: newItemProductCode,
        purchaseQty: newItemPurchaseQTY,
        unitPrice: newItemUnitPrice,
        itemSubtotal: newItemSubtotal,
        };
          setNewItemOrders((prevOrders) => [...prevOrders, newItem]);
      }
    









  const template = (
          <div>
          <div className={classnames.templateTitle}>Purchase Item</div>
          <SimpleGrid style={{ border: '1px solid red'}} cols={4} spacing="xl" verticalSpacing="xs">
          <TextInput
            label="Item Name"
            withAsterisk
            placeholder="Enter Item Name..."
            value={newItemName}
            onChange={handleNewItemNameChange}
          />
          {/*<TextInput label="Item ID" disabled />*/}
          <TextInput
            label="Item Description or Source Link"
            withAsterisk
            placeholder="Description or URL..."
            value={newItemDescription}
            onChange={handleNewItemDescriptionChange}
          />
          <TextInput
            label="Product Code"
            withAsterisk
            placeholder="Enter ID# or SIN#..."
            value={newItemProductCode}
            onChange={handleNewItemDescriptionChange}
          />
          <div className={classnames.buttonDiv}>
          <Button onClick={handleAddItem} classNames={{root: classnames.addButton,}}>Add</Button>
          </div>
          <TextInput
            label="Purchase Quantity"
            withAsterisk
            placeholder="Enter # of items..."
            value={newItemPurchaseQTY}
            onChange={handleNewItemDescriptionChange}
          />
          <TextInput
            label="Unit Price"
            withAsterisk
            placeholder="Enter Cost of one item..."
            value={newItemUnitPrice}
            onChange={handleNewItemDescriptionChange}
          />
          <TextInput
            label="Disposal Plan"
            withAsterisk
            placeholder="Recyclable..."
            value={disposalPlan}
            onChange={handleNewItemDescriptionChange}
          />
          <TextInput
            label="Order Total"
            variant="unstyled"
            placeholder={orderTotal.toString()}
            value={orderTotal}
            onChange={handleNewItemDescriptionChange}
          />
          </SimpleGrid>
            </div>
    );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const rows = newItemOrders.map((item) => {
      return (
        <Table.Tr key={item?.itemName}>
          <Table.Td style={{maxWidth: '100px', overflowX: 'scroll', scrollbarWidth: 'none' }}>{item?.itemName}</Table.Td>
          <Table.Td>{item?.itemName}</Table.Td>
          <Table.Td>{item?.itemDescription}</Table.Td>
          <Table.Td>{item?.productCode}</Table.Td>
          <Table.Td>{item?.purchaseQty}</Table.Td>
          <Table.Td>{item?.unitPrice} </Table.Td>
          <Table.Td>{item?.itemSubtotal}</Table.Td>
          <Table.Td>
            <Button classNames={{root:`${classnames.buttonDecrement} ${classnames.button}`}} onClick={()=>(decrement(item.itemName))} variant="filled" size="xs" radius="md" >-</Button>
            {item.purchaseQty}
            <Button classNames={{root:`${classnames.buttonIncrement} ${classnames.button}`}} onClick={()=>(increment(item.itemName))} variant="filled" size="xs" radius="md" >+</Button>
          </Table.Td>
          <Table.Td >
            <Button classNames={{root:`${classnames.buttonRemove}`}} onClick={()=>(handleRemoveItem(item))} variant="filled" size="xs" radius="md">Remove</Button>
          </Table.Td>
        </Table.Tr>
      ) 
    });

    // need to redo the math for the subtotal each time.
    function increment (name : string) {
      setNewItemOrders((prevItems) =>
        prevItems.map((item) => item.itemName === name ? 
        { ...item, orderQty: item.purchaseQty + 1 } : item));
    }
// need to redo the math for the subtotal each time.
    function decrement (name : string) {
      setNewItemOrders((prevItems) =>
        prevItems.map((item) => item.itemName === name && item.purchaseQty > 1 ? 
        { ...item, purchaseQty: item.purchaseQty - 1 } : item));
    }
// need to redo the math for the subtotal each time.
    function handleRemoveItem (item : NewItemOrder) {
      let position = newItemOrders.indexOf(item);
      newItemOrders.splice(position,1);
      setNewItemOrders([...newItemOrders]);

    }



    return (
    <div  style={{ border: '1px solid red'}}>
      <Text classNames={{root: classnames.odorText,}}>On Demand Order Requisition</Text>
      <div className={classnames.exteriorDiv}>
          {showTemplate ? template : 
            <div className={classnames.interiorDiv}>
              <Text classNames={{root: classnames.rootText,}}>Order Non Inventory Item</Text>
              <Text>Would you like to order a item that is not in the Inventory?</Text>
              <div>
                <Button onClick={handleShowTemplate} >Yes</Button>
              <Button onClick={handleShowTemplate} >No</Button> 
              </div>   
            </div>} 
            <div>{showTemplate ? 
                  <Table stickyHeader stickyHeaderOffset={60} withColumnBorders= {true}
                  striped={true} withTableBorder={true}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Item Name</Table.Th>
                        <Table.Th>Item Description</Table.Th>
                        <Table.Th>Product Code</Table.Th>
                        <Table.Th>Purchase Quantity</Table.Th>
                        <Table.Th>Unit Price</Table.Th>
                        <Table.Th>Item Subtotal</Table.Th>
                        <Table.Th>Delete</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
                : <></>}
        </div>
      </div>

    </div>

    );
  }
  
  