import { Group, Table, Title } from "@mantine/core";
import classnames from "./RequisitionProcessTable.module.css";
import { useInventory } from "@/app/_utils/inventory-context";

export default function RequisitionProcessTable(){

  const { currentEmployee } = useInventory();

  if (currentEmployee?.employeeLevel === "SA" || currentEmployee?.employeeLevel === "IA") {
      return null;
  };
  
  return(
    
    <div style={{ margin:'10px', padding: '20px', backgroundColor: '#f5f7fa', borderRadius: '8px' }}>
        <Title order={5} classNames={{ root:classnames.heading }}>
        Your Requisition Process
      </Title>
        
        <Group>
        {/** ROR process table for E1*/}    
        <Table
        stickyHeader
        stickyHeaderOffset={60}
        horizontalSpacing="xl"
        verticalSpacing="lg"
        classNames={{
          thead: classnames.thead,
        }}
      >
        
        <Table.Thead>
          <Table.Tr>
            <Table.Th>RORID</Table.Th>
            <Table.Th>Submitter</Table.Th>
            <Table.Th>Date Submit</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody> </Table.Tbody>
      </Table>

      </Group>

      <Group>

     {/** ODOR process table for E1*/}    

      <Table
        stickyHeader
        stickyHeaderOffset={60}
        horizontalSpacing="xl"
        verticalSpacing="lg"
        classNames={{
          thead: classnames.thead,
          td: classnames.td,
        }}
      >
        
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ODORID</Table.Th>
            <Table.Th>Submitter</Table.Th>
            <Table.Th>Date Submit</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody> </Table.Tbody>
      </Table>

        </Group>

    </div>

    )};