"use client";

import {Card, Grid, Text, Title } from "@mantine/core";
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

 
    <div style={{  margin:'20px', padding: '20px', backgroundColor: '#f5f7fa', borderRadius: '8px', justifyItems:'center'}}>

      <Title order={5} classNames={{ root:classnames.heading }}>
        Inventory Overview
      </Title>

      <Grid type="container" justify="center" align="center" >
        
        <Grid.Col span={6} >
          <Card shadow="sm" radius="md" withBorder h={100} w={300}  classNames={{ root:classnames.cardContainer }}>
              <Text size="md" classNames={{ root:classnames.cardText }}>
                Total Item
              </Text>
              <Text size="xl" c="gray" classNames={{ root:classnames.cardNumber }}>
                {totalItem}
              </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={6} >
          <Card shadow="sm" radius="md" withBorder h={100} w={300} classNames={{ root:classnames.cardContainer }}>

              <Text size="md" classNames={{ root:classnames.cardText }} onClick={open}>
                Low Stock
              </Text>
              <LowStockModal opened = {opened} close={close}/>

              <Text size="xl"  c="gray" classNames={{ root:classnames.cardNumber }}>
                {lowStock}
              </Text>

          </Card>
        </Grid.Col>

      </Grid>
      </div>

    


  );
};