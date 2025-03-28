'use client';

import { useEffect, useState } from 'react';
import { Group, Text, Title } from '@mantine/core';
import { useInventory } from '@/app/_utils/inventory-context';
import Bell from '../NotificationBell/Bell';
import classnames from './DashboardTitle.module.css';

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

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const formattedDate = `${months[currentTime.getMonth()]} ${currentTime.getDate()}, ${currentTime.getFullYear()}`;
  const formattedTime = currentTime.toLocaleTimeString('en-US', { hour12: true });

  return (
    <Group className={classnames.container}>
      <div className={classnames.textWrapper}>
        <Title order={2} className={classnames.heading}>
          Hello,{' '}
          <span className={classnames.name}>
            {currentEmployee?.firstName} {currentEmployee?.lastName}
          </span>
          !
        </Title>
        <Text className={classnames.subText}>Welcome back! Here's what's happening today.</Text>
      </div>
      <div className={classnames.endofbar}>
        <Title order={5} className={classnames.date}>
          {formattedDate} | {formattedTime}
        </Title>
        <div className={classnames.bellspace}>
          <Bell />
        </div>
      </div>
    </Group>
  );
}
