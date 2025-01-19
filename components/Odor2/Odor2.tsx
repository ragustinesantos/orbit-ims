'useclient';


import { useEffect, useState } from 'react';
import { Group, Select, Table, Text, Button } from '@mantine/core';
import { Item } from '@/app/_utils/schema';
import classnames from './odor2.module.css';
import { useInventory } from '@/app/_utils/inventory-context';
import { number } from 'zod';
import { ItemOrder } from '@/app/_utils/schema';
import { NewItemOrder } from '@/app/_utils/schema';

interface setpropstype  {
  newItemOrders: NewItemOrder[];
  setNewItemOrders: React.Dispatch<React.SetStateAction<NewItemOrder[]>>;
}

export default function OdorComponent2({newItemOrders,setNewItemOrders}: setpropstype) {

  const [showTemplate, setshowTemplate] = useState<boolean>(false)


  function handleShowTemplate () {
    setshowTemplate(true);
  }


  const template = (

          <div>well hello there!</div>



    );







    return (
    <div  style={{ border: '1px solid red'}}>
      <Text classNames={{root: classnames.odorText,}}>On Demand Order Requisition</Text>
      <div className={classnames.exteriorDiv}>
          <div className={classnames.interiorDiv}>
              <Text classNames={{root: classnames.rootText,}}>Order Non Inventory Item</Text>
              <Text>Would you like to order a item that is not in the Inventory?</Text>
          </div>
          {showTemplate ? template : <Button onClick={handleShowTemplate} >Yes</Button>} 
      </div>   
    </div>

    );
  }
  
  