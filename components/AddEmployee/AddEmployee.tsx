/* eslint-disable no-console */
import { ChangeEvent, FormEvent, useState } from 'react';
import { Button, Checkbox, Group, PasswordInput, SimpleGrid, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useUserAuth } from '@/app/_utils/auth-context';
import { defaultEmployee, Employee } from '@/app/_utils/schema';
import CustomNotification from '../CustomNotification/CustomNotification';
import classnames from './AddEmployee.module.css';

export default function AddEmployee() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [employeeLevel2, setEmployeeLevel2] = useState(false);
  const [employeeLevel3, setEmployeeLevel3] = useState(false);
  const [purchaseAdminLevel1, setPurchaseAdminLevel1] = useState(false);
  const [purchaseAdminLevel2, setPurchaseAdminLevel2] = useState(false);
  const [inventoryAdmin, setInventoryAdmin] = useState(false);
  const [visible, { toggle }] = useDisclosure(false);
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(<div />);

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    setFirstName(event.target.value);
  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    setLastName(event.target.value);
  const handleEmployeeIdChange = (event: ChangeEvent<HTMLInputElement>) =>
    setEmployeeId(event.target.value);
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length < 13) {
      setPhone(event.target.value);
    }
  };
  const handleDepartmentChange = (event: ChangeEvent<HTMLInputElement>) =>
    setDepartment(event.target.value);
  const handlePositionChange = (event: ChangeEvent<HTMLInputElement>) =>
    setPosition(event.target.value);
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);
  const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== password) {
      setPasswordConfirmError('Passwords do not match');
    } else if (passwordConfirmError) {
      setPasswordConfirmError('');
    }
    setConfirmPassword(event.target.value);
  };
  const handleEmployeeLevel2Change = (_event: ChangeEvent<HTMLInputElement>) =>
    setEmployeeLevel2(!employeeLevel2);
  const handleEmployeeLevel3Change = (_event: ChangeEvent<HTMLInputElement>) =>
    setEmployeeLevel3(!employeeLevel3);
  const handlePurchaseAdminLevel1Change = (_event: ChangeEvent<HTMLInputElement>) =>
    setPurchaseAdminLevel1(!purchaseAdminLevel1);
  const handlePurchaseAdminLevel2Change = (_event: ChangeEvent<HTMLInputElement>) =>
    setPurchaseAdminLevel2(!purchaseAdminLevel2);
  const handleInventoryAdminChange = (_event: ChangeEvent<HTMLInputElement>) =>
    setInventoryAdmin(!inventoryAdmin);

  const { createUserWithEmail } = useUserAuth() || {};

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // TODO: Add confirm modal
    // If form is submitted even if password mismatch
    if (passwordConfirmError) {
      setNotificationMessage(
        CustomNotification(
          'error',
          'Password Mismatch',
          'Password and Confirm Password should be the same',
          closeNotification
        )
      );
    } else {
      const employeeLevels = ['E1'];
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

      const newEmployeeObj: Employee = {
        ...defaultEmployee,
        firstName,
        lastName,
        employeeWorkId: employeeId,
        email,
        phone,
        position,
        department,
        employeeLevel: employeeLevels,
      };

      // Create a new request
      const request = new Request('/api/employees/', {
        method: 'POST',
        body: JSON.stringify(newEmployeeObj),
      });

      try {
        // Fetch the request created
        const response = await fetch(request);

        // If it is successful provide feedback
        if (response.ok) {
          createUserWithEmail(email, password);
          console.log('Success');
          setNotificationMessage(
            CustomNotification(
              'success',
              'Employee Added!',
              `Item ${firstName} ${lastName} successfully added.`,
              closeNotification
            )
          );
        }

        //Reset Fields
        setFirstName('');
        setLastName('');
        setEmployeeId('');
        setEmail('');
        setPhone('');
        setDepartment('');
        setPosition('');
        setPassword('');
        setConfirmPassword('');
        setEmployeeLevel2(false);
        setEmployeeLevel3(false);
        setPurchaseAdminLevel1(false);
        setPurchaseAdminLevel2(false);
        setInventoryAdmin(false);
      } catch (error) {
        console.log(error);
        setNotificationMessage(
          CustomNotification(
            'error',
            'Error Encountered',
            'Unexpected Error encountered. Please try again.',
            closeNotification
          )
        );
      }
    }

    // Display notification for 3 seconds.
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  return (
    <main className={classnames.rootMain}>
      <Text
        classNames={{
          root: classnames.rootText,
        }}
      >
        Enroll Employee
      </Text>
      <form onSubmit={handleSubmit}>
        <Group
          classNames={{
            root: classnames.rootMainGroup,
          }}
        >
          <Group
            classNames={{
              root: classnames.rootGroup,
            }}
          >
            <Group
              classNames={{
                root: classnames.form,
              }}
            >
              <Group
                classNames={{
                  root: classnames.formLeft,
                }}
              >
                <SimpleGrid cols={2} spacing="xl" verticalSpacing="xl">
                  <TextInput
                    label="First Name"
                    withAsterisk
                    required
                    placeholder="First Name"
                    size="md"
                    value={firstName}
                    onChange={handleFirstNameChange}
                  />
                  <TextInput
                    label="Last Name"
                    withAsterisk
                    required
                    placeholder="Last Name"
                    size="md"
                    value={lastName}
                    onChange={handleLastNameChange}
                  />
                  <TextInput
                    label="Employee ID"
                    withAsterisk
                    required
                    placeholder="Employee ID"
                    size="md"
                    value={employeeId}
                    onChange={handleEmployeeIdChange}
                  />
                  <TextInput
                    label="Email"
                    withAsterisk
                    required
                    placeholder="Email"
                    type="email"
                    size="md"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  <TextInput
                    label="Phone"
                    withAsterisk
                    required
                    placeholder="Phone"
                    size="md"
                    value={phone}
                    onChange={handlePhoneChange}
                    type="number"
                  />
                  <TextInput
                    label="Department"
                    withAsterisk
                    required
                    placeholder="Department"
                    size="md"
                    value={department}
                    onChange={handleDepartmentChange}
                  />
                  <TextInput
                    label="Position"
                    withAsterisk
                    required
                    placeholder="Position"
                    size="md"
                    value={position}
                    onChange={handlePositionChange}
                  />
                  <PasswordInput
                    label="Password"
                    required
                    size="md"
                    value={password}
                    onChange={handlePasswordChange}
                    visible={visible}
                    onVisibilityChange={toggle}
                  />
                  <PasswordInput
                    label="Confirm Password"
                    required
                    size="md"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    visible={visible}
                    error={passwordConfirmError}
                    onVisibilityChange={toggle}
                  />
                </SimpleGrid>
              </Group>
              <Group
                classNames={{
                  root: classnames.formRight,
                }}
              >
                <Text fw={500}>Access Level</Text>
                <Checkbox
                  disabled
                  checked
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
              </Group>
            </Group>
            <Button type="submit" variant="filled" color="#1B4965" size="md" mt="xl">
              Enroll
            </Button>
          </Group>
          {showNotification && notificationMessage}
        </Group>
      </form>
    </main>
  );
}
