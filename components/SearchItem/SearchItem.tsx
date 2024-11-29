'use client';

import { useEffect, useState } from 'react';
import { Button, Group, Select, SimpleGrid, Text, TextInput } from '@mantine/core';
import classnames from './SearchItem.module.css';

import { Table } from '@mantine/core';

export default function SearchItem() {
  const [value, setValue] = useState('');

  const [searchValue, setSearchValue] = useState('');

  const elements = [
    { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
    { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
    { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
    { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
    { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
  ];


    const rows = elements.map((element) => (
      <Table.Tr key={element.name}>
        <Table.Td>{element.position}</Table.Td>
        <Table.Td>{element.name}</Table.Td>
        <Table.Td>{element.symbol}</Table.Td>
        <Table.Td>{element.mass}</Table.Td>
      </Table.Tr>
    ));

  
  return (
    <Group
      classNames={{
        root: classnames.rootGroup,
      }}
    >
      <Text
        classNames={{
          root: classnames.rootText,
        }}
      >
        Search
      </Text>

      <Select
      searchable
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      data={['React', 'Angular', 'Vue', 'Svelte']}
      nothingFoundMessage="Nothing found..."
      classNames={{
        root: classnames.selectRoot,
      }}
    />

<Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Element position</Table.Th>
          <Table.Th>Element name</Table.Th>
          <Table.Th>Symbol</Table.Th>
          <Table.Th>Atomic mass</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>


     
    </Group>
  );
}