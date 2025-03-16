"use client";
import { Group, Title, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import classnames from "./Bell.module.css";
import { useInventory } from "@/app/_utils/inventory-context";
import { Menu, Button, UnstyledButton, Indicator } from "@mantine/core";
import { IconSettings, IconLogout, IconBell} from '@tabler/icons-react';
import { useDisclosure } from "@mantine/hooks";
import { fetchOrderRequisitions } from "@/app/_utils/utility";
import { Employee, OrderRequisition } from "@/app/_utils/schema";
import { EmployeeToEdit } from "@/app/_utils/schema";
import { patchEmployee } from "@/app/_utils/utility";
import { fetchEmployee } from "@/app/_utils/utility";



export default function Bell() {
    const [allOrs, setAllOrs] = useState<OrderRequisition[] | null>(null);
    const [visible, setVisible] = useState(false);
    const { currentEmployee } = useInventory();

    useEffect(() => {
        async function retrieveRequisition() {
        try {
            await fetchOrderRequisitions(setAllOrs);
        } catch (error) {
            console.log(error);
        }
        };
        retrieveRequisition();
        console.log(allOrs);
            
    }, []);

    //const sortedOrs = allOrs?.sort((a,b) => {return new Date(a.requisitionDate) - Number(b.requisitionDate)})
    const sortedOrs = allOrs?.sort((a, b) => {
        const dateA = new Date(a.requisitionDate);
        const dateB = new Date(b.requisitionDate);
        //convert to false boolean if date field is null
        const isValidDateA = !isNaN(dateA.getTime());
        const isValidDateB = !isNaN(dateB.getTime());
    
        // Both dates invalid they are equal
        if (!isValidDateA && !isValidDateB) return 0; 
    
        // Only 'a' date invalid, return 1, B is shifted toward start of array
        if (!isValidDateA) return 1; 
    
        // Only 'b' date invalid,  return -1, A is shifted toward start of array
        if (!isValidDateB) return -1; 
    
        // if a and b are not the same, is A active true? then move A toward start of array else move b
        if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1;
        }
    
        // Sort by date, most recent first
        // if b-a is positive, move b towards start of array
        // if b-a is negative, move a towards start of array
        // if b-a is 0, neither move
        return dateB.getTime() - dateA.getTime();
    });

    // take only the first five requisition and put in a new array
    const ReqIdArr5 = sortedOrs?.slice(0,5) || [];
    //use map function to take reqids only and put in a new array
    function mapReqId (orderrequisitions: OrderRequisition[]): string[]{
    return orderrequisitions.map(emp => emp.requisitionId);
    }
    //use map function to take reqids only and put in a new array
    let newReqIdArr5 = mapReqId(ReqIdArr5);

    const updatedEmployee = {
    notifications: newReqIdArr5
    };

    function toggle() {
    setVisible(false)
    }
 
    async function clickBell () {
        console.log("bell Clicked")
        if(currentEmployee){
        const response = await patchEmployee(currentEmployee?.employeeId, updatedEmployee)
        if(response.ok){
            setVisible(false);
        }
        }
      }

      useEffect(() => {
        const checkNotifications = async () => {
          if (currentEmployee?.employeeId) {
            try {
              const selectedEmployee = await fetchEmployee(currentEmployee.employeeId); // Fetch the employee data
      
              if (
                JSON.stringify(selectedEmployee.notifications) !==
                JSON.stringify(newReqIdArr5)
              ) {
                setVisible(true);
              }
            } catch (error) {
              console.error("Error fetching employee:", error);
            }
          }
        };
      
        checkNotifications();
      }, [currentEmployee, newReqIdArr5]);
      

    // useEffect(()=>{
        
    //     if(JSON.stringify(selectedEmployee.notifications) !== JSON.stringify(newReqIdArr5)){
    //         setVisible(true);
    //         }
    // },[])

    // function arraysEqual(arr1: string[], arr2: string[]) {
    //     if (arr1.length !== arr2.length) return false;
    //     for (let i = 0; i < arr1.length; i++) {
    //       if (arr1[i] !== arr2[i]) return false;
    //     }
    //     return true;
    //   }
      
    //   useEffect(() => {
    //     if (!arraysEqual(currentEmployee?.notifications || [], newReqIdArr5)) {
    //       setVisible(true);
    //       console.log(currentEmployee?.notifications);
    //       console.log(newReqIdArr5)
    //       //console.log(currentEmployee)
    //     }
    //   }, [currentEmployee, newReqIdArr5]);
    
    return (
        <>
            <Title className={classnames.Notifications}>
            <Menu position="bottom-end" shadow="md">
              <Menu.Target>
                  <Indicator  inline disabled={!visible} color="red" size={12}>
                  <IconBell onClick={clickBell} size={30} stroke={1.5}/>
                  </Indicator>      
              </Menu.Target>
              <Menu.Dropdown>
              <Menu.Label>Notifications</Menu.Label>
              
                {sortedOrs ? <> 
                <Menu.Item>
                    <Text>Requisition ID# {sortedOrs[0].requisitionId} has been created and is waiting approval!</Text>
                </Menu.Item>
                <Menu.Item>
                  <Text>Requisition ID# {sortedOrs[1].requisitionId} has been created and is waiting approval!</Text>
                </Menu.Item>
                <Menu.Item>
                  <Text>Requisition ID# {sortedOrs[2].requisitionId} has been created and is waiting approval!</Text>
                </Menu.Item>
                <Menu.Item>
                  <Text>Requisition ID# {sortedOrs[3].requisitionId} has been created and is waiting approval!</Text>
                </Menu.Item>
                <Menu.Item>
                  <Text>Requisition ID# {sortedOrs[4].requisitionId} has been created and is waiting approval!</Text>
                  </Menu.Item>
                  </> : <Text></Text> }
                  
                
              </Menu.Dropdown>
            </Menu>
          </Title>
          <Button style={{marginLeft: "15px"}} onClick={toggle}></Button>
        </>
    )

    
            // Create employee to update
            // if (currentEmployee){
            //     const updatedEmployee: EmployeeToEdit = {
            //         firstName: currentEmployee.firstName,
            //         lastName: currentEmployee.lastName,
            //         email: currentEmployee.email,
            //         phone: currentEmployee.phone,
            //         position: currentEmployee.position,
            //         department: currentEmployee.department,
            //         employeeLevel: currentEmployee.employeeLevel,
            //         employeeWorkId: currentEmployee.employeeWorkId,
            //         isActive: true,
            //         notifications: newReqIdArr5,
            //       };
            // }
}


