"use client";
import { Group, Title, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import classnames from "./DashboardTitle.module.css";
import { useInventory } from "@/app/_utils/inventory-context";
import { Menu, Button, UnstyledButton, Indicator } from "@mantine/core";
import { IconSettings, IconLogout, IconBell} from '@tabler/icons-react';
import { useDisclosure } from "@mantine/hooks";

export default function DashboardTitle() {
  const { currentEmployee } = useInventory();

  const [visible, { toggle }] = useDisclosure();
  const [currentTime, setCurrentTime] = useState(new Date());
  

 
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date()); 
    }, 1000);

    return () => clearInterval(timer); 
  }, []);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedDate = `${months[currentTime.getMonth()]} ${currentTime.getDate()}, ${currentTime.getFullYear()}`;
  const formattedTime = currentTime.toLocaleTimeString("en-US", { hour12: true }); 

  const req1 = "fjesuifhjui327"
  const req2 = "fuihseuo32f2fnb"
  const req3 = "hf7439qfh347784"

  function togglevis () {
    toggle();
  }

  return (
    <Group className={classnames.container}>
      <div className={classnames.textWrapper}>
        <Title order={2} className={classnames.heading}>
          Hello, <span className={classnames.name}>{currentEmployee?.firstName} {currentEmployee?.lastName}</span>!
        </Title>
        <Text className={classnames.subText}>Welcome back! Here’s what’s happening today.</Text>
      </div>

      <div className={classnames.endbar}>
      <Title order={5} className={classnames.date}>
        {formattedDate} | {formattedTime}  
      </Title>

      {currentEmployee?.employeeLevel.includes("P1") ?
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
                  Requisition ID# {req1} has been Approved!
            </Menu.Item>
            <Menu.Item>
                  Requisition ID# {req2} has been Approved!
            </Menu.Item>
            <Menu.Item>
                  Requisition ID# {req3} has been Approved!
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Title> : <></>}
      <Button style={{marginLeft: "15px"}} onClick={togglevis}></Button>
      </div>
      
         
    </Group>
    
  );
}
