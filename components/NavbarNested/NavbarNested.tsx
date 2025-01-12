import Image from 'next/image';
import { IconGauge, IconMessage, IconNotes, IconUsers } from '@tabler/icons-react';
import { Button, Group, ScrollArea } from '@mantine/core';
import { useUserAuth } from '@/app/_utils/auth-context';
import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup';
import { UserButton } from '../UserButton/UserButton';
import classes from './NavbarNested.module.css';

export function NavbarNested() {
  const { firebaseSignOut } = useUserAuth();

  const navMenu = [
    { label: 'Dashboard', icon: IconGauge },
    {
      label: 'Assistant',
      icon: IconMessage,
      links: [
        { label: 'Chat', link: '/assistant/chat' },
        { label: 'Generate Report', link: '/' },
      ],
    },
    {
      label: 'Manage Inventory',
      icon: IconNotes,
      links: [
        { label: 'Search Item', link: '/inventory/search-item' },
        { label: 'Add Item', link: '/inventory/add-item' },
        { label: 'Update Item', link: '/inventory/update-item' },
        { label: 'Delete Item', link: '/inventory/delete-item' },
      ],
    },
    {
      label: 'Manage Employees',
      icon: IconUsers,
      links: [
        { label: 'Search Employee', link: '/' },
        { label: 'Add Employee', link: '/' },
        { label: 'Update Employee', link: '/' },
        { label: 'Delete Employee', link: '/' },
      ],
    },
  ];

  const links = navMenu.map((item) => <LinksGroup {...item} key={item.label} />);

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
        <UserButton />
      </div>
    </nav>
  );
}
