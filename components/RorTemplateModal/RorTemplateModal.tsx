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
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useInventory } from '@/app/_utils/inventory-context';
import {
  defaultEmployee,
  RecurringOrderTemplate,
  Employee,
  rorTemplateModalProps,
} from '@/app/_utils/schema';
import { fetchEmployee, fetchRorTemplate } from '@/app/_utils/utility';
import ApprovalBadge from '../ApprovalBadge/ApprovalBadge';
import classnames from './RorTemplateModal.module.css';
import ImgModal from '../ImgModal/ImgModal';

export default function RorTemplateModal({
  recurringOrderTemplate,
  isOpened,
  isClosed,
  handleApprovalActivity,
}: rorTemplateModalProps) {
  const { currentEmployee, inventory, supplierList, setRefresh } = useInventory();

  const [opened, { open, close }] = useDisclosure(false);
  const [employee, setEmployee] = useState<Employee>({ ...defaultEmployee });
  const [approval, setApproval] = useState<boolean>(false);
  const [modalStateTracker, setModalStateTracker] = useState<Record<string, boolean>>({});


  const handleApproval = async (isApproved: boolean) => {
    try {
      if (recurringOrderTemplate) {
        
        const updatedTemplate = await fetchRorTemplate(recurringOrderTemplate.rorTemplateId);
  
        if (updatedTemplate) {
          handleApprovalActivity(
            "success",
            updatedTemplate.rorTemplateId,
            updatedTemplate.isTemplateApprovedE2 ? "APPROVED" : "REJECTED"
          );
        }
        setRefresh((prev: number) => prev + 1); 
      }
    } catch (error) {
      handleApprovalActivity(
        "error",
        recurringOrderTemplate?.rorTemplateId || "Unknown",
        isApproved ? "APPROVED" : "REJECTED"
      );
    }
    isClosed();
    close();
  };
  

  // Toggle image modal state
  const toggleImgModalState = (itemId: string) => {
    setModalStateTracker((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const [itemDetails, setItemDetails] = useState<Record<string, any>>({});


  useEffect(() => {
    const fetchItemDetails = async () => {
      if (recurringOrderTemplate?.itemList) {
        const itemsData: Record<string, any> = {};
  
        for (const itemId of recurringOrderTemplate.itemList) {
          const fetchedItem = inventory?.find((invItem) => invItem.itemId === itemId);
          if (fetchedItem) {
            itemsData[itemId] = fetchedItem;
          }
        }
        setItemDetails(itemsData);
      }
    };
  
    fetchItemDetails();
  }, [recurringOrderTemplate, inventory]);
  

  const mappedItemList = (recurringOrderTemplate?.itemList ?? []).map((itemId: string) => {
    const currentItem = itemDetails[itemId] || {};
    const currentSupplier = supplierList?.find((supplier) => supplier.supplierId === currentItem?.supplierId);
  
    return [
      <Text key={`item-${itemId}`} onClick={() => toggleImgModalState(itemId)}>
        {currentItem?.itemName ?? "Unknown Item"}
      </Text>,
      currentItem?.category ?? "N/A",
      currentItem?.supplyUnit ?? "N/A",
      currentItem?.packageUnit ?? "N/A",
      currentSupplier?.supplierName ?? "Unknown Supplier",
      <ImgModal
        key={`img-${itemId}`}
        item={currentItem}
        isOpened={!!modalStateTracker[itemId]}
        isClosed={() => setModalStateTracker((prev) => ({ ...prev, [itemId]: false }))}
      />,
    ];
  });
  

  // Table structure for item details
  const tableData: TableData = {
    caption: 'End of Order List',
    head: ['Item', 'Category', 'Unit of Measurement', 'Package Unit', 'Supplier'],
    body: mappedItemList,
  };


  return (
    <Modal
      centered
      opened={isOpened}
      onClose={isClosed}
      size="xl"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      {recurringOrderTemplate ? (
        <>
          <Text classNames={{ root: classnames.rootText }}>Recurring Order Template</Text>

          <SimpleGrid cols={2} classNames={{ root: classnames.rootSection }}>
            <TextInput disabled label="Template ID" value={recurringOrderTemplate.rorTemplateId} size="md" />
            <TextInput disabled label="Template Name" value={recurringOrderTemplate.templateName || "Unnamed Template"} size="md" />
          </SimpleGrid>
          <Table striped classNames={{ table: classnames.rootTable }} data={tableData} />
          <Text classNames={{ root: classnames.rootHeaderTxt }}>Approvals:</Text>
          <div className={classnames.approvalCardContainer}>
          <div className={classnames.approvalCard}>
            <Text classNames={{ root: classnames.rootHeaderTxt }}>E2 Approval Status:</Text>
            <ApprovalBadge 
            key={`approval-${recurringOrderTemplate.rorTemplateId}`} 
            isApproved={
              recurringOrderTemplate.isTemplateApprovedE2
            } 
            /> 
         </div>
         <div className={classnames.approvalCard}>
          <Text classNames={{ root: classnames.rootHeaderTxt }}>E3 Approval Status:</Text>
          <ApprovalBadge 
          key={`approval-${recurringOrderTemplate.rorTemplateId}`} 
          isApproved={
            recurringOrderTemplate.isTemplateApprovedE3
            } 
          /> 
        </div>  
        </div>      
      </>
      ) : (
        <Group classNames={{ root: classnames.loadingContainer }}>
          <img src="/assets/loading/Spin@1x-1.0s-200px-200px.gif" alt="Loading..." />
        </Group>
      )}

      {recurringOrderTemplate.approvalE2 !== true  && (
        <Group classNames={{ root: classnames.rootBtnArea }}>
          <Button
            classNames={{ root: classnames.rootBtn }}
            onClick={() => handleApproval(true)}
            color="#1B4965"
          >
            Approve
          </Button>
          <Button
            classNames={{ root: classnames.rootBtn }}
            onClick={() => handleApproval(false)}
            color="red"
          >
            Reject
          </Button>
        </Group>
      )}
    </Modal>
  );
}
