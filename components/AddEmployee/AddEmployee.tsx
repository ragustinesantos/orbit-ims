import { Button, Checkbox, Group, SimpleGrid, Text, TextInput } from "@mantine/core";
import classnames from './AddEmployee.module.css';


export default function AddEmployee() {
    return (
        <main>
            <form>
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
                        />
                        <TextInput
                            label="Employee ID"
                            withAsterisk
                            required
                            placeholder="Employee ID"
                        />
                        <TextInput
                            label="Email"
                            withAsterisk
                            required
                            placeholder="Email"
                            type="email"
                        />
                        <TextInput
                            label="Department"
                            withAsterisk
                            required
                            placeholder="Department"
                        />
                        <TextInput
                            label="Position"
                            withAsterisk
                            required
                            placeholder="Position"
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
                    />
                    <Checkbox
                        label="Employee Level 3"
                    />
                    <Checkbox
                        label="Purchase Admin Level 1"
                    />
                    <Checkbox
                        label="Purchase Admin Level 2"
                    />
                    <Checkbox
                        label="Inventory Admin"
                    />
                    <Button type="submit" onSubmit={() => { event?.preventDefault }} variant="filled" color="#1B4965" size="md" mt="xl" >
                        Create
                    </Button>
                </Group>
            </form>
        </main>
    );
}