"use client";

import React, { useState, useEffect } from "react";
import {Container,Text, Button, Select, Table, TextInput, Paper, Divider, Notification, Flex} from "@mantine/core";
import {
  fetchStockInOrders,
  fetchStockOutOrders,
  fetchInventory,
} from "@/app/_utils/utility";
import { Item, StockInOrder, StockOutOrder } from "@/app/_utils/schema";
import {BarChart, Bar, XAxis, YAxis,Tooltip, Legend, ResponsiveContainer} from "recharts";
import classes from "./GenerateReport.module.css";

export default function GenerateReport() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string | null>(null);
  const [stockInData, setStockInData] = useState<StockInOrder[]>([]);
  const [stockOutData, setStockOutData] = useState<StockOutOrder[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [groupBy, setGroupBy] = useState<string>("day");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ show: boolean; message: string; color: string }>({
    show: false,
    message: "",
    color: "red",
  });

  useEffect(() => {
    fetchInventory(setItems);
    fetchStockInOrders(setStockInData);
    fetchStockOutOrders(setStockOutData);
  }, []);

  useEffect(() => {
    if (selectedItem && startDate && endDate) {
      generateReport();
    }
  }, [selectedItem, startDate, endDate, groupBy]);

  const generateReport = () => {
    if (!selectedItem || !startDate || !endDate) {
      showNotification("⚠️ Please select an item and specify a valid date range.", "red");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredIn = stockInData.filter(
      (entry) =>
        entry.itemId === selectedItem &&
        entry.stockInDate &&
        new Date(entry.stockInDate) >= start &&
        new Date(entry.stockInDate) <= end
    );

    const filteredOut = stockOutData.filter(
      (entry) =>
        entry.itemId === selectedItem &&
        entry.stockOutDate &&
        new Date(entry.stockOutDate) >= start &&
        new Date(entry.stockOutDate) <= end
    );

    if (filteredIn.length === 0 && filteredOut.length === 0) {
      showNotification("⚠️ No stock in or stock out records found for the selected item and date range.", "yellow");
      return;
    }

    setFilteredData(aggregateData(filteredIn, filteredOut, groupBy));

    // Set selected item name
    const itemName = items.find((item) => item.itemId === selectedItem)?.itemName || "Unknown Item";
    setSelectedItemName(itemName);
  };

  const aggregateData = (stockIn: StockInOrder[], stockOut: StockOutOrder[], groupBy: string) => {
    const dataMap: {
      [key: string]: { date: string; stockIn: number; stockOut: number; netStockChange: number };
    } = {};

    stockIn.forEach((entry) => {
      const dateKey = getDateKey(entry.stockInDate, groupBy);
      if (!dataMap[dateKey]) {
        dataMap[dateKey] = { date: dateKey, stockIn: 0, stockOut: 0, netStockChange: 0 };
      }
      dataMap[dateKey].stockIn += entry.stockInQuantity;
    });

    stockOut.forEach((entry) => {
      const dateKey = getDateKey(entry.stockOutDate, groupBy);
      if (!dataMap[dateKey]) {
        dataMap[dateKey] = { date: dateKey, stockIn: 0, stockOut: 0, netStockChange: 0 };
      }
      dataMap[dateKey].stockOut += entry.stockOutQuantity;
    });

    // Calculate net stock change (Stock In - Stock Out)
    Object.keys(dataMap).forEach((key) => {
      dataMap[key].netStockChange = dataMap[key].stockIn - dataMap[key].stockOut;
    });

    return Object.values(dataMap).sort(
      (a, b) => new Date(a.date.split(" - ")[0]).getTime() - new Date(b.date.split(" - ")[0]).getTime()
    );
  };

  const getDateKey = (date: string, groupBy: string) => {
    const d = new Date(date);
  
    if (groupBy === "day") {
      return d.toISOString().split("T")[0]; 
    }
  
    if (groupBy === "week") {
      const startOfWeek = new Date(d);
      startOfWeek.setDate(d.getDate() - d.getDay() + 1); 
  
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); 
  
      return `${startOfWeek.toISOString().split("T")[0]} - ${endOfWeek.toISOString().split("T")[0]}`;
    }
  
    if (groupBy === "month") {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; 
    }
  
    return date;
  };

  const showNotification = (message: string, color: string) => {
    setNotification({ show: true, message, color });
    setTimeout(() => setNotification({ show: false, message: "", color: "red" }), 3000);
  };


  return (
    <Container className={classes.container}>
      <Text size="xl" className={classes.title}>
        Stock Movement Report
      </Text>

      <Paper withBorder shadow="sm" p="md" className={classes.paper}>
        <Flex direction="row" justify="space-between" gap="md">
          <Select label="Select Item" data={items.map((item) => ({ value: item.itemId, label: item.itemName }))} value={selectedItem} onChange={setSelectedItem} className={classes.select} />
          <TextInput label="From Date" value={startDate} onChange={(event) => setStartDate(event.target.value)} type="date" className={classes.input} />
          <TextInput label="To Date" value={endDate} onChange={(event) => setEndDate(event.target.value)} type="date" className={classes.input} />
          <Select label="Group By" data={[{ value: "day", label: "Daily" }, { value: "week", label: "Weekly" }, { value: "month", label: "Monthly" }]} value={groupBy} onChange={setGroupBy} className={classes.select} />
        </Flex>
        <Button mt="md" fullWidth onClick={generateReport} color="blue">
          Generate Report
        </Button>
      </Paper>

      {notification.show && <Notification color={notification.color} className={classes.notification}>{notification.message}</Notification>}

      {filteredData.length > 0 && (
        <>
          <Divider my="md" />
          <Text size="lg" mt="md">Report for: {selectedItemName}</Text>

          {/**recharts frame*/}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stockIn" fill="#1B4965" name="Stock In" />
              <Bar dataKey="stockOut" fill="#FF5733" name="Stock Out" />
              <Bar dataKey="netStockChange" fill="#82ca9d" name="Net Stock Change" />
            </BarChart>
          </ResponsiveContainer>

          <Table mt="md" className={classes.table}>
            <thead>
              <tr><th>Date</th><th>Stock In</th><th>Stock Out</th><th>Net Stock Change</th></tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}><td>{row.date}</td><td>{row.stockIn}</td><td>{row.stockOut}</td><td>{row.netStockChange}</td></tr>
              ))}
            </tbody>
          </Table>
          <Button
          mt="md"
          fullWidth
          color="blue"
          onClick={()=>window.print()}
        >
          Print
        </Button>
        </>
      )}
    </Container>
  );
}
