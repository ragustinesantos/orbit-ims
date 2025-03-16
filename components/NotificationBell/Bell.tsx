"use client";
import { Group, Title, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import classnames from "./Bell.module.css";
import { useInventory } from "@/app/_utils/inventory-context";
import { Menu, Button, UnstyledButton, Indicator } from "@mantine/core";
import { IconSettings, IconLogout, IconBell} from '@tabler/icons-react';
import { useDisclosure } from "@mantine/hooks";
import { fetchOrderRequisitions } from "@/app/_utils/utility";
import { OrderRequisition } from "@/app/_utils/schema";



export default function Bell() {
    const [allOrs, setAllOrs] = useState<OrderRequisition[] | null>(null);
    const [visible, { toggle }] = useDisclosure();
    const { currentEmployee } = useInventory();

        useEffect(() => {
          const retrieveRequisition = async () => {
            try {
              await fetchOrderRequisitions(setAllOrs);
            } catch (error) {
              console.log(error);
            }
          };
          retrieveRequisition();
          console.log(allOrs);
        }, []);


    //const sortedOrs = allOrs?.sort((a,b) => {return new Date(a.requisitionDate) - Number(b.requisitionDate)})
    const sortedOrs = allOrs?.sort((a, b) => {
        const dateA = new Date(a.requisitionDate);
        const dateB = new Date(b.requisitionDate);
      
        const isValidDateA = !isNaN(dateA.getTime());
        const isValidDateB = !isNaN(dateB.getTime());
      
        // Both dates invalid
        if (!isValidDateA && !isValidDateB) return 0; 
      
        // Only 'a' date invalid
        if (!isValidDateA) return 1; 
      
        // Only 'b' date invalid
        if (!isValidDateB) return -1; 
      
        // Activity check
        if (a.isActive !== b.isActive) {
          return a.isActive ? -1 : 1;
        }
      
        // Sort by date, most recent first
        return dateB.getTime() - dateA.getTime();
      });




    function togglevis () {
        toggle();
      }

    return (
        <>
            <Title className={classnames.Notifications}>
            <Menu position="bottom-end" shadow="md">
              <Menu.Target>
                  <Indicator  inline disabled={!visible} color="red" size={12}>
                  <IconBell onClick={toggle} size={30} stroke={1.5}/>
                  </Indicator>
                  
              </Menu.Target>
              <Menu.Dropdown>
              <Menu.Label>Notifications</Menu.Label>
              <Menu.Item>
                  <Text>Requisition ID# {sortedOrs![0].requisitionId} has been created and is waiting approval!</Text>
                </Menu.Item>
                <Menu.Item>
                  <Text>Requisition ID# {sortedOrs![1].requisitionId} has been created and is waiting approval!</Text>
                </Menu.Item>
                <Menu.Item>
                  <Text>Requisition ID# {sortedOrs![2].requisitionId} has been created and is waiting approval!</Text>
                </Menu.Item>
                <Menu.Item>
                  <Text>Requisition ID# {sortedOrs![3].requisitionId} has been created and is waiting approval!</Text>
                </Menu.Item>
                <Menu.Item>
                  <Text>Requisition ID# {sortedOrs![4].requisitionId} has been created and is waiting approval!</Text>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Title>
          <Button style={{marginLeft: "15px"}} onClick={togglevis}></Button>
        </>
    )
}


