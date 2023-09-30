import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "reactstrap";
import logo from "../assets/images/Logo-Latest.jpeg";

const DynamicPdfGenerator = ({ jsonData }) => {
  const orderedData = jsonData.checkout
    .map((e) => {
      return {
        ...e,
        products: JSON.parse(e.products),
        orderedDate: e.orderedDate ? e.orderedDate.toDate() : null,
      };
    })
    .sort((a, b) => {
      return a.orderedDate - b.orderedDate;
    })
    .filter((order) => {
      return (
        order.orderedDate &&
        order.orderedDate >= new Date(jsonData.fromDate) &&
        order.orderedDate <= new Date(jsonData.toDate)
      );
    });

  console.log("orderedData", orderedData);
  const generateAndDownloadPDF = () => {
    const doc = new jsPDF();
    const imgWidth = 15; // Adjust as needed
    const imgHeight = 15; // Adjust as needed
    const imgX = doc.internal.pageSize.width - imgWidth - 10; // 10 is the margin from the right
    const imgY = 10; // 10 is the margin from the top
    doc.addImage(logo, "jpeg", imgX, imgY, imgWidth, imgHeight);
    orderedData.forEach((order, index) => {
      if (index > 0) {
        doc.addPage();
      }
      doc.setFontSize(6); // Reduce the font size for Name
      doc.text(
        `Sale Report from ${new Date(
          jsonData.fromDate
        ).toLocaleDateString()} to ${new Date(
          jsonData.toDate
        ).toLocaleDateString()}`,
        10,
        10
      );

      // Create a container div with flex layout
      doc.setFontSize(8); // Reduce the font size for Name
      doc.setFont("helvetica", "bold");
      doc.text(`Name: ${order.name}`, 10, 20); // Name on the left

      // Create a separate container div for the address with smaller font size and manual positioning
      doc.setFontSize(8); // Reduce the font size for Address
      doc.setFont("helvetica", "normal");
      doc.text(`Address: ${order.address}`, 10, 25);
      doc.text(`City: ${order.city}`, 10, 30); // Adjust the Y position for City
      doc.text(`Pincode: ${order.postalCode}`, 10, 35); // Adjust the Y position for Pincode
      doc.text(`Country: ${order.country}`, 150, 20); // Adjust the Y position for Country
      doc.text(`Email: ${order.email}`, 150, 25); // Adjust the Y position for Email
      doc.text(`Mobile Number: ${order.phNo}`, 150, 30); // Adjust the Y position for Mobile Number
      if (order.orderedDate) {
        const orderedDateStr = order.orderedDate.toLocaleDateString(); // Format the date as needed
        doc.text(`Ordered Date: ${orderedDateStr}`, 150, 35); // Adjust the Y position for Ordered Date
      }

      // Create a table for products
      const tableData = order.products.map((product) => [
        product.productName,
        product.description,
        product.shortDesc,
        product.price,
        product.quantity,
      ]);

      // Calculate the total price
      const totalPrice = order.products.reduce((total, product) => {
        return total + parseFloat(product.price) * product.quantity;
      }, 0);

      // Add the "Total Price" row with colspan
      tableData.push(["Total Price", "", "", totalPrice.toFixed(2), ""]);
      doc.text("", 10, 120);

      doc.autoTable({
        head: [
          ["Product Name", "Description", "Short Desc", "Price", "Quantity"],
        ],
        body: tableData,
        startY: 40, // Adjust the Y position to avoid overlapping with the name
      });
    });

    doc.save(
      `Sale_Report_${new Date(
        jsonData.fromDate
      ).toLocaleDateString()}_${new Date(
        jsonData.toDate
      ).toLocaleDateString()} .pdf`
    );
  };
  const generateItemReport = () => {
    const doc = new jsPDF();
    const itemData = {};
    const imgWidth = 15; // Adjust as needed
    const imgHeight = 15; // Adjust as needed
    const imgX = doc.internal.pageSize.width - imgWidth - 10; // 10 is the margin from the right
    const imgY = 10; // 10 is the margin from the top
    doc.addImage(logo, "jpeg", imgX, imgY, imgWidth, imgHeight);
    orderedData.forEach((order) => {
      order.products.forEach((product) => {
        const itemId = product.id;

        if (!itemData[itemId]) {
          itemData[itemId] = {
            itemName: product.productName,
            quantity: product.quantity,
            price: parseFloat(product.price),
          };
        } else {
          itemData[itemId].quantity += product.quantity;
        }
      });
    });

    const tableData = Object.values(itemData).map((item) => [
      item.itemName,
      item.quantity,
      item.price.toFixed(2),
      (item.quantity * item.price).toFixed(2),
    ]);

    const totalPrice = tableData.reduce((total, item) => {
      return total + parseFloat(item[3]);
    }, 0);
    const totalQuantity = tableData.reduce((total, item) => {
      return total + item[1];
    }, 0);
    tableData.push(["Total Price", totalQuantity, "", totalPrice.toFixed(2)]); // Add total row

    doc.text(
      `Item Report from ${new Date(
        jsonData.fromDate
      ).toLocaleDateString()} to ${new Date(
        jsonData.toDate
      ).toLocaleDateString()}`,
      10,
      10
    );

    doc.text("", 10, 120);

    doc.autoTable({
      head: [["Item Name", "Sale Quantity", "Sale Price", "Sale Amount"]],
      body: tableData,
      startY: 25,
    });

    doc.save(
      `Item_Report_${new Date(
        jsonData.fromDate
      ).toLocaleDateString()}_${new Date(
        jsonData.toDate
      ).toLocaleDateString()} .pdf`
    );
  };

  return (
    <div>
      <Button onClick={generateAndDownloadPDF}>Download Sale Report</Button>
      <Button style={{ marginLeft: "10px" }} onClick={generateItemReport}>
        Download Item Report
      </Button>
    </div>
  );
};

export default DynamicPdfGenerator;
