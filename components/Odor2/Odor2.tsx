'useclient';


import { ChangeEvent,useEffect, useState } from 'react';
import { Group, Select, Table, Text, Button , SimpleGrid, TextInput} from '@mantine/core';
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

  // Move to Parent Component
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  function handleShowTemplate () {
    setshowTemplate(true);
  }


  const handleNewItemNameChange = (event: ChangeEvent<HTMLInputElement>) =>
      setNewItemName(event.target.value);
  const handleNewItemDescriptionChange = (event: ChangeEvent<HTMLInputElement>) =>
    setNewItemDescription(event.target.value);


  const template = (
          <div>
          <div>Purchase Item</div>
<SimpleGrid cols={1} spacing="xl" verticalSpacing="xs">
          <TextInput
            label="Item Name"
            withAsterisk
            placeholder="Enter Item Name..."
            value={newItemName}
            onChange={handleNewItemNameChange}
          />
          {/*<TextInput label="Item ID" disabled />*/}
          <TextInput
            label="Item Description or Source Link"
            withAsterisk
            placeholder="Description or URL"
            value={newItemDescription}
            onChange={handleNewItemDescriptionChange}
          />
          </SimpleGrid>
            </div>


    );







    return (
    <div  style={{ border: '1px solid red'}}>
      <Text classNames={{root: classnames.odorText,}}>On Demand Order Requisition</Text>
      <div className={classnames.exteriorDiv}>
          {showTemplate ? template : 
            <div className={classnames.interiorDiv}>
              <Text classNames={{root: classnames.rootText,}}>Order Non Inventory Item</Text>
              <Text>Would you like to order a item that is not in the Inventory?</Text>
              <div>
                <Button onClick={handleShowTemplate} >Yes</Button>
              <Button onClick={handleShowTemplate} >No</Button> 
              </div>   
            </div>} 
          
           
      </div>  
    </div>

    );
  }
  
  