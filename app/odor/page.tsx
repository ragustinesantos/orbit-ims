'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import OdorComponent from '@/components/Odor1/Odor1';
import OdorComponent2 from '@/components/Odor2/Odor2';
import OdorComponent3 from '@/components/Odor3/Odor3';
import classnames from './odorpage.module.css';
import { Text, Group } from '@mantine/core';
import { useState } from 'react';

import { Button } from '@mantine/core';
import { ItemOrder, NewItemOrder } from '../_utils/schema';

export default function OdorPage() {

  const [itemOrders, setitemOrders] = useState<ItemOrder[]>([]);
  const [newItemOrders, setNewItemOrders] = useState<NewItemOrder[]>([]);
  const [totalCost, setTotalCost] = useState<Number>(0);
  const [showTemplate, setShowTemplate] = useState<boolean>(false)

  const [pageNumber,setpageNumber] = useState<number>(0);
  const nav_array = [<OdorComponent itemOrders={itemOrders} setitemOrders={setitemOrders}>
                     </OdorComponent>,
                     <OdorComponent2 totalCost={totalCost} setTotalCost={setTotalCost} 
                     newItemOrders={newItemOrders} setNewItemOrders={setNewItemOrders} setShowTemplate={setShowTemplate} showTemplate={showTemplate}>
                     </OdorComponent2>,
                     <OdorComponent3 itemOrders={itemOrders} newItemOrders={newItemOrders} totalCost={totalCost}>
                     </OdorComponent3>
                    ]

  function nextPage () {
    if (pageNumber < 2) {
    setpageNumber((prevpageNum)=>prevpageNum+1)
    }
  }

  function previousPage () {
    if (pageNumber > 0) {
      setpageNumber((prevpageNum)=>prevpageNum-1)
    }
  }


  return (
    <main style={{ display: 'flex', width: '100vw', }}>
      <NavbarNested />
      <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        padding: 32,
      }}
      >
          {nav_array[pageNumber]}
          <Group justify="flex-end">
            { pageNumber == 0 ? <></> : 
            <Button classNames={{root: classnames.navbutton,}} onClick={previousPage} 
            variant="filled" color="#1B4965" size="md" radius="md" 
            >Previous</Button>}
            { pageNumber == 2 ? <></> : 
            <Button classNames={{root: classnames.navbutton,}} onClick={nextPage} 
            variant="filled" color="#1B4965" size="md" radius="md"
            >Next</Button>}
            { pageNumber == 2 ?  
            <Button classNames={{root: classnames.navbutton,}} onClick={nextPage} 
            variant="filled" color="#1B4965" size="md" radius="md"
            >Submit</Button> : <></> }
          </Group>
          </div>

    </main>
    
  );
}