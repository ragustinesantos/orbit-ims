import Image from 'next/image';
import { useUserAuth } from '@/app/_utils/auth-context';
import { useInventory } from '@/app/_utils/inventory-context';
import { NAV_ITEMS } from '@/app/_utils/schema';
import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup';
import  UserButton  from '../UserButton/UserButton';
import classes from './NavbarNested.module.css';
import { Menu, Button, Text, rem, Group, ScrollArea } from '@mantine/core';
import {
  IconSettings,
  IconLogout
} from '@tabler/icons-react';
import { useState } from 'react';
import Link from "next/link";

export function NavbarNested() {
  const { firebaseSignOut } = useUserAuth();
  const { currentEmployee } = useInventory();

  const navMenu = () => {
    switch (currentEmployee?.employeeLevel) {
      case 'E1':
        return NAV_ITEMS.E1;
      case 'E2':
        return NAV_ITEMS.E2;
      case 'E3':
        return NAV_ITEMS.E3;
      case 'P1':
        return NAV_ITEMS.P1;
      case 'P2':
        return NAV_ITEMS.P2;
      case 'IA':
        return NAV_ITEMS.IA;
      case 'SA':
        return NAV_ITEMS.SA;
      default:
        return [];
    }
  };

  const links = navMenu().map((item) => <LinksGroup {...item} key={item.label} />);

  const handleLogout = async () => {
    if (firebaseSignOut) {
      await firebaseSignOut();
    }
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group>
          <Image
            src="/assets/logo/orbit_logo.png"
            width={120}
            height={64}
            alt="logo"
            style={{ objectFit: 'cover' }}
          />
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
        <Button style={{ margin: 20 }} onClick={handleLogout}>
          Logout
        </Button>
      </ScrollArea>

      <div className={classes.footer}>
        <Menu shadow="md" width={200}>
        <Menu.Target>
        <UserButton 
        image="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
        name="Harriette Spoonlicker"
        email="hspoonlicker@outlook.com"
        />
        </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Settings</Menu.Label>
            <Link style={{ textDecoration: 'none' }} href="/AccountSettings">
            <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
              Account settings
            </Menu.Item>
            </Link>
            <Menu.Item onClick={handleLogout} leftSection={<IconLogout size={16} stroke={1.5} />}>Logout</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      
    </nav>
  );
}
