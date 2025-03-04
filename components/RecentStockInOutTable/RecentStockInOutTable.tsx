"use client";

import { Table, Title, Text } from "@mantine/core";
import classnames from "./RecentStockInOutTable.module.css";
import { useEffect, useState } from "react";
import { fetchStockInOrders, fetchStockOutOrders } from "@/app/_utils/utility";
import { useInventory } from "@/app/_utils/inventory-context";
import { StockInOrder, StockOutOrder } from "@/app/_utils/schema";
import ImgModal from "../ImgModal/ImgModal";

export default function RecentStockInOutTable() {
  const [stockInOrders, setStockInOrders] = useState<StockInOrder[]>([]);
  const [stockOutOrders, setStockOutOrders] = useState<StockOutOrder[]>([]);  
  const { inventory } = useInventory();

    const [showAllStockIn, setShowAllStockIn] = useState(false);
    const [showAllStockOut, setShowAllStockOut] = useState(false);
    const [modalStateTracker, setModalStateTracker] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchStockInOrders(setStockInOrders);
        fetchStockOutOrders(setStockOutOrders);
    }, []);

    
    const isRecent = (dateString: string) => {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7); 

        const orderDate = new Date(dateString);
        return orderDate >= sevenDaysAgo; 
    };


    const getItemDetails = (itemId: string) => {
        const foundItem = inventory?.find((item) => item.itemId === itemId);
        return {
            name: foundItem?.itemName || "Unknown Item",
            unit: foundItem?.supplyUnit || "N/A",
        };
    };

    // Every time an ID is clicked this should run and set the state of modal visibility to the opposite of its previous value
    const toggleImgModalState = (itemId: string) => {
        setModalStateTracker((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
        };

    // Stock In data in recent 7 days
    const recentStockInOrders = stockInOrders.filter((order) => isRecent(order.stockInDate));
    const stockInRows = (showAllStockIn ? recentStockInOrders : recentStockInOrders.slice(0, 3))
    .sort((a,b)=>new Date(b.stockInDate).getTime() - new Date(a.stockInDate).getTime())
    .map((stockInOrder) => {
        const { name, unit } = getItemDetails(stockInOrder.itemId);
        const picItem = inventory?.find((inv)=> inv.itemId === stockInOrder.itemId);
        return (
            <Table.Tr key={stockInOrder.stockInId}>
                <ImgModal item={picItem} isOpened={!!modalStateTracker[stockInOrder.itemId]} isClosed={() => setModalStateTracker((prev) => ({ ...prev, [stockInOrder.itemId]: false }))} ></ImgModal>
                <Table.Td>{stockInOrder.stockInId}</Table.Td>
                <Table.Td>{stockInOrder.stockInDate}</Table.Td>
                <Table.Td><Text onClick={() => toggleImgModalState(stockInOrder.itemId)} classNames={{root:classnames.imgModalID}}>{name}</Text></Table.Td>
                <Table.Td>{stockInOrder.stockInQuantity}</Table.Td>
                <Table.Td>{unit}</Table.Td>
                <Table.Td>{stockInOrder.receivedBy}</Table.Td>
            </Table.Tr>
        );
    });

    // Stock Out data in recent 7 days
    const recentStockOutOrders = stockOutOrders.filter((order) => isRecent(order.stockOutDate));
    const stockOutRows = (showAllStockOut ? recentStockOutOrders : recentStockOutOrders.slice(0, 3))
    .sort((a,b)=>new Date(b.stockOutDate).getTime() - new Date(a.stockOutDate).getTime())
    .map((stockOutOrder) => {
        const { name, unit } = getItemDetails(stockOutOrder.itemId);
        const picItem = inventory?.find((inv)=> inv.itemId === stockOutOrder.itemId);
        return (
            <Table.Tr key={stockOutOrder.stockOutId}>
                <ImgModal item={picItem} isOpened={!!modalStateTracker[stockOutOrder.itemId]} isClosed={() => setModalStateTracker((prev) => ({ ...prev, [stockOutOrder.itemId]: false }))} ></ImgModal>
                <Table.Td>{stockOutOrder.stockOutId}</Table.Td>
                <Table.Td>{stockOutOrder.stockOutDate}</Table.Td>
                <Table.Td><Text onClick={() => toggleImgModalState(stockOutOrder.itemId)} classNames={{root:classnames.imgModalID}}>{name}</Text></Table.Td>
                <Table.Td>{stockOutOrder.stockOutQuantity}</Table.Td>
                <Table.Td>{unit}</Table.Td>
                <Table.Td>{stockOutOrder.dispatchedBy}</Table.Td>
            </Table.Tr>
        );
    });

    return (
        <div style={{ margin: "auto", padding: "20px", borderRadius: "8px", overflowX: "auto", width: "90%"}}>
            <Title order={5} classNames={{ root: classnames.heading }}>
                Recent Stock In/Out (Last 7 Days)
            </Title>

            {/* Stock In Table */}
            <Table stickyHeader stickyHeaderOffset={50} horizontalSpacing="xl" verticalSpacing="lg" style={{ width: "100%" }} classNames={{ thead: classnames.thead, td: classnames.td }}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Stock In ID</Table.Th>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Item Name</Table.Th>
                        <Table.Th>Quantity</Table.Th>
                        <Table.Th>Unit</Table.Th>
                        <Table.Th>Received By</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{stockInRows}</Table.Tbody>
            </Table>

            {recentStockInOrders.length > 3 && (
                <Text
                    size="xs"
                    style={{ textAlign: "center", cursor: "pointer", color: "#1B4965", textDecoration: "underline", marginBottom: "25px" }}
                    onClick={() => setShowAllStockIn(!showAllStockIn)}
                >
                    {showAllStockIn ? "Show Less" : "View All"}
                </Text>
            )}

            {/* Stock Out Table */}
            <Table stickyHeader stickyHeaderOffset={50} horizontalSpacing="xl" verticalSpacing="lg" style={{ width: "100%" }} classNames={{ thead: classnames.thead, td: classnames.td }}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Stock Out ID</Table.Th>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Item Name</Table.Th>
                        <Table.Th>Quantity</Table.Th>
                        <Table.Th>Unit</Table.Th>
                        <Table.Th>Dispatched By</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{stockOutRows}</Table.Tbody>
            </Table>

            {recentStockOutOrders.length > 3 && (
                <Text
                    size="xs"
                    style={{ textAlign: "center", cursor: "pointer", color: "#1B4965", textDecoration: "underline", marginBottom: "25px" }}
                    onClick={() => setShowAllStockOut(!showAllStockOut)}
                >
                    {showAllStockOut ? "Show Less" : "View All"}
                </Text>
            )}
        </div>
    );
}
