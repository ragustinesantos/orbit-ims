'useclient';


import { useEffect, useState } from 'react';
import { Group, Select, Table, Text, Button } from '@mantine/core';
import { Item } from '@/app/_utils/schema';
import classnames from './odor2.module.css';
import { useInventory } from '@/app/_utils/inventory-context';
import { number } from 'zod';
import { ItemOrder } from '@/app/_utils/schema';



export default function OdorComponent2() {


    return (
    <div  style={{ border: '1px solid red'}}>
      <Text classNames={{root: classnames.odorText,}}>On Demand Order Requisition</Text>
      <div className={classnames.exteriorDiv}>
          <div className={classnames.interiorDiv}>
              <Text classNames={{root: classnames.rootText,}}>Order Non Inventory Item</Text>

              </div> 
              <div>

              </div> 
          </div>   
        </div>

    );
  }
  
  