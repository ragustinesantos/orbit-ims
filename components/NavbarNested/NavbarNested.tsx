import Image from 'next/image';
import Link from 'next/link';
import { IconLogout, IconSettings } from '@tabler/icons-react';
import { Group, Menu, ScrollArea } from '@mantine/core';
import { useUserAuth } from '@/app/_utils/auth-context';
import { useInventory } from '@/app/_utils/inventory-context';
import { NAV_ITEMS, NavFormat } from '@/app/_utils/schema';
import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup';
import UserButton from '../UserButton/UserButton';
import classes from './NavbarNested.module.css';

export function NavbarNested() {
  const { firebaseSignOut } = useUserAuth();
  const { currentEmployee } = useInventory();

  const navMenu = () => {
    // Remove default E1 inventory nav before adding manage inventory
    const manageInventoryNavigation = (navItems: NavFormat[]) => {
      // Check if it already has manage inventory added from other roles
      if (!navItems.some((e) => e.label === 'Manage Inventory')) {
        // Manage employees would change the index of Assistant and in turn change the inventory index
        if (!navItems.some((e) => e.label === 'Manage Employees')) {
          navItems.splice(4, 1);
        } else {
          navItems.splice(3, 1);
        }
        navItems = navItems.concat(NAV_ITEMS.MI);
      }
      return navItems;
    };

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
            navItems = manageInventoryNavigation(navItems);
            break;
          case 'P2':
            navItems = navItems.concat(NAV_ITEMS.P2);
            navItems = manageInventoryNavigation(navItems);
            break;
          case 'IA':
          case 'SA':
            // Check if manage employee has been added by another role (IA/SA)
            if (!navItems.some((e) => e.label === 'Manage Employees')) {
              // Assistant nav would be replaced with more access
              navItems.splice(1, 1);
              navItems = navItems.concat(NAV_ITEMS.IA_SA);
            }
            navItems = manageInventoryNavigation(navItems);
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
      window.location.replace('/');
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
              name={
                currentEmployee ? `${currentEmployee.firstName} ${currentEmployee.lastName}` : ''
              }
              email={currentEmployee ? currentEmployee.email : ''}
            />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Settings</Menu.Label>
            <Link style={{ textDecoration: 'none' }} href="/AccountSettings">
              <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
                Account settings
              </Menu.Item>
            </Link>
            <Menu.Item onClick={handleLogout} leftSection={<IconLogout size={16} stroke={1.5} />}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </nav>
  );
}
