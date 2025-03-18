'use client';

import { useEffect, useState } from 'react';
import { Group, Select, Table, Text } from '@mantine/core';
import { dbGetAllEmployees } from '@/app/_services/employees-service';
import { useInventory } from '@/app/_utils/inventory-context';
import { Employee } from '@/app/_utils/schema';
import classnames from './SearchEmployee.module.css';

export default function SearchEmployee() {
  // Search employees from employee search
  const [searchValue, setSearchValue] = useState<string | null>('');
  const { setCurrentPage, setCurrentSection } = useInventory();

  // State for list of employees
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Filtering for searched employees
  const rows = employees?.map((employee) => {
    let employeeLevelList = '';

    for (let i = 0; i < employee.employeeLevel.length; i++) {
      if (employeeLevelList) {
        employeeLevelList += ', ';
      }
      employeeLevelList += employee.employeeLevel[i];
    }

    return (
      // checks if inputted value matches employee names (case-insensitive)
      employee.firstName?.toLowerCase().includes(searchValue?.toLowerCase() || '') ||
        employee.lastName?.toLowerCase().includes(searchValue?.toLowerCase() || '') ? (
        <Table.Tr key={employee.employeeId}>
          <Table.Td style={{ maxWidth: '20px', overflowX: 'scroll', scrollbarWidth: 'none' }}>
            {employee.employeeId}
          </Table.Td>
          <Table.Td>{`${employee.firstName} ${employee.lastName}`}</Table.Td>
          <Table.Td>{employee.phone}</Table.Td>
          <Table.Td>{employee.email}</Table.Td>
          <Table.Td>{employee.position}</Table.Td>
          <Table.Td>{employee.department}</Table.Td>
          <Table.Td>{employeeLevelList}</Table.Td>
        </Table.Tr>
      ) : null
    );
  });

  // Fetch employees from db
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const foundEmployees = (await dbGetAllEmployees()) || [];
        // filter out inactive employees
        const activeEmployees = foundEmployees.filter((employee) => employee.isActive === true);
        setEmployees(activeEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
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

        <div className={classnames.rootTable}>
          <Table
            stickyHeader
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
                <Table.Th>Access Levels</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      </Group>
    </main>
  );
}
