/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { Table, TableData, Text } from '@mantine/core';
import { OrderRequisition, RecurringOrder } from '@/app/_utils/schema';
import { fetchOrderRequisitions, fetchRecurringOrderRequisitions } from '@/app/_utils/utility';
import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import RorModal from '@/components/RorModal/RorModal';

export default function RorModalTestPage() {
  // Required State to Keep Track of all modal states
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
          <Text onClick={() => toggleRorModalState(ror.rorId)}>{ror.rorId}</Text>
        </>,
        'Something',
        'Something Else',
      ];
    }

    // Else return an empty line (array)
    return [];
  });

  // Sample table to contain line items that can generate the modal
  const tableData: TableData = {
    head: ['ROR ID', 'Something', 'Something Else'],
    body: mappedRor,
  };

  return (
    <main style={{ display: 'flex', width: '100vw' }}>
      <NavbarNested />
      <div
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          height: '100vh',
          padding: 32,
        }}
      >
        <Table striped data={tableData} />
      </div>
    </main>
  );
}
