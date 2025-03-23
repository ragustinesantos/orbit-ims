'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, Group, SimpleGrid, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useInventory } from '@/app/_utils/inventory-context';
import LowStockModal from '../LowStockModal/LowStockModal';
import classnames from './InventoryOverview.module.css';

export default function InventoryOverview() {
  //retrieve total stock from database
  const [totalItem, setTotalItem] = useState<number>(0);
  const [lowStock, setLowStock] = useState<number>(0);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [supplierData, setSupplierData] = useState<any[]>([]);

  const { inventory, supplierList, setCurrentSection } = useInventory();
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  //total item
  useEffect(() => {
    const itemSum = inventory?.length || 0; // using temporary variable to store the total item count
    setTotalItem(itemSum); // update totalStock
  }, [inventory]); //when inventory change, recalculate totalStock

  useEffect(() => {
    let lowStockSum = 0;
    for (const item of inventory || []) {
      if (item.currentStockInStoreRoom < item.isCriticalThreshold) {
        lowStockSum++;
      }
    }
    setLowStock(lowStockSum); // update low stock number
  }, [inventory]);

  useEffect(() => {
    setCurrentSection('Dashboard');
  }, []);

  // Calculate category distribution
  useEffect(() => {
    if (!inventory) {
      return;
    }

    const categoryMap: Record<string, number> = {};

    inventory.forEach((item) => {
      if (item.category) {
        categoryMap[item.category] = (categoryMap[item.category] || 0) + 1;
      }
    });

    // Convert category data into PieChart format
    const categoryChartData = Object.keys(categoryMap).map((category) => ({
      name: category,
      value: categoryMap[category],
      percentage: ((categoryMap[category] / inventory.length) * 100).toFixed(2), // Calculate percentage
    }));

    setCategoryData(categoryChartData);
  }, [inventory]);

  // Calculate supplier distribution
  useEffect(() => {
    if (!inventory || !supplierList) {
      return;
    }

    const supplierMap: Record<string, number> = {};
    inventory.forEach((item) => {
      const supplier =
        supplierList.find((s) => s.supplierId === item.supplierId)?.supplierName ||
        'Unknown Supplier';
      supplierMap[supplier] = (supplierMap[supplier] || 0) + 1;
    });

    const supplierChartData = Object.keys(supplierMap).map((supplier) => ({
      name: supplier,
      value: supplierMap[supplier],
    }));

    setSupplierData(supplierChartData);
  }, [inventory, supplierList]);

  // Pie Chart Data for Stock Distribution
  const pieData = [
    { name: 'Low Stock', value: lowStock },
    { name: 'In Stock', value: totalItem - lowStock },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#F39C12'];

  return (
    <Group classNames={{ root: classnames.container }}>
      <Title order={3} className={classnames.heading}>
        Inventory Overview
      </Title>

      <Group className={classnames.overviewContainer}>
        <SimpleGrid
          cols={{ base: 4, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
          className={classnames.grid}
        >
          <Group classNames={{ root: classnames.divContainer }}>
            <Card shadow="lg" radius="lg" withBorder className={classnames.cardContainer}>
              <Text
                size="md"
                className={classnames.cardText}
                onClick={() => router.push('/inventory/search-item')}
              >
                Total Items
              </Text>
              <Text size="xl" c="blue" fw={700} className={classnames.cardNumber}>
                {totalItem}
              </Text>
            </Card>

            <Card shadow="lg" radius="lg" withBorder className={classnames.cardContainer}>
              <Text size="md" className={classnames.cardText} onClick={open}>
                Low Stock
              </Text>
              <LowStockModal opened={opened} close={close} />
              <Text size="xl" c="blue" fw={700} className={classnames.cardNumber}>
                {lowStock}
              </Text>
            </Card>
          </Group>

          {/* Stock Distribution Pie Chart */}
          <Card className={classnames.chartCard}>
            <Text size="md" className={classnames.chartTitle}>
              Stock Distribution
            </Text>
            <ResponsiveContainer width="100%" height={300} minHeight={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="center" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Distribution Pie Chart */}
          <Card className={classnames.chartCard}>
            <Text size="md" className={classnames.chartTitle}>
              Category Distribution
            </Text>
            <ResponsiveContainer width="100%" height={300} minHeight={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="center" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Supplier Distribution Pie Chart */}
          <Card className={classnames.chartCard}>
            <Text size="md" className={classnames.chartTitle}>
              Supplier Distribution
            </Text>
            <ResponsiveContainer width="100%" height={300} minHeight={200}>
              <PieChart>
                <Pie
                  data={supplierData}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {supplierData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="vertical"
                  align="center"
                  verticalAlign="middle"
                  wrapperStyle={{ marginTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </SimpleGrid>
      </Group>
    </Group>
  );
}
