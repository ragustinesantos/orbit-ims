
export interface Item {
  itemId: string;
  supplierId: string;
  inventoryId: string;
  itemName: string;
  currentStockInStoreRoom: number;
  packageUnit: string;
  supplyUnit: string;
  category: string;
  isCritical: boolean;
  isCriticalThreshold: number;
  minPurchaseQty: number;
}

export interface ItemToEdit {
  supplierId: string;
  inventoryId: string;
  itemName: string;
  currentStockInStoreRoom: number;
  packageUnit: string;
  supplyUnit: string;
  category: string;
  isCritical: boolean;
  isCriticalThreshold: number;
  minPurchaseQty: number;
  [key: string]: any;
}

export const defaultItem: Item = {
  itemId: '',
  supplierId: '',
  inventoryId: '',
  itemName: '',
  currentStockInStoreRoom: 0,
  packageUnit: '',
  supplyUnit: '',
  category: '',
  isCritical: false,
  isCriticalThreshold: 0,
  minPurchaseQty: 0,
};

export interface Supplier {
  supplierId: string;
  supplierName: string;
  contactNumber: string;
  email: string;
  address: string;
}

export const defaultSupplier: Supplier = {
  supplierId: '',
  supplierName: '',
  contactNumber: '',
  email: '',
  address: '',
};

export interface SupplierToEdit {
  supplierName: string;
  contactNumber: string;
  email: string;
  address: string;
  [key: string]: any;
}

export interface Employee {
  employeeId: string;
  employeeWorkId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  password: string;
  employeeLevel: string;
}

export interface EmployeeToEdit {
  employeeWorkId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  password: string;
  employeeLevel: string;
  [key: string]: any;
}
