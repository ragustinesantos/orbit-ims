"use client";
import { Group, Title, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import classnames from "./DashboardTitle.module.css";
import { useInventory } from "@/app/_utils/inventory-context";
import { Menu, Button, UnstyledButton, Indicator } from "@mantine/core";
import { IconSettings, IconLogout, IconBell} from '@tabler/icons-react';
import { useDisclosure } from "@mantine/hooks";
import Bell from "../NotificationBell/Bell";

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
      <Bell></Bell>
      </div>

         
    </Group>
    
  );
}
