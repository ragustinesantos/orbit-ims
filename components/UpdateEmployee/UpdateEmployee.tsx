'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Group, Modal, Select, SimpleGrid, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { defaultEmployee, Employee, EmployeeToEdit } from '@/app/_utils/schema';
import CustomNotification from '../CustomNotification/CustomNotification';
import classnames from './UpdateEmployee.module.css';
import { useInventory } from '@/app/_utils/inventory-context';
import { putEmployee } from '@/app/_utils/utility';
import { dbGetAllEmployees } from '@/app/_services/employees-service';

export default function UpdateEmployee() {
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
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [employeeLevel2, setEmployeeLevel2] = useState<boolean>(false);
  const [employeeLevel3, setEmployeeLevel3] = useState<boolean>(false);
  const [purchaseAdminLevel1, setPurchaseAdminLevel1] = useState<boolean>(false);
  const [purchaseAdminLevel2, setPurchaseAdminLevel2] = useState<boolean>(false);
  const [inventoryAdmin, setInventoryAdmin] = useState<boolean>(false);
  const [employeeLevel, setEmployeeLevel] = useState<string>('');
  const [staticEmployeeId, setStaticEmployeeId] = useState<string>('');
  const [employeeWorkId, setEmployeeWorkId] = useState<string>('');

  const { setRefresh, setCurrentPage, setCurrentSection } = useInventory();

  // Handle state changes based on new values
  const handleFirstName = (newTxt: string) => setFirstName(newTxt);
  const handleLastName = (newTxt: string) => setLastName(newTxt);
  const handleEmail = (newTxt: string) => setEmail(newTxt);
  const handlePhone = (newTxt: string) => {
    if (newTxt.length < 13) {
      setPhone(newTxt);
    }
  };
  const handlePosition = (newTxt: string) => setPosition(newTxt);
  const handleDepartment = (newTxt: string) => setDepartment(newTxt);
  const handleEmployeeLevel2Change = () => setEmployeeLevel2(!employeeLevel2);
  const handleEmployeeLevel3Change = () => setEmployeeLevel3(!employeeLevel3);
  const handlePurchaseAdminLevel1Change = () => setPurchaseAdminLevel1(!purchaseAdminLevel1);
  const handlePurchaseAdminLevel2Change = () => setPurchaseAdminLevel2(!purchaseAdminLevel2);
  const handleInventoryAdminChange = () => setInventoryAdmin(!inventoryAdmin);
  const handleEmployeeWorkId = (newTxt: string) => setEmployeeWorkId(newTxt);

  // Handle update submit
  const handleSubmit = async () => {
    try {

      let employeeLevels = ['E1'];
      if (employeeLevel2) {
        employeeLevels.push('E2');
      }
      if (employeeLevel3) {
        employeeLevels.push('E3');
      }
      if (purchaseAdminLevel1) {
        employeeLevels.push('P1');
      }
      if (purchaseAdminLevel2) {
        employeeLevels.push('P2');
      }
      if (inventoryAdmin) {
        employeeLevels.push('IA');
      }

      // Create employee to update
      const updatedEmployee: EmployeeToEdit = {
        firstName,
        lastName,
        email,
        phone,
        position,
        department,
        employeeLevel: employeeLevels,
        employeeWorkId,
        isActive: true,
      };

      // Send updated employee for PUT
      await putEmployee(staticEmployeeId, updatedEmployee);

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
      setFirstName(selectedEmployee.firstName || '');
      setLastName(selectedEmployee.lastName || '');
      setEmail(selectedEmployee.email || '');
      setPhone(selectedEmployee.phone || '');
      setPosition(selectedEmployee.position || '');
      setDepartment(selectedEmployee.department || '');
      setEmployeeWorkId(selectedEmployee.employeeWorkId || '');

      if (selectedEmployee.employeeLevel.includes('E2')) {
        setEmployeeLevel2(true);
      }
      else {
        setEmployeeLevel2(false);
      }

      if (selectedEmployee.employeeLevel.includes('E3')) {
        setEmployeeLevel3(true);
      }
      else {
        setEmployeeLevel3(false);
      }

      if (selectedEmployee.employeeLevel.includes('P1')) {
        setPurchaseAdminLevel1(true);
      }
      else {
        setPurchaseAdminLevel1(false);
      }

      if (selectedEmployee.employeeLevel.includes('P2')) {
        setPurchaseAdminLevel2(true);
      }
      else {
        setPurchaseAdminLevel2(false);
      }


      if (selectedEmployee.employeeLevel.includes('IA')) {
        setInventoryAdmin(true);
      }
      else {
        setInventoryAdmin(false);
      }
    };

    updateValues();
  }, [selectedEmployee]);

  useEffect(() => {
    setCurrentPage('Update Employee');
    setCurrentSection('employees');
  }, []);

  const updateEmployeeLevelList = () => {
    let employeeLevelList = "E1";
    if (employeeLevel2) {
      employeeLevelList += ", E2"
    }

    if (employeeLevel3) {
      employeeLevelList += ", E3"
    }


    if (purchaseAdminLevel1) {
      employeeLevelList += ", P1"
    }


    if (purchaseAdminLevel2) {
      employeeLevelList += ", P2"
    }

    if (inventoryAdmin) {
      employeeLevelList += ", IA"
    }

    setEmployeeLevel(employeeLevelList);
  }

  return (
    <main>
      <form onSubmit={
        async (event: FormEvent) => {
          event.preventDefault();
          if (!firstName || !lastName || !email || !phone || !position || !department) {
            setShowError(true);
            setTimeout(() => {
              setShowError(false);
            }, 3000);
          } else {
            updateEmployeeLevelList();
            open();
          }
        }
      }
      >
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
                    {firstName}
                  </Text>
                </Text>
                <Text>
                  Last Name:{' '}
                  <Text fw={700} td="underline" component="span" ml={5}>
                    {lastName}
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
            required
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
              onChange={(event) => handleFirstName(event.target.value)}
              placeholder="Enter First Name..."
              classNames={{ root: classnames.txtItemName }}
              size="md"
              withAsterisk
              required
            />
            <TextInput
              label="Last Name"
              value={lastName}
              onChange={(event) => handleLastName(event.target.value)}
              placeholder="Enter Last Name..."
              classNames={{ root: classnames.txtItemName }}
              size="md"
              withAsterisk
              required
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
              type='email'
              required
            />
            <TextInput
              label="Phone"
              value={phone}
              onChange={(event) => handlePhone(event.target.value)}
              placeholder="Enter Phone..."
              classNames={{ root: classnames.txtItemName }}
              size="md"
              withAsterisk
              type='number'
              required
            />
            <TextInput
              label="Position"
              value={position}
              onChange={(event) => handlePosition(event.target.value)}
              placeholder="Enter Position..."
              classNames={{ root: classnames.txtItemName }}
              size="md"
              withAsterisk
              required
            />
            <TextInput
              label="Department"
              value={department}
              onChange={(event) => handleDepartment(event.target.value)}
              placeholder="Enter Department..."
              classNames={{ root: classnames.txtItemName }}
              size="md"
              withAsterisk
              required
            />
          </SimpleGrid>
          <Text fw={500}>
            Access Level
          </Text>
          <Checkbox
            disabled checked
            label="Employee Level 1 (default)"
            classNames={{
              label: classnames.checkboxLabel,
            }}
          />
          <Checkbox
            label="Employee Level 2"
            checked={employeeLevel2}
            onChange={handleEmployeeLevel2Change}
          />
          <Checkbox
            label="Employee Level 3"
            checked={employeeLevel3}
            onChange={handleEmployeeLevel3Change}
          />
          <Checkbox
            label="Purchase Admin Level 1"
            checked={purchaseAdminLevel1}
            onChange={handlePurchaseAdminLevel1Change}
          />
          <Checkbox
            label="Purchase Admin Level 2"
            checked={purchaseAdminLevel2}
            onChange={handlePurchaseAdminLevel2Change}
          />
          <Checkbox
            label="Inventory Admin"
            checked={inventoryAdmin}
            onChange={handleInventoryAdminChange}
          />
          <Button
            variant="filled"
            color="#1B4965"
            size="md"
            mt="xl"
            type='submit'
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
      </form>
    </main>
  );
}