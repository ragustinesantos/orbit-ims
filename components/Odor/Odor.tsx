'useclient';


import { useEffect, useState } from 'react';
import { Group, Select, Table, Text, Button } from '@mantine/core';
import { Item } from '@/app/_utils/schema';
import classnames from './odor.module.css';
import { useInventory } from '@/app/_utils/inventory-context';
import { number } from 'zod';
import { ItemOrder } from '@/app/_utils/schema';

export interface ItemOrder1 {
    itemId: string;
    itemName: string;
    orderQty: number;
    pendingQty: number;
    servedQty: number;
  }


export default function OdorComponent() {

    const [itemOrders, setitemOrders] = useState<ItemOrder1[]>([]);
    const [newItem, setnewItem] = useState<ItemOrder1>();
    const [searchValue, setSearchValue] = useState<string | null>('');
    const { inventory, setCurrentPage, setCurrentSection } =
      useInventory();


      //Get item object from inventory and assign it to itemOrders Array
      function handleAddItem () {
        console.log('handle add item pressed')
        console.log(searchValue)
        const matchedItem = inventory.find((item) => item.itemId === searchValue);
        console.log(matchedItem)
        if (matchedItem == itemOrders.find((item)=>item.itemId === matchedItem?.itemId)) {
                console.log('Item is already in array!')
                }
        else {
          const newItem: ItemOrder1 = {
            itemId: matchedItem.itemId,
            itemName: matchedItem.itemName,
            orderQty: 1,
            pendingQty: 1,
            servedQty: 0,
            };
            setitemOrders(prevOrders => [...prevOrders, newItem]);
            }

              }
        
    

    // To log the item orders array to the console to see the updated state
    useEffect(() => {
        console.log('Updated itemOrders:', itemOrders);
      }, [itemOrders]);






      const rows = itemOrders.map((item) => {
        return (
          <Table.Tr key={item.itemId}>
            <Table.Td style={{ maxWidth: '30px', overflowX: 'scroll', scrollbarWidth: 'none' }}>
              {item.itemId}
            </Table.Td>
            <Table.Td>{item.itemName}</Table.Td>
            <Table.Td>{item.orderQty}</Table.Td>
          </Table.Tr>
        ) 
      });

    return (
    <div  style={{ border: '1px solid red'}}>

        <Text classNames={{root: classnames.rootText,}}>Add Items</Text>
        <div  style={{ display:'flex', border: '1px solid red', width: '50vw', justifyContent: 'space-evenly'}}>
            <Select
            label="Search Item"
            placeholder="Select an item from the list..."
            data={inventory.map((item) => ({
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
        horizontalSpacing="xl"
        verticalSpacing="lg"
        classNames={{
          thead: classnames.thead,
          td: classnames.td,
        }}
      >
        
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Item ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>QTY</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
              
              </div>    
    </div>
    );
  }
  
  