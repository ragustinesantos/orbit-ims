/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { OrderRequisition, RecurringOrder } from '@/app/_utils/schema';
import { fetchOrderRequisitions, fetchRecurringOrderRequisition } from '@/app/_utils/utility';
import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import RorModal from '@/components/RorModal/RorModal';

export default function CreateRorTemplatePage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [allOrs, setAllOrs] = useState<OrderRequisition[] | null>(null);
  const [ror, setRor] = useState<RecurringOrder | null>(null);
  const [or, setOr] = useState<OrderRequisition | null>(null);

  useEffect(() => {
    const retrieveRequisition = async () => {
      try {
        await fetchOrderRequisitions(setAllOrs);
        setRor(await fetchRecurringOrderRequisition('ziRRbCsr8jvKE93qXc2X'));
        const matchingOr = allOrs?.find((or) => or.requisitionTypeId === ror?.rorId);
        matchingOr && setOr(matchingOr);
      } catch (error) {
        console.log(error);
      }
    };

    retrieveRequisition();
  }, [open]);

  console.log(or);

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
        <RorModal
          opened={opened}
          close={close}
          recurringOrder={ror}
        />
        <Text onClick={open}>{ror?.rorId}</Text>
      </div>
    </main>
  );
}
