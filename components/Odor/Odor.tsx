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

    const [itemOrders, setitemOrders] = useState<ItemOrder[]>([]);
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
            setitemOrders(prevOrders => [...prevOrders, newItem]);
            }

      }
        
    

    // To log the item orders array to the console to see the updated state
    useEffect(() => {
        console.log('Updated itemOrders:', itemOrders);
      }, [itemOrders]);






      const rows = itemOrders.map((item) => {

        const odorItem = inventory?.find((inv)=> inv.itemId === item.itemId)
        const supplier = supplierList?.find((inv)=> inv.supplierId === odorItem?.supplierId)

        return (
          <Table.Tr key={odorItem?.itemId}>
            <Table.Td style={{ maxWidth: '30px', overflowX: 'scroll', scrollbarWidth: 'none' }}>{odorItem?.itemId}</Table.Td>
            <Table.Td>{odorItem?.itemName}</Table.Td>
            <Table.Td>{odorItem?.category}</Table.Td>
            <Table.Td>{odorItem?.supplyUnit}</Table.Td>
            <Table.Td>{odorItem?.packageUnit}</Table.Td>
            <Table.Td>{supplier?.supplierName} </Table.Td>
            <Table.Td>{item.orderQty} </Table.Td>
          </Table.Tr>
        ) 
      });

    return (
    <div  style={{ border: '1px solid red'}}>
      <Text classNames={{root: classnames.odorText,}}>On Demand Order Requisition</Text>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '83vw',
          height:'85vh',
          minWidth: '50vw',
          //height: '100vh',
          border: '1px solid blue',
        }}>
          <div style={{
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid blue',
        }}>
              <Text classNames={{root: classnames.rootText,}}>Add Items</Text>

              <div  style={{ display:'flex', border: '1px solid red', width: '50vw', justifyContent: 'space-evenly'}}>
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
  
  