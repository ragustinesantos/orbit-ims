"use client"
import { Group, Table, TableData, Title, Text } from "@mantine/core";
import classnames from "./RequisitionProcessTable.module.css";
import { useInventory } from "@/app/_utils/inventory-context";
import { Employee, OnDemandOrder, OrderRequisition, RecurringOrder } from '@/app/_utils/schema';
import { fetchEmployees,fetchOnDemandOrderRequisitions, fetchOrderRequisitions, fetchRecurringOrderRequisitions } from '@/app/_utils/utility';
import RorModal from '@/components/RorModal/RorModal';
import OdorModal from "../OdorModal/OdorModal";
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
    const [allOdor, setAllOdor] = useState<OnDemandOrder[] | null>(null);
    const [employeeWithRequisitions, setEmployeeWithRequisitions] = useState<Employee[]>([]);
  
    // Sample use effect to store order requisitions and ror's for mapping
    useEffect(() => {
      const retrieveRequisition = async () => {
        try {
          await fetchOrderRequisitions(setAllOrs);
          await fetchRecurringOrderRequisitions(setAllRor);
          await fetchOnDemandOrderRequisitions(setAllOdor);
        } catch (error) {
          console.log(error);
        }
      };
  
      retrieveRequisition();
    }, []);
    
      // Retrieve employees with active requisitions
      useEffect(() => {
        const retrieveEmployeeWithReq = async () => {
          try {
            const employees = await fetchEmployees();
    
            // Map out Order Requisitions and return the employee with an active requisition that matches the query
            const matchingEmployees = allOrs
              ?.filter((or) => or.isActive)
              .map((or) => {
                return employees?.find((emp: Employee) => emp.employeeId === or.employeeId);
              });
    
            //Either provide a valid value or empty array to the setter
            setEmployeeWithRequisitions(matchingEmployees ?? []);
          } catch (error) {
            console.log(error);
          }
        };
    
        retrieveEmployeeWithReq();
      }, [allOrs]);

    const formatDate = (dateString:any) => {
      const date = new Date(dateString);
      return date.toLocaleString('en-us'); 
    };

    // Every time an ID is clicked this should run and set the state of modal visibility to the opposite of its previous value
    const toggleRorModalState = (rorId: string) => {
      setModalStateTracker((prev) => ({ ...prev, [rorId]: !prev[rorId] }));
    };

    const toggleOdorModalState = (odorId: string) => {
      setModalStateTracker((prev) => ({ ...prev, [odorId]: !prev[odorId] }));
    };
    
    
    // Map through the desired list and return components only for active requisitions
    const mappedRor = allRor?.map((ror) => {
      // Cross-reference and retrieve a matching order requisition based on the requisitionId stored in the ror
      const matchingOr = allOrs?.find((or) => or.requisitionTypeId === ror.rorId);
      const matchingEmployee = employeeWithRequisitions.find(
        (emp) => emp.employeeId === matchingOr?.employeeId
      );
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
          <Text>{matchingEmployee?.firstName} {matchingEmployee?.lastName}</Text>,
          <Text>{formatDate(matchingOr.requisitionDate)}</Text>,
          <ApprovalBadge isApproved={matchingOr.isApprovedP1} />
        ];
      }
  
      // Else return an empty line (array)
      return [];
    });

    // Map through the desired list and return components only for active order requisitions
    const mappedOdor = allOdor?.map((odor) => {
      const matchingOr = allOrs?.find((or) => or.requisitionTypeId === odor.odorId);
      const matchingEmployee = employeeWithRequisitions.find(
        (emp) => emp.employeeId === matchingOr?.employeeId
      );
      // If the order requisition is active, generate a table line
      if (matchingOr?.isActive) {
        // No modal implementation yet
        return [
          
          <>
          {/* The modal accepts the current ror in the iteration for the details, 
          isOpened that sets the visibility of the modal and defaults as false, 
          isClosed to toggle the visibility back to false */}
            <OdorModal
              onDemandOrder={odor}
              isOpened={!!modalStateTracker[odor.odorId]}
              isClosed={() => setModalStateTracker((prev) => ({ ...prev, [odor.odorId]: false }))}
            />
            {/* When the ID text is clicked, this will toggle the state of the modal visibility. 
            The first time this is clicked for the said ror.rorId, 
            a key-value pair is created by toggle with the value of [ror.rorId]: !prev[rorId] if it cannot find [ror.rorId] (dynamic keys)*/}
            <Text onClick={() => toggleOdorModalState(odor.odorId)} classNames={{root:classnames.tableID}}>{odor.odorId}</Text>
          </>,

          <Text>{matchingEmployee?.firstName} {matchingEmployee?.lastName}</Text>,
          <Text>{formatDate(matchingOr.requisitionDate)}</Text>,
          <ApprovalBadge isApproved={matchingOr.isApprovedP1} />
        ];
      }
    
      // Else return an empty line (array)
      return [];
    });
  
    // Sample table to contain line items that can generate the modal
    const RORTableData: TableData = {
      head: ['ROR ID', 'Submitter', 'Date Submitted', 'Status'],
      body: mappedRor,
    };

    const ODORTableData: TableData = {
      head: ['ODOR ID', 'Submitter', 'Date Submitted', 'Status'],
      body: mappedOdor,
    };


  return(

    <div style={{ margin:'auto', padding: '20px', borderRadius: '8px', overflowX:'auto'}}>
        <Title order={5} classNames={{ root:classnames.heading }}>
        Order Requisition Process
      </Title>
        
      <Group className={classnames.group}>
        {/** ROR process table for E1*/}    
        <Table className={classnames.table} striped data={RORTableData} style={{ minWidth: '600px' }}/>
      </Group>

      <Group className={classnames.group}>
        {/** ODOR process table for E1*/}    
        <Table className={classnames.table} striped data={ODORTableData} style={{ minWidth: '600px' }} />
      </Group>

    </div>
  
    )};