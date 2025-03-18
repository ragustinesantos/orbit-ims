"use client";
import { Group, Title, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import classnames from "./DashboardTitle.module.css";
import { useInventory } from "@/app/_utils/inventory-context";

export default function DashboardTitle() {
  const { currentEmployee } = useInventory();
  

  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!currentTime) {
    return null;
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedDate = `${months[currentTime.getMonth()]} ${currentTime.getDate()}, ${currentTime.getFullYear()}`;
  const formattedTime = currentTime.toLocaleTimeString("en-US", { hour12: true }); 

  return (
    <Group className={classnames.container}>
      <div className={classnames.textWrapper}>
        <Title order={2} className={classnames.heading}>
          Hello, <span className={classnames.name}>{currentEmployee?.firstName} {currentEmployee?.lastName}</span>!
        </Title>
        <Text className={classnames.subText}>Welcome back! Here's what's happening today.</Text>
      </div>
      <Title order={5} className={classnames.date}>
        {formattedDate} | {formattedTime}
      </Title>
    </Group>
  );
}
