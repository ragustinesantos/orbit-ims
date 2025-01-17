import { useState } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import classes from './NavbarLinksGroup.module.css';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
  link?:string;  //dashboard single link
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, links, link }: LinksGroupProps) {
  const hasLinks = Array.isArray(links) && links.length>0;
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map((link) => (
    <Text<'a'> component="a" className={classes.link} href={link.link} key={link.label}>
      {link.label}
    </Text>
  ));

  const handleClick = () => {
    if (!hasLinks && link) {
      //if single link
      window.location.href = link;
    } else {
      //if multiple links
      setOpened((o) => !o);
    }
  };

  return (
    <>
      <UnstyledButton onClick={handleClick} className={classes.control}>
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              size={16}
              style={{ transform: opened ? 'rotate(-90deg)' : 'none' }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
