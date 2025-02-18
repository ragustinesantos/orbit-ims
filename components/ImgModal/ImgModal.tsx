/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Group,
  Modal,
  ScrollArea,
  SimpleGrid,
  Table,
  TableData,
  Text,
  TextInput,
  Image
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { imgModalProps } from '@/app/_utils/schema';
import { useInventory } from '@/app/_utils/inventory-context';
import classnames from './ImgModal.module.css';

export default function ImgModal ({
      item,
      isOpened,
      isClosed,
    }: imgModalProps) {
    const {inventory, supplierList} = useInventory();
    const [opened, { open, close }] = useDisclosure(false);

    const currentItem = inventory?.find((invItem)=>(invItem.itemId === item.itemId));

    
    return (
        <>
        <Modal
        centered
        opened={isOpened}
        onClose={isClosed}
        size="xl"
        scrollAreaComponent={ScrollArea.Autosize}>
            <div className={classnames.imgdiv}>
                <div>
                    <Image
                        h={400}
                        w="auto"
                        fit="contain"
                        radius="md"
                        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
                    />
                    
                </div>
                <Text>{currentItem?.itemName}</Text>
            </div>
        </Modal>
        </>
    )
}