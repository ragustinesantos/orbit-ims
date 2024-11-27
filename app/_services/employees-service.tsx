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
import { employee, employeeToEdit } from '../_utils/schema';

export async function dbGetAllEmployees() {
  try {
    const allEmployeesReference = collection(db, 'employees');
    const allEmployeesQuery = query(allEmployeesReference);
    const querySnapshot = await getDocs(allEmployeesQuery);
    const employeeList: employee[] = [];
    querySnapshot.forEach((doc: any) => {
      const employee = {
        id: doc.id,
        ...doc.data(),
      };
      employeeList.push(employee);
    });
    return employeeList;
  } catch (error) {
    return console.log(error);
  }
}

export async function dbAddEmployee(employeeObj: employeeToEdit) {
  try {
    const newEmployeeReference = collection(db, 'Employees');
    await addDoc(newEmployeeReference, employeeObj);
  } catch (error) {
    return console.log(error);
  }
}

export async function dbGetEmployee(employeeId: string) {
  try {
    const employeeReference = doc(db, 'employees', employeeId);

    const documentSnapshot = await getDoc(employeeReference);

    if (!documentSnapshot.exists()) {
      console.log('This employee does not exist in the database');
      return null;
    }

    console.log('Employee successfully retrieved');

    return documentSnapshot.data();
  } catch (error) {
    return console.log(`Error retrieving employee: ${error}`);
  }
}

export async function dbUpdateEmployee(
  employeeId: string,
  updatedEmployeeObject: { [key: string]: any }
) {
  try {
    const employeeReference = doc(db, 'employees', employeeId);

    await updateDoc(employeeReference, updatedEmployeeObject);

    console.log('Employee successfully updated');
  } catch (error) {
    return console.log(`Error updating employee: ${error}`);
  }
}

export async function dbDeleteEmployee(employeeId: string) {
  try {
    const employeeReference = doc(db, 'employees', employeeId);

    await deleteDoc(employeeReference);

    console.log('Employee successfully deleted');
  } catch (error) {
    return console.log(`Error deleting employee: ${error}`);
  }
}