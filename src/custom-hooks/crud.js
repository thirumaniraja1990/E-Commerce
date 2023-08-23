import { db } from "../firebase.config";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";

// Function to add a document to a collection
export const addDocument = async (collectionName, data) => {
  try {
    await addDoc(collection(db, collectionName), data);
    console.log("Success");
    return true;
  } catch (error) {
    console.log("Error adding document:", error);
    return false;
  }
};

// Function to update a document in a collection
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.log("Error updating document:", error);
    return false;
  }
};

// Function to delete a document from a collection
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.log("Error deleting document:", error);
    return false;
  }
};

// Function to retrieve all documents from a collection
export const getDocuments = async (
  collectionName,
  orderByField = null,
  orderByDirection = "asc"
) => {
  try {
    let querySnapshot;
    const collectionRef = collection(db, collectionName);

    if (orderByField) {
      const orderedCollection = query(
        collectionRef,
        orderBy(orderByField, orderByDirection)
      );
      querySnapshot = await getDocs(orderedCollection);
    } else {
      querySnapshot = await getDocs(collectionRef);
    }
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.log("Error getting documents:", error);
    return [];
  }
};
