/* eslint-disable no-console */
'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Group, Select, Table, TableData, Text, TextInput } from '@mantine/core';
import { useInventory } from '@/app/_utils/inventory-context';
import {
  defaultItem,
  defaultRecurringOrderTemplateToEdit,
  Item,
  RecurringOrderTemplateToEdit,
} from '@/app/_utils/schema';
import CustomNotification from '@/components/CustomNotification/CustomNotification';
import TableDeleteBtn from '../TableDeleteBtn/TableDeleteBtn';
import classnames from './CreateRorTemplate.module.css';
import ImgModal from '../ImgModal/ImgModal';

export default function CreateRorTemplate() {
  const { inventory, supplierList, setRefresh, rorTemplates } = useInventory();

  const [searchValue, setSearchValue] = useState<string | null>('');
  const [templateName, setTemplateName] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Item>({ ...defaultItem });
  const [itemList, setItemList] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(<div />);
  const [modalStateTracker, setModalStateTracker] = useState<Record<string, boolean>>({});

  console.log(templateName, itemList);

  // Form Input Handling
  const handleTemplateNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTemplateName(event.target.value);
  };

  // Adding items to the template's item list
  const handleAddToItemList = () => {
    if (!selectedItem.itemId) {
      setNotificationMessage(
        CustomNotification(
          'error',
          'Error Encountered',
          'Item cannot be empty.',
          setShowNotification
        )
      );
      revealNotification();
    } else if (itemList.includes(selectedItem.itemId)) {
      setNotificationMessage(
        CustomNotification(
          'error',
          'Error Encountered',
          'Item has already been added to the template.',
          setShowNotification
        )
      );
      revealNotification();
    } else if (selectedItem.itemId && !itemList.includes(selectedItem.itemId)) {
      setItemList((prev) => [...prev, selectedItem.itemId]);
      setSearchValue('');
    }
  };

  // Deleting items from the template's item list
  const handleDeleteFromItemList = (itemId: string) => {
    setItemList((prev) => prev.filter((prevItem) => prevItem !== itemId));
  };

  // Function to persist created template to the database
  const handleCreateTemplate = async () => {
    if (templateName === '' || itemList.length <= 0) {
      setNotificationMessage(
        CustomNotification(
          'error',
          'Error Encountered',
          'Please fill up all required fields before submitting.',
          setShowNotification
        )
      );
    } else if (rorTemplates?.some((template) => template.templateName === templateName)) {
      setNotificationMessage(
        CustomNotification(
          'error',
          'Error Encountered',
          'Template name already exists',
          setShowNotification
        )
      );
    } else {
      // Else proceed with preparing the newTemplate to add
      const newRorTemplate: RecurringOrderTemplateToEdit = {
        ...defaultRecurringOrderTemplateToEdit,
        templateName,
        itemList,
      };

      // Create a request to add the newRorTemplate
      const request = new Request('/api/ror-templates', {
        method: 'POST',
        body: JSON.stringify(newRorTemplate),
      });

      try {
        // Fetch the request created
        const response = await fetch(request);

        // If it is successful provide feedback
        if (response.ok) {
          console.log('Success');
          setNotificationMessage(
            CustomNotification(
              'success',
              'ROR Template Submitted!',
              `ROR Template ${templateName} successfully submitted for approval.`,
              setShowNotification
            )
          );
        }

        // Trigger a refresh to retrieve updated inventory information
        setRefresh((prev: number) => prev + 1);

        // Reset fields
        setTemplateName('');
        setItemList([]);
      } catch (error) {
        console.log(error);
        CustomNotification(
          'error',
          'Error Encountered',
          'Unexpected Error encountered. Please try again.',
          setShowNotification
        );
      }
    }

    // Display any notification that triggered
    revealNotification();
  };

  // Function to reveal any triggered notification
  const revealNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Find item to search in inventory and set as selectedItem
  useEffect(() => {
    const matchedItem = inventory?.find((item) => item.itemId === searchValue);
    setSelectedItem(matchedItem || { ...defaultItem });
    setRefresh((prev: number) => prev + 1);
  }, [searchValue]);

  // Every time an ID is clicked this should run and set the state of modal visibility to the opposite of its previous value
  const toggleImgModalState = (itemId: string) => {
    setModalStateTracker((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };


  // Map through the list of item id's to retrieve data for the template table body
  const mappedItemList = itemList.map((itemId) => {
    const currentItem = inventory?.find((invItem) => invItem.itemId === itemId);
    const currentSupplier = supplierList?.find(
      (supplier) => supplier.supplierId === currentItem?.supplierId
    );
    return [
      <Text onClick={() => toggleImgModalState(itemId)} classNames={{root:classnames.imgModalID}}>{currentItem?.itemName}</Text>,
      currentItem?.category,
      currentItem?.supplyUnit,
      currentItem?.packageUnit,
      currentSupplier?.supplierName,
      <TableDeleteBtn itemId={currentItem?.itemId} handleDelete={handleDeleteFromItemList} />,
      <ImgModal item={currentItem} isOpened={!!modalStateTracker[itemId]} isClosed={() => setModalStateTracker((prev) => ({ ...prev, [itemId]: false }))} ></ImgModal>
    ];
  });

  // Table information (keys are caption, head and body)
  const tableData: TableData = {
    head: ['Item', 'Category', 'Unit of Measurement', 'Package Unit', 'Supplier', 'Remove'],
    body: mappedItemList,
  };

  return (
    <main className={classnames.rootMain}>
      <Group
        classNames={{
          root: classnames.rootOuterGroup,
        }}
      >
        <Group
          classNames={{
            root: classnames.rootGroup,
          }}
        >
          <Text
            classNames={{
              root: classnames.rootText,
            }}
          >
            Create ROR Template
          </Text>
          <TextInput
            label="Template Name"
            withAsterisk
            placeholder="Enter Template Name..."
            value={templateName}
            onChange={handleTemplateNameChange}
          />
          <Group
            classNames={{
              root: classnames.searchGroup,
            }}
          >
            <Select
              label="Add an Item"
              placeholder="Select an item from the list..."
              data={inventory?.map((item) => ({
                value: item.itemId,
                label: item.itemName,
              }))}
              allowDeselect
              searchable
              value={searchValue || null}
              onChange={setSearchValue}
              classNames={{
                root: classnames.selectRoot,
              }}
              size="sm"
              withAsterisk
            />
            <Button variant="filled" color="#1B4965" size="sm" onClick={handleAddToItemList}>
              +
            </Button>
          </Group>
          {itemList.length > 0 && (
            <Table striped classNames={{ table: classnames.rootTable }} data={tableData} />
          )}
        </Group>
        <Button
          classNames={{ root: classnames.submitButton }}
          variant="filled"
          color="#1B4965"
          size="md"
          onClick={handleCreateTemplate}
        >
          Create Template
        </Button>
      </Group>
      {showNotification && notificationMessage}
    </main>
  );
}
