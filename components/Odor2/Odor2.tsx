'useclient';


import { ChangeEvent,useEffect, useState } from 'react';
import { Group, Select, Table, Text, Button , SimpleGrid, TextInput, NumberInput} from '@mantine/core';
import { Item } from '@/app/_utils/schema';
import classnames from './odor2.module.css';
import { useInventory } from '@/app/_utils/inventory-context';
import { number } from 'zod';
import { ItemOrder } from '@/app/_utils/schema';
import { NewItemOrder } from '@/app/_utils/schema';

interface setpropstype  {
  newItemOrders: NewItemOrder[];
  setNewItemOrders: React.Dispatch<React.SetStateAction<NewItemOrder[]>>;
  orderTotal: Number;
  setOrderTotal: React.Dispatch<React.SetStateAction<Number>>;
  showTemplate: boolean;
  setShowTemplate: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OdorComponent2({showTemplate,setShowTemplate, orderTotal,setOrderTotal, newItemOrders,setNewItemOrders}: setpropstype) {

  

  
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemProductCode, setNewItemProductCode] = useState('');
  const [newItemPurchaseQTY, setNewItemPurchaseQTY] = useState<string | number>('');
  const [newItemUnitPrice, setNewItemUnitPrice] = useState<string | number>('');
  const [disposalPlan, setDisposalPlan] = useState('');

  function handleShowTemplate () {
    setShowTemplate(true);
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

  const handleSetDisposalPlan = (event: ChangeEvent<HTMLInputElement>) =>{
    setDisposalPlan(event.target.value);
    console.log(disposalPlan)
  }

    // Create new Object and add to new Item orders Array, Calculate Subtotal
    function handleAddItem ( ) {
      console.log('handle add item pressed')

      if(newItemName != '' ) {

      }
      const newItem: NewItemOrder = {
        itemName: newItemName,
        itemDescription: newItemDescription,
        productCode: newItemProductCode,
        purchaseQty: Number(newItemPurchaseQTY),
        unitPrice: Number(newItemUnitPrice),
        itemSubtotal: Number(newItemPurchaseQTY) * Number(newItemUnitPrice),
        };
          setNewItemOrders((prevOrders) => [...prevOrders, newItem]);
      }


      // Everytime NewItemOrders is modified re calculate the order total
      useEffect(() => {
        setTimeout(function(){
          let holder: number = 0;
          for (let item of newItemOrders) {
          holder = holder + (item.purchaseQty * item.unitPrice);    
        }
        setOrderTotal(Math.round(holder * 100) / 100);
        }, 200);
      },[newItemOrders]);
    


  const template = (
          <div>
              <div className={classnames.templateTitleDiv}>
                <div className={classnames.templateTitle}>Purchase Item</div>
                <Button onClick={()=>setShowTemplate(false)} classNames={{root: classnames.buttonRemove,}}>Cancel</Button>
              </div>
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
                  onChange={handleNewItemProductCode}
                />
                <div className={classnames.buttonDiv}>
                <Button onClick={handleAddItem} classNames={{root: classnames.addButton,}}>Add</Button>
                </div>
                <NumberInput
                  label="Purchase Quantity"
                  withAsterisk
                  placeholder="Enter Quantity of item..."
                  value={newItemPurchaseQTY}
                  onChange={setNewItemPurchaseQTY}
                  allowDecimal={false}
                />
                <NumberInput
                  label="Unit Price"
                  withAsterisk
                  placeholder="Enter Cost of one item..."
                  value={newItemUnitPrice}
                  onChange={setNewItemUnitPrice}
                  min={0}
                />
                <TextInput
                  label="Disposal Plan"
                  withAsterisk
                  placeholder="Recyclable..."
                  value={disposalPlan}
                  onChange={handleSetDisposalPlan}
                />
                <div>
                  <Text classNames={{root: classnames.orderTotalLabel,}}>Order Total</Text>
                  <Text classNames={{root: classnames.orderTotalText,}}>{'$'+orderTotal}</Text>
                </div>
              </SimpleGrid>
          </div>
    );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const rows = newItemOrders.map((item) => {
      return (
        <Table.Tr key={newItemOrders.indexOf(item)}>
          <Table.Td style={{maxWidth: '150px', overflowX: 'scroll', scrollbarWidth: 'none' }}>{item?.itemName}</Table.Td>
          <Table.Td style={{maxWidth: '150px', overflowX: 'scroll', scrollbarWidth: 'none' }}>{item?.itemDescription}</Table.Td>
          <Table.Td style={{maxWidth: '150px', overflowX: 'scroll', scrollbarWidth: 'none' }}>{item?.productCode}</Table.Td>
          <Table.Td>{'$'+item?.unitPrice} </Table.Td>
          <Table.Td>{'$'+(Math.round(item?.unitPrice * item?.purchaseQty * 100) / 100)}</Table.Td>
          <Table.Td>
            <Button classNames={{root:`${classnames.buttonDecrement} ${classnames.button}`}} onClick={()=>(decrement(newItemOrders.indexOf(item)))} variant="filled" size="xs" radius="md" >-</Button>
            <span style={{ width: '30px', textAlign: 'center', display: 'inline-block' }}>
            {item.purchaseQty}
            </span>
            <Button classNames={{root:`${classnames.buttonIncrement} ${classnames.button}`}} onClick={()=>(increment(newItemOrders.indexOf(item)))} variant="filled" size="xs" radius="md" >+</Button>
          </Table.Td>
          <Table.Td >
            <Button classNames={{root:`${classnames.buttonRemove}`}} onClick={()=>(handleRemoveItem(item))} variant="filled" size="xs" radius="md">Delete</Button>
          </Table.Td>
        </Table.Tr>
      ) 
    });

    // need to redo the math for the subtotal each time.
    function increment (index : number) {
      setNewItemOrders((prevItems) =>
        prevItems.map((item) => newItemOrders.indexOf(item) === index ? 
        { ...item, purchaseQty: item.purchaseQty + 1, itemSubtotal: item.purchaseQty * item.unitPrice } : item));
    }
    // need to redo the math for the subtotal each time.
    function decrement (index : number) {
      setNewItemOrders((prevItems) =>
        prevItems.map((item) => newItemOrders.indexOf(item) === index && item.purchaseQty > 1 ? 
        { ...item, purchaseQty: item.purchaseQty - 1, itemSubtotal: item.purchaseQty * item.unitPrice } : item));
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
                        <Table.Th>Unit Price</Table.Th>
                        <Table.Th>Item Subtotal</Table.Th>
                        <Table.Th>Purchase Quantity</Table.Th>
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
  
  