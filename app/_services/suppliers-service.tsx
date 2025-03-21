/* eslint-disable no-console */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../_utils/firebase';
import { Supplier, SupplierToEdit } from '../_utils/schema';

export async function dbGetAllSuppliers() {
  try {
    const allSuppliersReference = collection(db, 'suppliers');
    const allSuppliersQuery = query(allSuppliersReference);
    const querySnapshot = await getDocs(allSuppliersQuery);
    const supplierList: Supplier[] = [];
    querySnapshot.forEach((doc: any) => {
      const supplier = {
        supplierId: doc.id,
        ...doc.data(),
      };
      supplierList.push(supplier);
    });
    return supplierList;
  } catch (error) {
    return console.log(error);
  }
}

export async function dbAddSupplier(supplierObj: SupplierToEdit) {
  try {
    const newSupplierReference = collection(db, 'suppliers');
    await addDoc(newSupplierReference, supplierObj);
  } catch (error) {
    return console.log(error);
  }
}

export async function dbGetSupplier(supplierId: string) {
  try {
    const supplierReference = doc(db, 'suppliers', supplierId);

    const documentSnapshot = await getDoc(supplierReference);

    if (!documentSnapshot.exists()) {
      console.log('This supplier does not exist in the database');
      return null;
    }

    const retrievedSupplierObject = { supplierId: documentSnapshot.id, ...documentSnapshot.data() };

    console.log('Supplier successfully retrieved');

    return retrievedSupplierObject;
  } catch (error) {
    return console.log(`Error retrieving supplier: ${error}`);
  }
}

export async function dbUpdateSupplier(
  supplierId: string,
  updatedSupplierObject: { [key: string]: any }
) {
  try {
    const supplierReference = doc(db, 'suppliers', supplierId);

    await updateDoc(supplierReference, updatedSupplierObject);

    console.log('Supplier successfully updated');
  } catch (error) {
    return console.log(`Error updating supplier: ${error}`);
  }
}

export async function dbDeleteSupplier(supplierId: string) {
  try {
    const supplierReference = doc(db, 'suppliers', supplierId);

    await deleteDoc(supplierReference);

    console.log('Supplier successfully deleted');
  } catch (error) {
    return console.log(`Error deleting supplier: ${error}`);
  }
}
