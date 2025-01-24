'useclient';


import { useEffect, useState } from 'react';
import { Group, Select, Table, Text, Button } from '@mantine/core';
import { Item } from '@/app/_utils/schema';
import classnames from './odor3.module.css';
import { useInventory } from '@/app/_utils/inventory-context';
import { number } from 'zod';
import { ItemOrder, NewItemOrder } from '@/app/_utils/schema';
import CustomNotification from '../CustomNotification/CustomNotification';




interface setpropstype  {
    itemOrders: ItemOrder[];
    newItemOrders: NewItemOrder[];
    orderTotal: Number;
  }



export default function OdorComponent3( {itemOrders, newItemOrders,orderTotal}: setpropstype) {

    const { inventory, supplierList, setCurrentPage, setCurrentSection } = useInventory();

    const itemrows = itemOrders.map((item) => {
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
              <span style={{ width: '30px', textAlign: 'center', display: 'inline-block' }}>{item.orderQty}</span>
            </Table.Td>
          </Table.Tr>
        ) 
      });


    const rows = newItemOrders.map((item) => {
        return (
          <Table.Tr key={newItemOrders.indexOf(item)}>
            <Table.Td style={{maxWidth: '150px', overflowX: 'scroll', scrollbarWidth: 'none' }}>{item?.itemName}</Table.Td>
            <Table.Td style={{maxWidth: '150px', overflowX: 'scroll', scrollbarWidth: 'none' }}>{item?.itemDescription}</Table.Td>
            <Table.Td style={{maxWidth: '150px', overflowX: 'scroll', scrollbarWidth: 'none' }}>{item?.productCode}</Table.Td>
            <Table.Td style={{maxWidth: '150px', overflowX: 'scroll', scrollbarWidth: 'none' }}>{item?.disposalPlan}</Table.Td>
            <Table.Td>{'$'+item?.unitPrice} </Table.Td>
            <Table.Td>{'$'+(Math.round(item?.unitPrice * item?.purchaseQty * 100) / 100)}</Table.Td>
            <Table.Td>
              <span style={{ width: '30px', textAlign: 'center', display: 'inline-block' }}>
              {item.purchaseQty}
              </span>
            </Table.Td>
          </Table.Tr>
        ) 
      });

    return(
        <div>
            <Text classNames={{root: classnames.odorText,}}>On Demand Order Requisition</Text>
            <div className={classnames.templateTitle}>Inventory Items</div>
            <div>{itemOrders.length > 0 && 
                  <Table striped={true}>
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
                </Table>}
              </div>

            <div className={classnames.templateTitle}>Non-Inventory Items</div>
            <div>{newItemOrders.length > 0 && 
                  <Table striped={true}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Item Name</Table.Th>
                        <Table.Th>Item Description</Table.Th>
                        <Table.Th>Product Code</Table.Th>
                        <Table.Th>Disposal Plan</Table.Th>
                        <Table.Th>Unit Price</Table.Th>
                        <Table.Th>Item Subtotal</Table.Th>
                        <Table.Th>Purchase Quantity</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>}
            </div>
            <div>
                <Text classNames={{root: classnames.orderTotalLabel,}}>Order Total</Text>
                <Text classNames={{root: classnames.orderTotalText,}}>{'$'+orderTotal}</Text>
            </div>
        </div>
    )
}