import { Button, Checkbox, Group, SimpleGrid, Text, TextInput } from "@mantine/core";
import classnames from './AddEmployee.module.css';
import { ChangeEvent, FormEvent, useState } from "react";


export default function AddEmployee() {

    const [name, setName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [position, setPosition] = useState('');
    const [employeeLevel2, setEmployeeLevel2] = useState(false);
    const [employeeLevel3, setEmployeeLevel3] = useState(false);
    const [purchaseAdminLevel1, setPurchaseAdminLevel1] = useState(false);
    const [purchaseAdminLevel2, setPurchaseAdminLevel2] = useState(false);
    const [inventoryAdmin, setInventoryAdmin] = useState(false);

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) =>
        setName(event.target.value);
    const handleEmployeeIdChange = (event: ChangeEvent<HTMLInputElement>) =>
        setEmployeeId(event.target.value);
    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) =>
        setEmail(event.target.value);
    const handleDepartmentChange = (event: ChangeEvent<HTMLInputElement>) =>
        setDepartment(event.target.value);
    const handlePositionChange = (event: ChangeEvent<HTMLInputElement>) =>
        setPosition(event.target.value);
    const handleEmployeeLevel2Change = (event: ChangeEvent<HTMLInputElement>) =>
        setEmployeeLevel2(!employeeLevel2);
    const handleEmployeeLevel3Change = (event: ChangeEvent<HTMLInputElement>) =>
        setEmployeeLevel3(!employeeLevel3);
    const handlePurchaseAdminLevel1Change = (event: ChangeEvent<HTMLInputElement>) =>
        setPurchaseAdminLevel1(!purchaseAdminLevel1);
    const handlePurchaseAdminLevel2Change = (event: ChangeEvent<HTMLInputElement>) =>
        setPurchaseAdminLevel2(!purchaseAdminLevel2);
    const handleInventoryAdminChange = (event: ChangeEvent<HTMLInputElement>) =>
        setInventoryAdmin(!inventoryAdmin);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        console.log(name +
            employeeId +
            email +
            department +
            position +
            employeeLevel2 +
            employeeLevel3 +
            purchaseAdminLevel1 +
            purchaseAdminLevel2 +
            inventoryAdmin
        );
    }

    return (
        <main>
            <form onSubmit={handleSubmit}>
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
                        Add
                    </Text>

                    <SimpleGrid cols={2} spacing="xl" verticalSpacing="xl">
                        <TextInput
                            label="Name"
                            withAsterisk
                            required
                            placeholder="Full Name"
                            value={name}
                            onChange={handleNameChange}
                        />
                        <TextInput
                            label="Employee ID"
                            withAsterisk
                            required
                            placeholder="Employee ID"
                            value={employeeId}
                            onChange={handleEmployeeIdChange}
                        />
                        <TextInput
                            label="Email"
                            withAsterisk
                            required
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <TextInput
                            label="Department"
                            withAsterisk
                            required
                            placeholder="Department"
                            value={department}
                            onChange={handleDepartmentChange}
                        />
                        <TextInput
                            label="Position"
                            withAsterisk
                            required
                            placeholder="Position"
                            value={position}
                            onChange={handlePositionChange}
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
                    <Button type="submit" variant="filled" color="#1B4965" size="md" mt="xl" >
                        Create
                    </Button>
                </Group>
            </form>
        </main>
    );
}