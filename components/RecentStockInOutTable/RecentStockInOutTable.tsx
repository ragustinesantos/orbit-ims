"use client";

import { Table, Title, Text } from "@mantine/core";
import classnames from "./RecentStockInOutTable.module.css";
import { useEffect, useState } from "react";
import { fetchStockInOrders, fetchStockOutOrders } from "@/app/_utils/utility";
import { useInventory } from "@/app/_utils/inventory-context";


export default function RecentStockInOutTable() {

    const [stockInOrders,setStockInOrders] = useState([]);
    const [stockOutOrders,setStockOutOrders] = useState([]);
    const { inventory } =useInventory();

    const [showAllStockIn, setShowAllStockIn] = useState(false);
    const [showAllStockOut, setShowAllStockOut] = useState(false);

    useEffect(() => {
      fetchStockInOrders(setStockInOrders);
      fetchStockOutOrders(setStockOutOrders);
    }, []);


    const getItemDetails = (itemId: string) => {
      const foundItem = inventory?.find((item) => item.itemId === itemId);
      return {
        name: foundItem?.itemName || "Unknown Item",
        unit: foundItem?.supplyUnit || "N/A",
      };
    };
    
   // Map Stock In Data
   const stockInRows = (showAllStockIn ? stockInOrders : stockInOrders.slice(0, 3)).map((stockInOrder)  => {
    const {name, unit} = getItemDetails(stockInOrder.itemId);
    return (
    <Table.Tr key={stockInOrder.stockInId}>
      <Table.Td>{stockInOrder.stockInId}</Table.Td>
      <Table.Td>{stockInOrder.stockInDate}</Table.Td>
      <Table.Td>{name}</Table.Td>
      <Table.Td>{stockInOrder.stockInQuantity}</Table.Td>
      <Table.Td>{unit}</Table.Td>
    </Table.Tr>
  )
});

  // Map Stock Out Data
  const stockOutRows = (showAllStockOut ? stockOutOrders : stockOutOrders.slice(0, 3)).map((stockOutOrder)  => {
    const{name,unit} = getItemDetails(stockOutOrder.itemId);
    return(
    <Table.Tr key={stockOutOrder.stockOutId}>
      <Table.Td>{stockOutOrder.stockOutId}</Table.Td>
      <Table.Td>{stockOutOrder.stockOutDate}</Table.Td>
      <Table.Td>{name}</Table.Td>
      <Table.Td>{stockOutOrder.stockOutQuantity}</Table.Td>
      <Table.Td>{unit}</Table.Td>
    </Table.Tr>
  )});
   
    return(
      <div style={{ margin:'auto', padding: '20px', borderRadius: '8px', overflowX:'auto', width:'90%'}}>
      <Title order={5} classNames={{ root:classnames.heading }}>
       Recent Stock In/Out
     </Title>

      {/*stock in table */}
      <Table
       stickyHeader
       stickyHeaderOffset={50}
       horizontalSpacing="xl"
       verticalSpacing="lg"
       style={{ width: '100%'}}
       classNames={{
         thead: classnames.thead,
         td: classnames.td,
       }}
     >
     
       <Table.Thead>
         <Table.Tr>
           <Table.Th>Stock In ID</Table.Th>
           <Table.Th>Date</Table.Th>
           <Table.Th>Item Name</Table.Th>
           <Table.Th>Quantity</Table.Th>
           <Table.Th>Unit</Table.Th>
         </Table.Tr> 
       </Table.Thead>
       <Table.Tbody>{stockInRows}</Table.Tbody>
     </Table>

     <Text
        size="xs"
        style={{ textAlign:'center', cursor: "pointer", color: "#1B4965", textDecoration: "underline", marginBottom: "25px" }}
        onClick={() => setShowAllStockIn(!showAllStockIn)}
      >
        {showAllStockIn ? "Show Less" : "View All"}
      </Text>

     {/*stock out table */}
     <Table
       stickyHeader
       stickyHeaderOffset={50}
       horizontalSpacing="xl"
       verticalSpacing="lg"
       style={{ width: '100%' }}
       classNames={{
         thead: classnames.thead,
         td: classnames.td,
       }}
     >
     
       <Table.Thead>
         <Table.Tr>
           <Table.Th>Stock Out ID</Table.Th>
           <Table.Th>Date</Table.Th>
           <Table.Th>Item Name</Table.Th>
           <Table.Th>Quantity</Table.Th>
           <Table.Th>Unit</Table.Th>
         </Table.Tr> 
       </Table.Thead>
       <Table.Tbody>{stockOutRows}</Table.Tbody>
     </Table>

     <Text
        size="xs"
        style={{ textAlign:'center', cursor: "pointer", color: "#1B4965", textDecoration: "underline", marginBottom: "25px" }}
        onClick={() => setShowAllStockOut(!showAllStockOut)}
      >
        {showAllStockOut ? "Show Less" : "View All"}
      </Text>

   </div>
    );
}