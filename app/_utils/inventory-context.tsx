/* eslint-disable no-console */
'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useUserAuth } from './auth-context';
import { Employee, Item, RecurringOrderTemplate, Supplier } from './schema';
import {
  fetchCategories,
  fetchEmployees,
  fetchInventory,
  fetchRorTemplates,
  fetchSuppliers,
} from './utility';

interface InventoryContextType {
  inventory: Item[] | null;
  categoryList: string[] | null;
  supplierList: Supplier[] | null;
  rorTemplates: RecurringOrderTemplate[] | null;
  currentEmployee: Employee | null;
  currentPage: string;
  currentSection: string;
  setRefresh: (num: any) => void;
  setCurrentPage: (page: string) => void;
  setCurrentSection: (section: string) => void;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export const InventoryContextProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserAuth() || {};

  const [inventory, setInventory] = useState<Item[] | null>([]);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [categoryList, setCategoryList] = useState<string[] | null>([]);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [refresh, setRefresh] = useState<number>(0);
  const [currentSection, setCurrentSection] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<string>('');
  const [rorTemplates, setRorTemplates] = useState<RecurringOrderTemplate[]>([]);

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
    fetchRorTemplates(setRorTemplates);
  }, [refresh]);

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        categoryList,
        supplierList,
        rorTemplates,
        setRefresh,
        currentEmployee,
        currentPage,
        setCurrentPage,
        currentSection,
        setCurrentSection,
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
