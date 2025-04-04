'use client';

import { Image, Modal, ScrollArea, Text } from '@mantine/core';
import { useInventory } from '@/app/_utils/inventory-context';
import { imgModalProps } from '@/app/_utils/schema';
import classnames from './ImgModal.module.css';

//Pass in either a
export default function ImgModal({ item, isOpened, isClosed, itemid }: imgModalProps) {
  const { inventory } = useInventory();
  //const [opened, { open, close }] = useDisclosure(false);

  const currentItem = inventory?.find((invItem) => invItem.itemId === item?.itemId);
  const currentId = inventory?.find((invItem) => invItem.itemId === itemid);

  //isOpened is a state variable, if its true the modal opens
  // onClose is called whenever we click the modal closed or click outside of it. it runs the funciton isClosed which could do many things. in our case
  // it sets the item to null and isOpened to false.
  return (
    <>
      <Modal
        centered
        opened={isOpened}
        onClose={isClosed}
        size="lg"
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <div className={classnames.imgdiv}>
          <div>
            <Image
              h={400}
              w="auto"
              fit="contain"
              radius="md"
              src={
                currentItem?.picurl || currentId?.picurl || '/assets/no_image/no_image_avail.png'
              }
            />
          </div>
          <Text>{currentItem?.itemName || currentId?.itemName}</Text>
        </div>
      </Modal>
    </>
  );
}
