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
import { PurchaseOrder, PurchaseOrderToEdit } from '../_utils/schema';

export async function dbGetAllPurchaseOrders() {
  try {
    const allPurchaseOrdersReference = collection(db, 'purchase-orders');
    const allPurchaseOrders = query(allPurchaseOrdersReference);
    const querySnapshot = await getDocs(allPurchaseOrders);
    const purchaseOrderList: PurchaseOrder[] = [];
    querySnapshot.forEach((doc: any) => {
      const purchaseOrder = {
        purchaseOrderId: doc.id,
        ...doc.data(),
      };
      purchaseOrderList.push(purchaseOrder);
    });
    return purchaseOrderList;
  } catch (error) {
    return console.log(error);
  }
}

export async function dbAddPurchaseOrder(purchaseOrderObj: PurchaseOrderToEdit) {
  try {
    const newPurchaseOrderReference = collection(db, 'purchase-orders');
    const docRef = await addDoc(newPurchaseOrderReference, purchaseOrderObj);
    return docRef.id
  } catch (error) {
    return console.log(error);
  }
}

export async function dbGetPurchaseOrder(purchaseOrderId: string) {
  try {
    const purchaseReference = doc(db, 'purchase-orders', purchaseOrderId);

    const documentSnapshot = await getDoc(purchaseReference);

    if (!documentSnapshot.exists()) {
      console.log('This purchase order does not exist in the database');
      return null;
    }

    const retrievedPurchaseObject = {
      purchaseOrderId: documentSnapshot.id,
      ...documentSnapshot.data(),
    };

    console.log('Purchase Order successfully retrieved');

    return retrievedPurchaseObject;
  } catch (error) {
    return console.log(`Error retrieving purchase order: ${error}`);
  }
}

export async function dbUpdatePurchaseOrder(
  purchaseOrderId: string,
  updatedPurchaseOrderObject: { [key: string]: any }
) {
  try {
    const PurchaseOrderReference = doc(db, 'purchase-orders', purchaseOrderId);

    await updateDoc(PurchaseOrderReference, updatedPurchaseOrderObject);

    console.log('Purchase Order successfully updated');
  } catch (error) {
    return console.log(`Error updating purchase order: ${error}`);
  }
}

export async function dbDeletePurchaseOrder(purchaseOrderId: string) {
  try {
    const purchaseOrderReference = doc(db, 'purchase-orders', purchaseOrderId);

    await deleteDoc(purchaseOrderReference);

    console.log('Purchase Order successfully deleted');
  } catch (error) {
    return console.log(`Error deleting purchase order: ${error}`);
  }
}
