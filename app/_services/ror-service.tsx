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
import { RecurringOrder, RecurringOrderToEdit } from '../_utils/schema';

export async function dbGetAllRecurringOrders() {
  try {
    const allRecurringOrdersReference = collection(db, 'ror');
    const allRecurringOrders = query(allRecurringOrdersReference);
    const querySnapshot = await getDocs(allRecurringOrders);
    const recurringOrderList: RecurringOrder[] = [];
    querySnapshot.forEach((doc: any) => {
      const recurringOrder = {
        rorId: doc.id,
        ...doc.data(),
      };
      recurringOrderList.push(recurringOrder);
    });
    return recurringOrderList;
  } catch (error) {
    return console.log(error);
  }
}

export async function dbAddRecurringOrder(recurringOrderObj: RecurringOrderToEdit) {
  try {
    const newRecurringOrderReference = collection(db, 'ror');
    await addDoc(newRecurringOrderReference, recurringOrderObj);
  } catch (error) {
    return console.log(error);
  }
}

export async function dbGetRecurringOrder(rorId: string) {
  try {
    const recurringOrderReference = doc(db, 'ror', rorId);

    const documentSnapshot = await getDoc(recurringOrderReference);

    if (!documentSnapshot.exists()) {
      console.log('This ROR does not exist in the database');
      return null;
    }

    const retrievedRecurringOrderObject = {
      rorId: documentSnapshot.id,
      ...documentSnapshot.data(),
    };

    console.log('ROR successfully retrieved');

    return retrievedRecurringOrderObject;
  } catch (error) {
    return console.log(`Error retrieving ROR: ${error}`);
  }
}

export async function dbUpdateRecurringOrder(
  rorId: string,
  updatedRecurringOrderObject: { [key: string]: any }
) {
  try {
    const recurringOrderReference = doc(db, 'ror', rorId);

    await updateDoc(recurringOrderReference, updatedRecurringOrderObject);

    console.log('ROR successfully updated');
  } catch (error) {
    return console.log(`Error updating ROR: ${error}`);
  }
}

export async function dbDeleteRecurringOrder(rorId: string) {
  try {
    const recurringOrderReference = doc(db, 'ror', rorId);

    await deleteDoc(recurringOrderReference);

    console.log('ROR successfully deleted');
  } catch (error) {
    return console.log(`Error deleting ROR: ${error}`);
  }
}
