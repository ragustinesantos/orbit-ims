"use client";

import { Table, Title } from "@mantine/core";
import classnames from "./RecentStockInOutTable.module.css";


export default function RecentStockInOutTable() {

    const elements = [
        { stockinoutType:'STOCK IN', stockinoutID: 6, requisitionId: 1, date: '2024-12-16', name: 'Napkin', quantity:'20', unit:'10' },
        { stockinoutType:'STOCK OUT', stockinoutID: 7, requisitionId: 2, date: '2024-12-13', name: 'Apple', quantity:'5', unit:'6' },
      ];

      const rows = elements.map((element) => (
        <Table.Tr key={element.name}>
            <Table.Td>{element.stockinoutType}</Table.Td>
          <Table.Td>{element.stockinoutID}</Table.Td>
          <Table.Td>{element.requisitionId}</Table.Td>
          <Table.Td>{element.date}</Table.Td>
          <Table.Td>{element.name}</Table.Td>
          <Table.Td>{element.quantity}</Table.Td>
          <Table.Td>{element.unit}</Table.Td>
        </Table.Tr>
      ));
   
    return(
      <div style={{ margin:'auto', padding: '20px', borderRadius: '8px', overflowX:'auto', width:'90%'}}>
      <Title order={5} classNames={{ root:classnames.heading }}>
       Recent Stock In/Out
     </Title>

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
           <Table.Th>Stock In/Out</Table.Th>
           <Table.Th>ID</Table.Th>
           <Table.Th>RequisitionID</Table.Th>
           <Table.Th>Date</Table.Th>
           <Table.Th>Item Name</Table.Th>
           <Table.Th>Quantity</Table.Th>
           <Table.Th>Unit</Table.Th>
         </Table.Tr> 
       </Table.Thead>
       <Table.Tbody>{rows}</Table.Tbody>
     </Table>

   </div>
    );
}