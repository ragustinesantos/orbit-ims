'use client';
import { Button, Group, Select, SimpleGrid, Text, TextInput, Avatar, Flex } from '@mantine/core';
import  classnames  from './ProfilePage.module.css';
import { useInventory } from '@/app/_utils/inventory-context';
import { useUserAuth } from '@/app/_utils/auth-context';



export default function ProfilePage () {


 
// Use the useUserAuth hook to get the user object and the login and logout functions
const { currentEmployee } = useInventory();
    console.log(currentEmployee);
    const { firebaseSignOut } = useUserAuth();

    const handleLogout = async () => {
        if (firebaseSignOut) {
        await firebaseSignOut();
        }
        window.location.replace("/")
    };

    return (
        
        <div className={classnames.externalLayout}>
            <div className={classnames.internalLayoutGroup}>
                    <div className={classnames.titleAndPhoto}>
                        <p className={classnames.rootText}>Profile</p>
                        <img className={classnames.photo} src={"https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"}  />
                    </div>
                    <div className={classnames.simplegrid1}>
                        <SimpleGrid cols={2} verticalSpacing="xl">
                            <div className={classnames.title}>First Name:</div>
                            <div>{currentEmployee?.firstName}</div>
                            <div className={classnames.title}>Last Name:</div>
                            <div>{currentEmployee?.lastName}</div>
                            <div className={classnames.title}>Email:</div>
                            <div>{currentEmployee?.email}</div>
                            <div className={classnames.title}>Phone:</div>
                            <div>{currentEmployee?.phone}</div>
                            <div className={classnames.title}>Position:</div>
                            <div>{currentEmployee?.position}</div>
                            <div className={classnames.title}>Department:</div>
                            <div>{currentEmployee?.department}</div>
                            <div className={classnames.title}>Access Level:</div>
                            <div>{currentEmployee?.employeeLevel}</div>
                            
                        </SimpleGrid>
                        <div>
                        <Button variant="filled" classNames={{root:classnames.button}}>Change Password</Button>
                        <Button variant="filled" onClick={handleLogout} classNames={{root:classnames.button}}>Logout</Button>
                        </div>  
                    </div>
            </div>
        </div>
        
    )
}