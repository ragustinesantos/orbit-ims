import {Card, Grid, Text, Title } from "@mantine/core";
import classnames from "./InventoryOverview.module.css";
import { useEffect, useState } from "react";
import { useInventory } from "@/app/_utils/inventory-context";


export default function InventoryOverview(){

    //retrieve total stock from database
    const [totalItem, setTotalItem] = useState<number>(0);
    const [lowStock, setLowStock] = useState <number>(0);

    const {inventory, setCurrentPage, setCurrentSection} = useInventory();

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

    return(

    <div style={{padding:10}}>

      <Title order={3} classNames={{ root:classnames.heading }}>
        Inventory Overview
      </Title>

      <Grid justify="center" align="center">
        
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

    </div>

  );
};