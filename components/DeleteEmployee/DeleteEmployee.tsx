'use client';

import { useEffect, useState } from 'react';
import { Button, Flex, Group, Modal, Select, SimpleGrid, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { defaultEmployee, Employee } from '@/app/_utils/schema';
import { dbDeleteEmployee, dbGetAllEmployees } from '@/app/_services/employees-service';
import CustomNotification from '../CustomNotification/CustomNotification';
import classnames from './DeleteEmployee.module.css';
import { useInventory } from '@/app/_utils/inventory-context';

export default function DeleteEmployee() {
  // Search and selected employees from employee search
  const [searchValue, setSearchValue] = useState<string | null>('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>({ ...defaultEmployee });

  // State for list of employees
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Confirmation Modal State
  const [opened, { close, open }] = useDisclosure(false);

  // Notification State
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // States for Employee object attributes
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [employeeLevel, setEmployeeLevel] = useState<string>('');
  const [staticEmployeeId, setStaticEmployeeId] = useState<string>('');

  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { setRefresh, setCurrentPage, setCurrentSection } = useInventory();

  // Handle delete submit
  const handleSubmit = async () => {
    try {
      await dbDeleteEmployee(staticEmployeeId);

      setSuccessMessage(`The employee ${firstName} ${lastName} has been successfully deleted`);
      setSearchValue('');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      setErrorTitle('Error Encountered');
      setErrorMessage('Unexpected Error encountered. Please try again.');
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  // Fetch employees from db 
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const foundEmployees = await dbGetAllEmployees();
        setEmployees(foundEmployees || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  // Find employee to search in employee list and set as selectedEmployee
  useEffect(() => {
    const matchedEmployee = employees.find((employee) => employee.employeeWorkId === searchValue);
    setSelectedEmployee(matchedEmployee || { ...defaultEmployee });
    setRefresh((prev: number) => prev + 1);
  }, [searchValue]);

  // Update fields whenever there is a new selectedEmployee
  useEffect(() => {
    const updateValues = async () => {
      setStaticEmployeeId(selectedEmployee.employeeId || '');
      setFirstName(selectedEmployee.firstName || '');
      setLastName(selectedEmployee.lastName || '');
      setEmail(selectedEmployee.email || '');
      setPhone(selectedEmployee.phone || '');
      setPosition(selectedEmployee.position || '');
      setDepartment(selectedEmployee.department || '');
      setEmployeeLevel(selectedEmployee.employeeLevel || '');
    };

    updateValues();
  }, [selectedEmployee]);

  useEffect(() => {
    setCurrentPage('Delete Employee');
    setCurrentSection('employees');
  }, []);

  return (
    <Group
      classNames={{
        root: classnames.rootGroup,
      }}
    >
      <Modal
        centered
        opened={opened}
        onClose={close}
        size="xl"
        title="Confirmation"
        classNames={{
          title: classnames.modalTitle,
        }}
      >
        <Text mb={20}>Are you sure you want to delete employee {firstName} {lastName}?</Text>
        <Flex justify="center" align="center" direction="column" style={{ height: '100%' }}>
          <SimpleGrid
            cols={2}
            spacing="xl"
            verticalSpacing="xs"
            classNames={{ root: classnames.simpleGridRoot }}
          >
            <Text>
              Employee Name:{' '}
              <Text fw={700} td="underline" component="span" ml={5}>
                {firstName} {lastName}
              </Text>
            </Text>
            <Text>
              Position:{' '}
              <Text fw={700} td="underline" component="span" ml={5}>
                {position}
              </Text>
            </Text>
            <Text>
              Department:{' '}
              <Text fw={700} td="underline" component="span" ml={5}>
                {department}
              </Text>
            </Text>
            <Text>
              Email:{' '}
              <Text fw={700} td="underline" component="span" ml={5}>
                {email}
              </Text>
            </Text>
          </SimpleGrid>
          <Group mt="xl">
            <Button
              onClick={() => {
                handleSubmit();
                close();
              }}
              classNames={{ root: classnames.button }}
            >
              Confirm Delete
            </Button>
          </Group>
        </Flex>
      </Modal>
      <Text
        classNames={{
          root: classnames.rootText,
        }}
      >
        Delete
      </Text>
      <Select
        label="Search Employee"
        placeholder="Select an employee from the list..."
        data={employees.map((employee) => ({
          value: employee.employeeWorkId,
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
      <SimpleGrid
        cols={2}
        spacing="xl"
        verticalSpacing="xl"
        classNames={{ root: classnames.simpleGridRoot }}
      >
        <TextInput
          label="First Name"
          value={firstName}
          placeholder="Enter Employee Name..."
          classNames={{ input: classnames.disabledText }}
          size="md"
          withAsterisk
          disabled
        />
        <TextInput
          label="Last Name"
          value={lastName}
          placeholder="Enter Employee Name..."
          classNames={{ input: classnames.disabledText }}
          size="md"
          withAsterisk
          disabled
        />
        <TextInput
          label="Employee ID"
          disabled
          value={staticEmployeeId}
          placeholder="Enter Employee ID..."
          classNames={{ input: classnames.disabledText }}
          size="md"
        />
        <TextInput
          label="Email"
          value={email}
          placeholder="Enter Email..."
          classNames={{ input: classnames.disabledText }}
          size="md"
          type="email"
          withAsterisk
          disabled
        />
        <TextInput
          label="Phone"
          value={phone}
          placeholder="Enter Phone..."
          classNames={{ input: classnames.disabledText }}
          size="md"
          withAsterisk
          disabled
        />
        <TextInput
          label="Position"
          value={position}
          placeholder="Enter Position..."
          classNames={{ input: classnames.disabledText }}
          withAsterisk
          disabled
        />
        <TextInput
          label="Department"
          value={department}
          placeholder="Enter Department..."
          size="md"
          classNames={{ input: classnames.disabledText }}
          withAsterisk
          disabled
        />
        <TextInput
          label="Employee Level"
          value={employeeLevel}
          placeholder="Enter Employee Level..."
          classNames={{ input: classnames.disabledText }}
          size="md"
          withAsterisk
          disabled
        />
      </SimpleGrid>
      <Button
        variant="filled"
        size="md"
        mt="xl"
        classNames={{ root: classnames.button }}
        onClick={async () => {
          if (!firstName) {
            setErrorTitle('No Employee Selected');
            setErrorMessage('Please select an employee to delete.');
            setShowError(true);
            setTimeout(() => {
              setShowError(false);
            }, 3000);
          } else {
            open();
          }
        }}
      >
        Delete
      </Button>
      {showError &&
        CustomNotification(
          'error',
          errorTitle,
          errorMessage,
          setShowError
        )}
      {showSuccess &&
        CustomNotification(
          'success',
          'Employee Deleted',
          successMessage,
          setShowSuccess
        )}
    </Group>
  );

}