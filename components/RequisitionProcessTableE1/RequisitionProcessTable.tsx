/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { Group, Pagination, Table, Text } from '@mantine/core';
import { usePagination } from '@mantine/hooks';
import { useInventory } from '@/app/_utils/inventory-context';
import { Employee, OnDemandOrder, OrderRequisition, RecurringOrder } from '@/app/_utils/schema';
import {
  fetchEmployees,
  fetchOnDemandOrderRequisitions,
  fetchOrderRequisitions,
  fetchRecurringOrderRequisitions,
} from '@/app/_utils/utility';
import RorModal from '@/components/RorModal/RorModal';
import ApprovalBadge from '../ApprovalBadge/ApprovalBadge';
import OdorModal from '../OdorModal/OdorModal';
import classnames from './RequisitionProcessTable.module.css';

export default function RequisitionProcessTable() {
  const { currentEmployee } = useInventory();

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

  useEffect(() => {
    const sortRor = async () => {
      try {
        allRor?.sort((a, b) => {
          const matchingOrA = allOrs?.find((or) => or.requisitionTypeId === a.rorId);
          const matchingOrB = allOrs?.find((or) => or.requisitionTypeId === b.rorId);

          if (matchingOrA && matchingOrB) {
            return (
              new Date(matchingOrB.requisitionDate).getTime() -
              new Date(matchingOrA.requisitionDate).getTime()
            );
          }

          return 0;
        });
      } catch (error) {
        console.log(error);
      }
    };

    sortRor();
  }, [allRor]);

  useEffect(() => {
    const sortOdor = async () => {
      try {
        allOdor?.sort((a, b) => {
          const matchingOrA = allOrs?.find((or) => or.requisitionTypeId === a.odorId);
          const matchingOrB = allOrs?.find((or) => or.requisitionTypeId === b.odorId);

          if (matchingOrA && matchingOrB) {
            return (
              new Date(matchingOrB.requisitionDate).getTime() -
              new Date(matchingOrA.requisitionDate).getTime()
            );
          }

          return 0;
        });
      } catch (error) {
        console.log(error);
      }
    };

    sortOdor();
  }, [allOdor]);

  const formatDate = (dateString: any) => {
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

  // Determine if the employee only has `E1` level
  const isE1Only = Array.isArray(currentEmployee?.employeeLevel)
    ? currentEmployee.employeeLevel.includes('E1') && currentEmployee.employeeLevel.length === 1
    : currentEmployee?.employeeLevel === 'E1';

  // Filter requisitions based on `E1` level access
  const filteredOrs = isE1Only
    ? allOrs?.filter((or) => or.employeeId === currentEmployee?.employeeId)
    : allOrs;
  const filteredRor = isE1Only
    ? allRor?.filter((ror) => filteredOrs?.some((or) => or.requisitionTypeId === ror.rorId))
    : allRor;
  const filteredOdor = isE1Only
    ? allOdor?.filter((odor) => filteredOrs?.some((or) => or.requisitionTypeId === odor.odorId))
    : allOdor;

  // Map through the desired list and return components only for active requisitions
  const mappedRor = filteredRor?.map((ror) => {
    // Cross-reference and retrieve a matching order requisition based on the requisitionId stored in the ror
    const matchingOr = filteredOrs?.find((or) => or.requisitionTypeId === ror.rorId);
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
          <Text
            onClick={() => toggleRorModalState(ror.rorId)}
            classNames={{ root: classnames.rootTextId }}
          >
            {ror.rorId}
          </Text>
        </>,
        <Text>
          {matchingEmployee?.firstName} {matchingEmployee?.lastName}
        </Text>,
        <Text>{formatDate(matchingOr.requisitionDate)}</Text>,
        <ApprovalBadge isApproved={matchingOr.isApprovedP1} />,
      ];
    }

    // Else return an empty line (array)
    return [];
  });

  // Map through the desired list and return components only for active order requisitions
  const mappedOdor = filteredOdor?.map((odor) => {
    const matchingOr = filteredOrs?.find((or) => or.requisitionTypeId === odor.odorId);
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
          <Text
            onClick={() => toggleOdorModalState(odor.odorId)}
            classNames={{ root: classnames.rootTextId }}
          >
            {odor.odorId}
          </Text>
        </>,
        <Text>
          {matchingEmployee?.firstName} {matchingEmployee?.lastName}
        </Text>,
        <Text>{formatDate(matchingOr.requisitionDate)}</Text>,
        <ApprovalBadge isApproved={matchingOr.isApprovedP1} />,
      ];
    }

    // Else return an empty line (array)
    return [];
  });

  // Size or requisition pagination
  const requisitionSize = 5;

  // Clean mapped items to remove blank rows
  const cleanedMappedRor = (mappedRor ?? []).filter((row) => row.length > 0);
  const cleanedMappedOdor = (mappedOdor ?? []).filter((row) => row.length > 0);

  // Ror Pagination
  const rorTotalPages = Math.ceil((cleanedMappedRor ?? []).length / requisitionSize);
  const rorPagination = usePagination({ total: rorTotalPages, initialPage: 1 });
  const paginatedRor = (cleanedMappedRor ?? []).slice(
    (rorPagination.active - 1) * requisitionSize,
    rorPagination.active * requisitionSize
  );

  // ODOR Pagination
  const odorTotalPages = Math.ceil((cleanedMappedOdor ?? []).length / requisitionSize);
  const odorPagination = usePagination({ total: odorTotalPages, initialPage: 1 });
  const paginatedOdor = (cleanedMappedOdor ?? []).slice(
    (odorPagination.active - 1) * requisitionSize,
    odorPagination.active * requisitionSize
  );

  return (
    <div className={classnames.rootMain}>
      <Text classNames={{ root: classnames.heading }}>Order Requisition Process</Text>
      {allOdor && allOrs && allRor ? (
        <div className={classnames.rootTableGroup}>
          <Group className={classnames.rootPaginationGroupRequisition}>
            {/** ROR process table for E1*/}

            {/* Table Header */}
            <Table className={classnames.rootRequisitionTable} striped>
              <Table.Thead className={classnames.rootRequisitionThead}>
                <Table.Tr>
                  <Table.Th>ROR ID</Table.Th>
                  <Table.Th>Employee</Table.Th>
                  <Table.Th>Date Submitted</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedRor.length > 0 ? (
                  paginatedRor.map((row, index) => (
                    <Table.Tr key={index}>
                      {row.map((cell, i) => (
                        <Table.Td key={i} className={classnames.rootRequisitionTd}>
                          {cell}
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={4} className={classnames.noData}>
                      <Text>No recent stock change</Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>

            {cleanedMappedRor && (
              <Pagination
                value={rorPagination.active}
                onChange={rorPagination.setPage}
                total={rorTotalPages}
              />
            )}
          </Group>

          <Group className={classnames.rootPaginationGroupRequisition}>
            {/** ODOR process table for E1*/}

            <Table className={classnames.rootRequisitionTable} striped>
              {/* Table Header */}
              <Table.Thead className={classnames.rootRequisitionThead}>
                <Table.Tr>
                  <Table.Th>ODOR ID</Table.Th>
                  <Table.Th>Employee</Table.Th>
                  <Table.Th>Date Submitted</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              {/* Table Body */}
              <Table.Tbody>
                {paginatedOdor.length > 0 ? (
                  paginatedOdor.map((row, index) => (
                    <Table.Tr key={index}>
                      {row.map((cell, i) => (
                        <Table.Td key={i} className={classnames.rootRequisitionTd}>
                          {cell}
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={4} className={classnames.noData}>
                      <Text>No recent stock change</Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>

            {cleanedMappedOdor && (
              <Pagination
                value={odorPagination.active}
                onChange={odorPagination.setPage}
                total={odorTotalPages}
              />
            )}
          </Group>
        </div>
      ) : (
        <Group classNames={{ root: classnames.loadingContainer }}>
          <img src="/assets/loading/Spin@1x-1.0s-200px-200px.gif" alt="Loading..." />
        </Group>
      )}
    </div>
  );
}
