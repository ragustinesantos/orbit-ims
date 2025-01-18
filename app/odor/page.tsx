'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import OdorComponent from '@/components/Odor1/Odor1';
import classnames from './odorpage.module.css';
import { Text } from '@mantine/core';
import { useState } from 'react';
import OdorComponent2 from '@/components/Odor2/Odor2';
import { Button } from '@mantine/core';
import { ItemOrder } from '../_utils/schema';

export default function OdorPage() {

  const [itemOrders, setitemOrders] = useState<ItemOrder[]>([]);

  const [pageNumber,setpageNumber] = useState<number>(0);
  const nav_array = [<OdorComponent itemOrders={itemOrders} setitemOrders={setitemOrders} ></OdorComponent>,<OdorComponent2></OdorComponent2>
  ]

  function nextPage () {
    setpageNumber((prevpageNum)=>prevpageNum+1)
  }

  function previousPage () {
    if (pageNumber > 0) {
      setpageNumber((prevpageNum)=>prevpageNum-1)
    }
  }


  return (
    <main style={{ display: 'flex', width: '100vw' }}>
      <NavbarNested />
      <div>
        {nav_array[pageNumber]}
        <div className={classnames.outerSpacerDiv}>
          <div className={classnames.spacerDiv}></div>
          <div className={classnames.navButtonsDiv}>
            { pageNumber == 0 ? <></> : <Button onClick={previousPage} variant="filled" color="#1B4965" size="md" >Previous</Button>}
            <Button onClick={nextPage} variant="filled" color="#1B4965" size="md" >Next</Button>
          </div>
        </div>
      </div>

      


    </main>
    
  );
}