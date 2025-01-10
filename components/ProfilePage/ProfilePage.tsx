'use client';
import { Button, Group, Select, SimpleGrid, Text, TextInput, Avatar, Flex } from '@mantine/core';
import  classnames  from './ProfilePage.module.css';
import { useInventory } from '@/app/_utils/inventory-context';



export default function ProfilePage () {


 
// Use the useUserAuth hook to get the user object and the login and logout functions
const { currentEmployee } = useInventory();
console.log(currentEmployee);

    return (
        <div className={classnames.externalLayout}>
            <div className={classnames.internalLayoutGroup}>
                    <div className={classnames.titleAndPhoto}>
                        <Text classNames={{root: classnames.rootText,}}>Profile</Text>
                        <Avatar src={"https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"} radius="100" size={'200'} />
                    </div>
                    <div className={classnames.simplegrid1}>
                        <SimpleGrid cols={2} verticalSpacing="xl">
                            <div>First Name:</div>
                            <div>{currentEmployee?.firstName}</div>
                            <div>Last Name:</div>
                            <div>{currentEmployee?.lastName}</div>
                            <div>Email:</div>
                            <div>{currentEmployee?.email}</div>
                            <div>Phone:</div>
                            <div>{currentEmployee?.phone}</div>
                            <div>Position:</div>
                            <div>{currentEmployee?.position}</div>
                            <div>Department:</div>
                            <div>{currentEmployee?.department}</div>
                            <div>Access Level:</div>
                            <div>{currentEmployee?.employeeLevel}</div>
                            <Button variant="filled" classNames={{root:classnames.button}}>Change Password</Button>
                            <Button variant="filled" classNames={{root:classnames.button}}>Logout</Button>
                        </SimpleGrid>  
                    </div>
            </div>
        </div>
            
    )
}