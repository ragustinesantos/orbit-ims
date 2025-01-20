'use client';

import { useEffect, useState } from 'react';
import { Button, Flex, Group, Modal, Select, SimpleGrid, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { defaultEmployee, Employee, EmployeeToEdit } from '@/app/_utils/schema';
import CustomNotification from '../CustomNotification/CustomNotification';
import classnames from './UpdateEmployee.module.css';
import { useInventory } from '@/app/_utils/inventory-context';
import { putEmployee } from '@/app/_utils/utility';
import { dbGetAllEmployees } from '@/app/_services/employees-service';

export default function UpdateEmployee(){
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
  const [showUpdateError, setShowUpdateError] = useState<boolean>(false);

  // States for Employee object attributes
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [employeeLevel, setEmployeeLevel] = useState<string>('');
  const [staticEmployeeId, setStaticEmployeeId] = useState<string>('');
  const [employeeWorkId, setEmployeeWorkId] = useState<string>('');

  const { setRefresh, setCurrentPage, setCurrentSection } = useInventory();

  // Handle state changes based on new values
  const handleFullName = (newTxt: string) => setFullName(newTxt);
  const handleEmail = (newTxt: string) => setEmail(newTxt);
  const handlePhone = (newTxt: string) => setPhone(newTxt);
  const handlePosition = (newTxt: string) => setPosition(newTxt);
  const handleDepartment = (newTxt: string) => setDepartment(newTxt);
  const handleEmployeeLevel = (newTxt: string) => setEmployeeLevel(newTxt);
  const handleEmployeeWorkId = (newTxt: string) => setEmployeeWorkId(newTxt);

  // Handle update submit
  const handleSubmit = () => {
    try {
      // Create employee to update
      const updatedEmployee: EmployeeToEdit = {
        firstName: fullName.split(' ')[0] || '',
        lastName: fullName.split(' ')[1] || '',
        email,
        phone,
        position,
        department,
        employeeLevel,
        employeeWorkId,
        password: '',
        chatId: [],
        isActive: true,
      };

      // Send updated employee for PUT
      putEmployee(staticEmployeeId, updatedEmployee);

      // Show success notification
      setShowSuccess(true);

      // Hide notification
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.log(error);

      // Show error notification
      setShowUpdateError(true);

      // Hide notification
      setTimeout(() => {
        setShowUpdateError(false);
      }, 3000);
    }
  };

  // Fetch employees from db 
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const foundEmployees = await dbGetAllEmployees();
        // Filter out inactive employees
        const activeEmployees = foundEmployees.filter((employee) => employee.isActive === true);
        setEmployees(activeEmployees || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  // Find employee to search in employeeList and set as selectedEmployee
  useEffect(() => {
    const matchedEmployee = employees?.find((employee) => employee.email === searchValue);
    setSelectedEmployee(matchedEmployee || { ...defaultEmployee });
    setRefresh((prev: number) => prev + 1);
  }, [searchValue]);

  // Update fields whenever there is a new selectedEmployee
  useEffect(() => {
    const updateValues = async () => {
      setStaticEmployeeId(selectedEmployee.employeeId || '');
      setFullName(`${selectedEmployee.firstName || ''} ${selectedEmployee.lastName || ''}`);
      setEmail(selectedEmployee.email || '');
      setPhone(selectedEmployee.phone || '');
      setPosition(selectedEmployee.position || '');
      setDepartment(selectedEmployee.department || '');
      setEmployeeLevel(selectedEmployee.employeeLevel || '');
      setEmployeeWorkId(selectedEmployee.employeeWorkId || '');
    };

    updateValues();
  }, [selectedEmployee]);

  useEffect(() => {
    setCurrentPage('Update Employee');
    setCurrentSection('employees');
  }, []);

  return (
    <main>
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
          <Text mb={20}>Do you want to proceed with the changes?</Text>
          <Flex justify="center" align="center" direction="column" style={{ height: '100%' }}>
            <SimpleGrid
              cols={2}
              spacing="xl"
              verticalSpacing="xs"
              classNames={{ root: classnames.simpleGridRoot }}
            >
              <Text>
                First Name:{' '}
                <Text fw={700} td="underline" component="span" ml={5}>
                  {fullName.split(' ')[0]}
                </Text>
              </Text>
              <Text>
                Last Name:{' '}
                <Text fw={700} td="underline" component="span" ml={5}>
                  {fullName.split(' ')[1]}
                </Text>
              </Text>
              <Text>
                Email:{' '}
                <Text fw={700} td="underline" component="span" ml={5}>
                  {email}
                </Text>
              </Text>
              <Text>
                Phone:{' '}
                <Text fw={700} td="underline" component="span" ml={5}>
                  {phone}
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
                Employee Level:{' '}
                <Text fw={700} td="underline" component="span" ml={5}>
                  {employeeLevel}
                </Text>
              </Text>
            </SimpleGrid>
            <Group mt="xl">
              <Button
                onClick={() => {
                  handleSubmit();
                  close();
                }}
                color="#1B4965"
              >
                Confirm
              </Button>
            </Group>
          </Flex>
        </Modal>
        <Text
          classNames={{
            root: classnames.rootText,
          }}
        >
          Update
        </Text>
        <Select
          label="Search Employee"
          placeholder="Select an employee from the list..."
          data={employees?.map((employee) => ({
            value: employee.email,
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
            label="Full Name"
            value={fullName}
            onChange={(event) => handleFullName(event.target.value)}
            placeholder="Enter Full Name..."
            classNames={{ root: classnames.txtItemName }}
            size="md"
            withAsterisk
          />
          <TextInput
            label="Employee ID"
            value={employeeWorkId}
            onChange={(event) => handleEmployeeWorkId(event.target.value)}
            placeholder="Enter Employee ID..."
            classNames={{ root: classnames.txtItemName }}
            size="md"
            withAsterisk
          />
          <TextInput
            label="Email"
            value={email}
            onChange={(event) => handleEmail(event.target.value)}
            placeholder="Enter Email..."
            classNames={{ root: classnames.txtItemName }}
            size="md"
            withAsterisk
          />
          <TextInput
            label="Phone"
            value={phone}
            onChange={(event) => handlePhone(event.target.value)}
            placeholder="Enter Phone..."
            classNames={{ root: classnames.txtItemName }}
            size="md"
            withAsterisk
          />
          <TextInput
            label="Position"
            value={position}
            onChange={(event) => handlePosition(event.target.value)}
            placeholder="Enter Position..."
            classNames={{ root: classnames.txtItemName }}
            size="md"
            withAsterisk
          />
          <TextInput
            label="Department"
            value={department}
            onChange={(event) => handleDepartment(event.target.value)}
            placeholder="Enter Department..."
            classNames={{ root: classnames.txtItemName }}
            size="md"
            withAsterisk
          />
          <TextInput
            label="Employee Level"
            value={employeeLevel}
            onChange={(event) => handleEmployeeLevel(event.target.value)}
            placeholder="Enter Employee Level..."
            classNames={{ root: classnames.txtItemName }}
            size="md"
            withAsterisk
          />
        </SimpleGrid>
        <Button
          variant="filled"
          color="#1B4965"
          size="md"
          mt="xl"
          onClick={async () => {
            if (!fullName || !email || !phone || !position || !department || !employeeLevel) {
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
            } else {
              open();
            }
          }}
        >
          Submit
        </Button>
        {showError &&
          CustomNotification(
            'error',
            'Incomplete Fields',
            'Please fill up all required fields before submitting.',
            setShowError
          )}
        {showSuccess &&
          CustomNotification(
            'success',
            'Employee Updated',
            'The employee has been successfully updated',
            setShowSuccess
          )}
        {showUpdateError &&
          CustomNotification(
            'error',
            'Employee Update Failed',
            'Employee failed to update due to a server error',
            setShowUpdateError
          )}
      </Group>
    </main>
  );
}