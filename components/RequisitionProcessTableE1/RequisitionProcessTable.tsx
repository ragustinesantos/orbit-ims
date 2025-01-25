import { Group, Table, TableData, Title, Text } from "@mantine/core";
import classnames from "./RequisitionProcessTable.module.css";
import { useInventory } from "@/app/_utils/inventory-context";
import { OrderRequisition, RecurringOrder } from '@/app/_utils/schema';
import { fetchOrderRequisitions, fetchRecurringOrderRequisitions } from '@/app/_utils/utility';
import RorModal from '@/components/RorModal/RorModal';
import { useEffect, useState } from "react";
import ApprovalBadge from "../ApprovalBadge/ApprovalBadge";

export default function RequisitionProcessTable(){

  const { currentEmployee } = useInventory();

  if (currentEmployee?.employeeLevel === "SA" || currentEmployee?.employeeLevel === "IA") {
      return null;
  };
  
  const [modalStateTracker, setModalStateTracker] = useState<Record<string, boolean>>({});
  
    // Sample states to store sample data to generate modals from
    const [allOrs, setAllOrs] = useState<OrderRequisition[] | null>(null);
    const [allRor, setAllRor] = useState<RecurringOrder[] | null>(null);
  
    // Sample use effect to store order requisitions and ror's for mapping
    useEffect(() => {
      const retrieveRequisition = async () => {
        try {
          await fetchOrderRequisitions(setAllOrs);
          await fetchRecurringOrderRequisitions(setAllRor);
        } catch (error) {
          console.log(error);
        }
      };
  
      retrieveRequisition();
    }, []);
    

    const formatDate = (dateString:any) => {
      const date = new Date(dateString);
      return date.toLocaleString('en-us'); 
    };

    // Every time an ID is clicked this should run and set the state of modal visibility to the opposite of its previous value
    const toggleRorModalState = (rorId: string) => {
      setModalStateTracker((prev) => ({ ...prev, [rorId]: !prev[rorId] }));
    };
    
    
    // Map through the desired list and return components only for active requisitions
    const mappedRor = allRor?.map((ror) => {
      // Cross-reference and retrieve a matching order requisition based on the requisitionId stored in the ror
      const matchingOr = allOrs?.find((or) => or.requisitionTypeId === ror.rorId);
  
      // If the matching order requisition is active, generate a table line containing the modal
      if (matchingOr?.isActive) {
        return [
          <>
            {/* The modal accepts the current ror in the iteration for the details, 
            isOpened that sets the visibility of the modal and defaults as false, 
            isClosed to toggle the visibility back to false */}
            <RorModal
              recurringOrder={ror}
              isOpened={!!modalStateTracker[ror.rorId]}
              isClosed={() => setModalStateTracker((prev) => ({ ...prev, [ror.rorId]: false }))}
            />
            {/* When the ID text is clicked, this will toggle the state of the modal visibility. 
            The first time this is clicked for the said ror.rorId, 
            a key-value pair is created by toggle with the value of [ror.rorId]: !prev[rorId] if it cannot find [ror.rorId] (dynamic keys)*/}
            <Text onClick={() => toggleRorModalState(ror.rorId)} classNames={{root:classnames.tableID}}>{ror.rorId}</Text>
          </>,
          <Text>{currentEmployee?.firstName} {currentEmployee?.lastName}</Text>,
          <Text>{formatDate(matchingOr.requisitionDate)}</Text>,
          <ApprovalBadge isApproved={matchingOr.isApprovedP1} />
        ];
      }
  
      // Else return an empty line (array)
      return [];
    });
  
    // Sample table to contain line items that can generate the modal
    const RORTableData: TableData = {
      head: ['ROR ID', 'Submitter', 'Date Submit', 'Status'],
      body: mappedRor,
    };


  return(

    <div style={{ margin:'10px', padding: '20px', backgroundColor: '#f5f7fa', borderRadius: '8px' }}>
        <Title order={5} classNames={{ root:classnames.heading }}>
        Your Requisition Process
      </Title>
        
        <Group>
        {/** ROR process table for E1*/}    
        <Table striped data={RORTableData} />
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