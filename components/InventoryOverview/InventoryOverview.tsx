"use client";

import {Card, Grid, Group, SimpleGrid, Text, Title } from "@mantine/core";
import classnames from "./InventoryOverview.module.css";
import { useEffect, useState } from "react";
import { useInventory } from "@/app/_utils/inventory-context";
import LowStockModal from "../LowStockModal/LowStockModal";
import { useDisclosure } from "@mantine/hooks";


export default function InventoryOverview(){

    //retrieve total stock from database
    const [totalItem, setTotalItem] = useState<number>(0);
    const [lowStock, setLowStock] = useState <number>(0);

    const {inventory, setCurrentSection} = useInventory();
    const[opened,{open,close}] = useDisclosure(false);


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

 
    <Group classNames={{root:classnames.container}} >

      <Title order={3} classNames={{ root:classnames.heading }}>
        Inventory Overview
      </Title>

      <SimpleGrid  cols={{ base: 1, sm: 1, lg: 2 }}
      spacing={{ base: 10, sm: 'xl' }}
      verticalSpacing={{ base: 'md', sm: 'xl' }}
      classNames={{ root: classnames.grid }}>
        
        <div>
          <Card shadow="lg" radius="lg" withBorder classNames={{ root:classnames.cardContainer }}>
              <Text size="md" classNames={{ root:classnames.cardText }}>
                Total Item
              </Text>
              <Text size="xl" c="blue" fw={700} classNames={{ root:classnames.cardNumber }}>
                {totalItem}
              </Text>
          </Card>
        </div>

        <div>
          <Card shadow="lg" radius="lg" withBorder classNames={{ root:classnames.cardContainer }}>

              <Text size="md" classNames={{ root:classnames.cardText }} onClick={open}>
                Low Stock
              </Text>
              <LowStockModal opened = {opened} close={close}/>

              <Text size="xl" c="blue" fw={700}  classNames={{ root:classnames.cardNumber }}>
                {lowStock}
              </Text>

          </Card>
        </div>

      </SimpleGrid>
      </Group>

    


  );
};