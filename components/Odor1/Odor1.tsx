'useclient';


import { useEffect, useState } from 'react';
import { Group, Select, Table, Text, Button } from '@mantine/core';
import { Item } from '@/app/_utils/schema';
import classnames from './odor1.module.css';
import { useInventory } from '@/app/_utils/inventory-context';
import { number } from 'zod';
import { ItemOrder } from '@/app/_utils/schema';


// Set the Prop Data type so a useState Set function
interface setpropstype  {
  itemOrders: ItemOrder[];
  setitemOrders: React.Dispatch<React.SetStateAction<ItemOrder[]>>;
}


export default function OdorComponent( {itemOrders, setitemOrders}: setpropstype) {

  console.log('setitemOrders:', setitemOrders);

    // Move the State to Parent Component so the Data can be persisted Between ODOR Pages.
    //const [itemOrders, setitemOrders] = useState<ItemOrder[]>([]);
    const [newItem, setnewItem] = useState<ItemOrder>();
    const [searchValue, setSearchValue] = useState<string | null>('');
    const { inventory, supplierList, setCurrentPage, setCurrentSection } = useInventory();

    //Get item object from inventory and assign it to itemOrders Array
    function handleAddItem () {
      console.log('handle add item pressed')
      console.log(searchValue)
      const matchedItem = inventory?.find((item) => item.itemId === searchValue);
      console.log(matchedItem)
      if (itemOrders.find((item)=>item.itemId === matchedItem?.itemId)) {
              console.log('Item is already in array!')
            }
      else {
          const newItem: ItemOrder = {
          itemId: (matchedItem) ? matchedItem.itemId : "",
          orderQty: 1,
          pendingQty: 1,
          servedQty: 0,
          };
          setitemOrders((prevOrders) => [...prevOrders, newItem]);
          }
    }
  
    // To log the item orders array to the console to see the updated state
    useEffect(() => {
      console.log('Updated itemOrders:', itemOrders);
    }, [itemOrders]);


    function increment (id : string) {
      setitemOrders((prevItems) =>
        prevItems.map((item) => item.itemId === id ? 
        { ...item, orderQty: item.orderQty + 1 } : item));
    }

    function decrement (id : string) {
      setitemOrders((prevItems) =>
        prevItems.map((item) => item.itemId === id && item.orderQty > 1 ? 
        { ...item, orderQty: item.orderQty - 1 } : item));
    }

    function handleRemoveItem (item : ItemOrder) {
      let position = itemOrders.indexOf(item);
      itemOrders.splice(position,1);
      setitemOrders([...itemOrders]);

    }

        const rows = itemOrders.map((item) => {
        const odorItem = inventory?.find((inv)=> inv.itemId === item.itemId)
        const supplier = supplierList?.find((inv)=> inv.supplierId === odorItem?.supplierId)
        return (
          <Table.Tr key={odorItem?.itemId}>
            <Table.Td style={{maxWidth: '100px', overflowX: 'scroll', scrollbarWidth: 'none' }}>{odorItem?.itemId}</Table.Td>
            <Table.Td>{odorItem?.itemName}</Table.Td>
            <Table.Td>{odorItem?.category}</Table.Td>
            <Table.Td>{odorItem?.supplyUnit}</Table.Td>
            <Table.Td>{odorItem?.packageUnit}</Table.Td>
            <Table.Td>{supplier?.supplierName} </Table.Td>
            <Table.Td>
              <Button classNames={{root:`${classnames.buttonDecrement} ${classnames.button}`}} onClick={()=>(decrement(item.itemId))} variant="filled" size="xs" radius="md" >-</Button>
              {item.orderQty}
              <Button classNames={{root:`${classnames.buttonIncrement} ${classnames.button}`}} onClick={()=>(increment(item.itemId))} variant="filled" size="xs" radius="md" >+</Button>
            </Table.Td>
            <Table.Td>
              <Button classNames={{root:`${classnames.buttonRemove}`}} onClick={()=>(handleRemoveItem(item))} variant="filled" size="xs" radius="md">Remove</Button>
            </Table.Td>
          </Table.Tr>
        ) 
      });

    return (
    <div  style={{ border: '1px solid red'}}>
      <Text classNames={{root: classnames.odorText,}}>On Demand Order Requisition</Text>
      <div className={classnames.exteriorDiv}>
          <div className={classnames.interiorDiv}>
              <Text classNames={{root: classnames.rootText,}}>Add Items</Text>

              <div  className={classnames.searchItemDiv}>
                    <Select
                    label="Search Item"
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
                    classNames={{
                    root: classnames.selectRoot,
                    }}
                    size="md"
                    withAsterisk
                    />
                    <Button variant="filled" color="#1B4965" size="md" mt="xl" onClick={handleAddItem}>
                    Add
                    </Button>
              </div> 
              <div>
                  <Table
                  stickyHeader
                  stickyHeaderOffset={60}
 
                  withColumnBorders= {true}
                  striped={true}
                  withTableBorder={true}
                  classNames={{
                  thead: classnames.thead,
                  td: classnames.td,
                  }}
                  >
                
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Item ID</Table.Th>
                      <Table.Th>Item</Table.Th>
                      <Table.Th>Category</Table.Th>
                      <Table.Th>Unit of Measurement</Table.Th>
                      <Table.Th>Package Unit</Table.Th>
                      <Table.Th>Supplier</Table.Th>
                      <Table.Th>QTY</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{rows}</Table.Tbody>
                </Table>
              </div> 
          </div>   
        </div>
    </div>
    );
  }
  
  