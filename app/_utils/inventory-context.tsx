/* eslint-disable no-console */
'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useUserAuth } from './auth-context';
import { Employee, Item, Supplier } from './schema';
import { fetchCategories, fetchEmployees, fetchInventory, fetchSuppliers } from './utility';

interface InventoryContextType {
  inventory: Item[] | null;
  categoryList: string[] | null;
  supplierList: Supplier[] | null;
  currentEmployee: Employee | null;
  setRefresh: (num: any) => void;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export const InventoryContextProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserAuth() || {};

  const [inventory, setInventory] = useState<Item[] | null>(null);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [categoryList, setCategoryList] = useState<string[] | null>(null);
  const [supplierList, setSupplierList] = useState<Supplier[] | null>(null);
  const [refresh, setRefresh] = useState<number>(0);

  console.log(currentEmployee);

  useEffect(() => {
    const retrieveEmployee = async () => {
      try {
        const employees = await fetchEmployees();
        const matchedEmployee = employees.find(
          (employee: Employee) => employee.email === user?.email
        );
        setCurrentEmployee(matchedEmployee);
      } catch (error) {
        console.log(error);
      }
    };

    retrieveEmployee();
  }, [user]);

  useEffect(() => {
    fetchInventory(setInventory);
    fetchSuppliers(setSupplierList);
    fetchCategories(setCategoryList);
  }, [refresh]);

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        categoryList,
        supplierList,
        setRefresh,
        currentEmployee,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryContext.Provider');
  }
  return context;
};
