import {Card, Grid, Table, Text, Title } from "@mantine/core";
import classnames from "./InventoryOverview.module.css";
import { useEffect, useState } from "react";
import { useInventory } from "@/app/_utils/inventory-context";


export default function InventoryOverview(){

    //retrieve total stock from database
    const [totalItem, setTotalItem] = useState<number>(0);
    const [lowStock, setLowStock] = useState <number>(0);

    const {inventory, setCurrentSection} = useInventory();

    //total item 
    useEffect(() => {
        const itemSum = inventory?.length || 0; // using temporary variable to store the total item count
        setTotalItem(itemSum); // update totalStock
      }, [inventory]); //when inventory change, recalculate totalStock


    useEffect(() => {
        let lowStockSum = 0;
        for (const item of inventory || []) {
            if (item.currentStockInStoreRoom < item.isCriticalThreshold) {
              lowStockSum++;
            }
          }     
        setLowStock(lowStockSum); // update low stock number
      }, [inventory]);


    useEffect(() => {
        setCurrentSection('Dashboard');
    }, []);
    

    return(

    <div style={{  margin:'10px', padding: '20px', backgroundColor: '#f5f7fa', borderRadius: '8px' }}>

      <Title order={5} classNames={{ root:classnames.heading }}>
        Inventory Overview
      </Title>

      <Grid type="container" justify="center" align="center" >
        
        <Grid.Col span={6} >
          <Card shadow="sm" radius="md" withBorder h={100} w={300}  classNames={{ root:classnames.cardContainer }}>
              <Text size="md" classNames={{ root:classnames.cardText }}>
                Total Item
              </Text>
              <Text size="xl" c="gray" classNames={{ root:classnames.cardText }}>
                {totalItem}
              </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={6} >
          <Card shadow="sm" radius="md" withBorder h={100} w={300} classNames={{ root:classnames.cardContainer }}>

              <Text size="md" classNames={{ root:classnames.cardText }}>
                Low Stock
              </Text>
              <Text size="xl"  c="gray" classNames={{ root:classnames.cardText }}>
                {lowStock}
              </Text>

          </Card>
        </Grid.Col>

      </Grid>


       {/** recent stock in/ stock out table*/}    

       <Title order={5} classNames={{ root:classnames.heading }}>
        Recent Stock In/Out
      </Title>

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
            <Table.Th>ID</Table.Th>
            <Table.Th>RequisitionID</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Item Name</Table.Th>
            <Table.Th>Quantity</Table.Th>
            <Table.Th>Unit</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>  </Table.Tbody>
      </Table>

    </div>

  );
};