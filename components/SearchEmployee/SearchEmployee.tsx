'use client';

import { useEffect, useState } from 'react';
import { Group, Select, Table, Text } from '@mantine/core';
import classnames from './SearchEmployee.module.css';
import { useInventory } from '@/app/_utils/inventory-context';
import { dbGetAllEmployees } from '@/app/_services/employees-service';
import { Employee } from '@/app/_utils/schema';

export default function SearchEmployee() {
  const [searchValue, setSearchValue] = useState<string | null>('');
  const { setCurrentPage, setCurrentSection } = useInventory();
  const [employees, setEmployees] = useState<Employee[]>([]);

  const rows = employees?.map((employee) => {
    return (
      employee.firstName?.toLowerCase().includes(searchValue?.toLowerCase() || '') ||
      employee.lastName?.toLowerCase().includes(searchValue?.toLowerCase() || '')
    ) ? (
      <Table.Tr key={employee.employeeId}>
        <Table.Td style={{ maxWidth: '20px', overflowX: 'scroll', scrollbarWidth: 'none' }}>
          {employee.employeeId}
        </Table.Td>
        <Table.Td>{`${employee.firstName} ${employee.lastName}`}</Table.Td>
        <Table.Td>{employee.phone}</Table.Td>
        <Table.Td>{employee.email}</Table.Td>
        <Table.Td>{employee.position}</Table.Td>
        <Table.Td>{employee.department}</Table.Td>
        <Table.Td>{employee.employeeLevel}</Table.Td>
      </Table.Tr>
    ) : null;
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const fetchedEmployees = await dbGetAllEmployees();
        setEmployees(fetchedEmployees || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
    setCurrentPage('Search Employee');
    setCurrentSection('employees');
  }, []);

  return (
    <main>
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
          label="Search Employee"
          placeholder="Select an employee from the list..."
          data={employees?.map((employee) => ({
            value: employee.firstName,
            label: `${employee.firstName} ${employee.lastName}`,
          }))}
          allowDeselect
          searchable
          value={searchValue || null}
          onChange={setSearchValue}
          classNames={{
            root: classnames.selectRoot,
          }}
          size="md"
          withAsterisk
        />

        <Table
          stickyHeader
          stickyHeaderOffset={60}
          horizontalSpacing="xl"
          verticalSpacing="lg"
          classNames={{
            thead: classnames.thead,
            td: classnames.td,
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Employee ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Position</Table.Th>
              <Table.Th>Department</Table.Th>
              <Table.Th>Access Level</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Group>
    </main>
  );
}