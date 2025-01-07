import Image from 'next/image';
import {
  IconAdjustments,
  IconCalendarStats,
  IconFileAnalytics,
  IconGauge,
  IconLock,
  IconMessage,
  IconNotes,
  IconPresentationAnalytics,
} from '@tabler/icons-react';
import { Button, Group, ScrollArea } from '@mantine/core';
import { useUserAuth } from '@/app/_utils/auth-context';
import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup';
import { UserButton } from '../UserButton/UserButton';
import classes from './NavbarNested.module.css';

const mockdata = [
  { label: 'Dashboard', icon: IconGauge },
  {
    label: 'Assistant',
    icon: IconMessage,
    initiallyOpened: true,
    links: [
      { label: 'Chat', link: '/assistant' },
      { label: 'Generate Report', link: '/' },
    ],
  },
  {
    label: 'Manage Inventory',
    icon: IconNotes,
    links: [
      { label: 'Add Item', link: '/add-item' },
      { label: 'Forecasts', link: '/' },
      { label: 'Outlook', link: '/' },
      { label: 'Real time', link: '/' },
    ],
  },
  {
    label: 'Releases',
    icon: IconCalendarStats,
    links: [
      { label: 'Upcoming releases', link: '/' },
      { label: 'Previous releases', link: '/' },
      { label: 'Releases schedule', link: '/' },
    ],
  },
  { label: 'Analytics', icon: IconPresentationAnalytics },
  { label: 'Contracts', icon: IconFileAnalytics },
  { label: 'Settings', icon: IconAdjustments },
  {
    label: 'Security',
    icon: IconLock,
    links: [
      { label: 'Enable 2FA', link: '/' },
      { label: 'Change password', link: '/' },
      { label: 'Recovery codes', link: '/' },
    ],
  },
];

export function NavbarNested() {
  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);
  const { firebaseSignOut } = useUserAuth();

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
