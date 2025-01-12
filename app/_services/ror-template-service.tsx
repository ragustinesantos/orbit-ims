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
import { RecurringOrderTemplate, RecurringOrderTemplateToEdit } from '../_utils/schema';

export async function dbGetAllRorTemplates() {
  try {
    const allRorTemplatesReference = collection(db, 'ror-templates');
    const allRorTemplates = query(allRorTemplatesReference);
    const querySnapshot = await getDocs(allRorTemplates);
    const rorTemplateList: RecurringOrderTemplate[] = [];
    querySnapshot.forEach((doc: any) => {
      const rorTemplate = {
        rorTemplateId: doc.id,
        ...doc.data(),
      };
      rorTemplateList.push(rorTemplate);
    });
    return rorTemplateList;
  } catch (error) {
    return console.log(error);
  }
}

export async function dbAddRorTemplate(rorTemplateObj: RecurringOrderTemplateToEdit) {
  try {
    const newRorTemplateReference = collection(db, 'ror-templates');
    await addDoc(newRorTemplateReference, rorTemplateObj);
  } catch (error) {
    return console.log(error);
  }
}

export async function dbGetRorTemplate(rorId: string) {
  try {
    const rorTemplateReference = doc(db, 'ror', rorId);

    const documentSnapshot = await getDoc(rorTemplateReference);

    if (!documentSnapshot.exists()) {
      console.log('This ROR does not exist in the database');
      return null;
    }

    const retrievedRorTemplateObject = {
      rorTemplateId: documentSnapshot.id,
      ...documentSnapshot.data(),
    };

    console.log('ROR template successfully retrieved');

    return retrievedRorTemplateObject;
  } catch (error) {
    return console.log(`Error retrieving ROR template: ${error}`);
  }
}

export async function dbUpdateRorTemplate(
  rorTemplateId: string,
  updatedRorTemplateObject: { [key: string]: any }
) {
  try {
    const rorTemplateReference = doc(db, 'ror-templates', rorTemplateId);

    await updateDoc(rorTemplateReference, updatedRorTemplateObject);

    console.log('ROR template successfully updated');
  } catch (error) {
    return console.log(`Error updating ROR template: ${error}`);
  }
}

export async function dbDeleteRorTemplate(rorTemplateId: string) {
  try {
    const rorTemplateReference = doc(db, 'ror-templates', rorTemplateId);

    await deleteDoc(rorTemplateReference);

    console.log('ROR template successfully deleted');
  } catch (error) {
    return console.log(`Error deleting ROR template: ${error}`);
  }
}
