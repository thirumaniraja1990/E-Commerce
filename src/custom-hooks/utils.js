// utils/csvUtils.js

import { Timestamp } from "firebase/firestore";

const generateCSV = (fromDate, toDate, productData, checkoutData, users) => {
  const csvRows = [];

  // Add CSV header
  csvRows.push(["Date", "Username", "Total Price"]);
  // Filter checkout data based on the selected date range
  checkoutData = checkoutData.map((e) => {
    return {
      address: e.address,
      city: e.city,
      email: e.email,
      id: e.id,
      name: e.name,
      orderedDate: e.orderedDate,
      phNo: e.phNo,
      postalCode: e.postalCode,
      status: e.status,
      uid: e.uid,
      products: JSON.parse(e.products),
    };
  });
  const filteredCheckout = checkoutData.filter((item) => {
    const orderedDate = new Date(item.orderedDate.seconds * 1000); // Convert seconds to milliseconds
    return orderedDate >= new Date(fromDate) && orderedDate <= new Date(toDate);
  });

  // Iterate through filtered checkout data and generate CSV rows
  filteredCheckout.forEach((checkout) => {
    const checkoutDate = Timestamp.fromDate(
      new Date(checkout.orderedDate?.seconds * 1000)
    )
      .toDate()
      .toLocaleDateString();
    const user = users.find((u) => u.id === checkout.uid).displayName;
    const username = user ? user : "Unknown";
    const totalProductPrice = checkout.products.reduce((total, product) => {
      const selectedProduct = productData.find((p) => p.id === product.id);
      return (
        total + (selectedProduct ? selectedProduct.price * product.quantity : 0)
      );
    }, 0);

    csvRows.push([checkoutDate, username, totalProductPrice.toFixed(2)]);
  });

  // Convert CSV rows to CSV formatted string
  const csvContent = csvRows.map((row) => row.join(",")).join("\n");
  return csvContent;
};

export { generateCSV };
