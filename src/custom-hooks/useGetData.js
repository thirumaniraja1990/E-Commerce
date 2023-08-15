import React, { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { collection, onSnapshot, query } from "firebase/firestore";

const useGetData = (collectionName, whereCondition) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const collectionRef = collection(db, collectionName);

  useEffect(() => {
    const getData = async () => {
      let q = collectionRef; // Default to the whole collection
      if (whereCondition) {
        q = query(collectionRef, whereCondition); // If whereCondition is provided, use it
      }
      await onSnapshot(q, (snapshot) => {
        setData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setLoading(false);
      });
    };
    getData();
  }, [whereCondition]);

  return {
    data,
    loading,
  };
};

export default useGetData;
