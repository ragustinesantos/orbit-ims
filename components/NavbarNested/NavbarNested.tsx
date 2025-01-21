import Image from 'next/image';
import { useUserAuth } from '@/app/_utils/auth-context';
import { useInventory } from '@/app/_utils/inventory-context';
import { NAV_ITEMS, NavFormat } from '@/app/_utils/schema';
import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup';
import UserButton from '../UserButton/UserButton';
import classes from './NavbarNested.module.css';
import { Menu, Group, ScrollArea } from '@mantine/core';
import {
  IconSettings,
  IconLogout
} from '@tabler/icons-react';
import Link from "next/link";

export function NavbarNested() {
  const { firebaseSignOut } = useUserAuth();
  const { currentEmployee } = useInventory();

  const navMenu = () => {

    let navItems: NavFormat[] = [];

    if (currentEmployee?.employeeLevel) {
      for (let i = 0; i < currentEmployee.employeeLevel.length; i++) {
        switch (currentEmployee.employeeLevel[i]) {
          case 'E1':
            navItems = navItems.concat(NAV_ITEMS.E1);
            break;
          case 'E2':
            navItems = navItems.concat(NAV_ITEMS.E2);
            break;
          case 'E3':
            navItems = navItems.concat(NAV_ITEMS.E3);
            break;
          case 'P1':
            navItems = navItems.concat(NAV_ITEMS.P1);
            if (!navItems.some(e => e.label === 'Manage Inventory')) {
              navItems = navItems.concat(NAV_ITEMS.MI);
            }
            break;
          case 'P2':
            navItems = navItems.concat(NAV_ITEMS.P2);
            if (!navItems.some(e => e.label === 'Manage Inventory')) {
              navItems = navItems.concat(NAV_ITEMS.MI);
            }
            break;
          case 'IA':
          case 'SA':
            if (!navItems.some(e => e.label === 'Manage Employees')) {
              navItems.splice(1, 1);
              navItems = navItems.concat(NAV_ITEMS.IA_SA);
            }
            if (!navItems.some(e => e.label === 'Manage Inventory')) {
              navItems = navItems.concat(NAV_ITEMS.MI);
            }
            break;
        }
      }
    }

    return navItems;
  };

  const links = navMenu().map((item) => <LinksGroup {...item} key={item.label} />);

  const handleLogout = async () => {
    if (firebaseSignOut) {
      await firebaseSignOut();
      window.location.replace("/")
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
      </ScrollArea>

      <div className={classes.footer}>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <UserButton
              image="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
              name={(currentEmployee) ? currentEmployee.firstName + ' ' + currentEmployee.lastName : ""}
              email={(currentEmployee) ? currentEmployee.email : ""}
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
