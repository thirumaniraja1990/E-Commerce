import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Button,
  Col,
  Input,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import logo from "../assets/images/Logo-Latest.jpeg";
import * as XLSX from "xlsx";

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

  const data = {};
  orderedData?.forEach((order) => {
    order.products?.forEach((product) => {
      const itemId = product.id;

      if (!data[itemId]) {
        data[itemId] = {
          itemName: product.productName,
          quantity: product.quantity,
          price: parseFloat(product.price),
        };
      } else {
        data[itemId].quantity += product.quantity;
      }
    });
  });

  const viewTableData = Object.values(data).map((item) => [
    item.itemName,
    item.quantity,
    item.price.toFixed(2),
    (item.quantity * item.price).toFixed(2),
  ]);
  const viewTotalPrice = viewTableData.reduce((total, item) => {
    return total + parseFloat(item[3]);
  }, 0);
  const viewTotalQuantity = viewTableData.reduce((total, item) => {
    return total + item[1];
  }, 0);
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
      doc.text(
        `Pickup Location: ${
          order.pickupLocation === "Others"
            ? "Others:" + order.otherAddress
            : order.pickupLocation
        }`,
        10,
        40
      );
      doc.text(`Country: ${order.country}`, 150, 20); // Adjust the Y position for Country
      doc.text(`Email: ${order.email}`, 150, 25); // Adjust the Y position for Email
      doc.text(`Mobile Number: ${order.phNo}`, 150, 30); // Adjust the Y position for Mobile Number
      if (order.orderedDate) {
        const orderedDateStr = order.orderedDate.toLocaleDateString(); // Format the date as needed
        doc.text(`Ordered Date: ${orderedDateStr}`, 150, 35); // Adjust the Y position for Ordered Date
      }

      // Create a table for products
      const tableData = order.products?.map((product) => [
        product.productName,
        product.description,
        product.shortDesc,
        product.price,
        product.quantity,
      ]);

      // Calculate the total price
      const totalPrice = order.products?.reduce((total, product) => {
        return total + parseFloat(product.price) * product.quantity;
      }, 0);

      // Add the "Total Price" row with colspan
      tableData?.push(["Total Price", "", "", totalPrice?.toFixed(2), ""]);
      doc.text("", 10, 120);

      doc.autoTable({
        head: [
          ["Product Name", "Description", "Short Desc", "Price", "Quantity"],
        ],
        body: tableData,
        startY: 45, // Adjust the Y position to avoid overlapping with the name
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
    orderedData?.forEach((order) => {
      order.products?.forEach((product) => {
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
      item.price?.toFixed(2),
      (item.quantity * item.price)?.toFixed(2),
    ]);

    const totalPrice = tableData.reduce((total, item) => {
      return total + parseFloat(item[3]);
    }, 0);
    const totalQuantity = tableData.reduce((total, item) => {
      return total + item[1];
    }, 0);
    tableData?.push(["Total Price", totalQuantity, "", totalPrice.toFixed(2)]); // Add total row

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
  const generatePickupLocationReport = () => {
    const doc = new jsPDF();
    const imgWidth = 15; // Adjust as needed
    const imgHeight = 15; // Adjust as needed
    const imgX = doc.internal.pageSize.width - imgWidth - 10; // 10 is the margin from the right
    const imgY = 10; // 10 is the margin from the top
    doc.addImage(logo, "jpeg", imgX, imgY, imgWidth, imgHeight);
    // const selectedLocationData = orderedData.filter((order) => {
    //   return order.pickupLocation === jsonData.pickupLocation;
    // });
    console.log(jsonData.pickupLocation);
    const pickupLocations = Array.from(
      new Set(orderedData.map((order) => order.pickupLocation))
    );

    pickupLocations.forEach((location) => {
      const locationOrders = orderedData.filter(
        (order) => order.pickupLocation === location
      );

      locationOrders.forEach((order, index) => {
        if (index > 0) {
          doc.addPage();
        }

        doc.setFontSize(6);
        doc.text(
          `Pickup Location Report from ${new Date(
            jsonData.fromDate
          ).toLocaleDateString()} to ${new Date(
            jsonData.toDate
          ).toLocaleDateString()}`,
          10,
          10
        );

        doc.text(
          `Pickup Location: ${
            location === "Others" ? "Others:" + order.otherAddress : location
          }`,
          10,
          20
        );

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text(`Name: ${order.name}`, 10, 37);

        const tableData = order.products?.map((product) => [
          product.productName,
          product.price,
          product.quantity,
        ]);

        doc.autoTable({
          head: [["Product Name", "Price", "Quantity"]],
          body: tableData,
          startY: 45,
        });
      });
    });

    doc.save(
      `Pickup_location_Report_${new Date(
        jsonData.fromDate
      ).toLocaleDateString()}_${new Date(
        jsonData.toDate
      ).toLocaleDateString()} .pdf`
    );
  };

  const [viewtable, setViewTable] = useState(false);

  const handleSubmit = () => {
    setViewTable(!viewtable);
  };
  const calculateTotalPrice = (products) => {
    return products?.reduce((total, product) => {
      return total + parseFloat(product.price) * product.quantity;
    }, 0);
  };
  const calculateTotalQuant = (products) => {
    return products?.reduce((total, product) => {
      return total + Number(product.quantity);
    }, 0);
  };
  const [activeTab, setActiveTab] = useState("1");

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const generatePickupLocationReportinExcel = () => {
    const workbook = XLSX.utils.book_new();

    const wsData = orderedData.reduce((accumulator, order) => {
      const orderRows = [
        [
          `Name: ${order?.name}`,
          `Mobile: ${order.phNo}`,
          `Email: ${order.email}`,
          `Ordered Date: ${new Date(order.orderedDate).getFullYear()} ${String(
            new Date(order.orderedDate).getMonth() + 1
          ).padStart(2, "0")} ${String(
            new Date(order.orderedDate).getDate()
          ).padStart(2, "0")}`,
        ],
        [
          `Address: ${order.address}, ${order.city}, ${order.country}, ${order.postalCode}`,
        ],
        [
          "Pick up location",
          order?.pickupLocation === "" ? "-" : order?.pickupLocation,
        ],
        [
          "",
          order?.pickupLocation === "Others"
            ? `(${order.otherAddress ?? "-"})`
            : "",
        ],
        ["Product Name", "Description", "Short Desc", "Price", "Quantity"],
      ];

      // Add product rows
      order.products.forEach((product) => {
        orderRows.push([
          product.productName,
          product.description,
          product.shortDesc,
          `$ ${product.price}`,
          product.quantity,
        ]);
      });

      orderRows.push([
        "Total",
        "",
        "",
        `$ ${calculateTotalPrice(order.products)?.toFixed(2)}`,
        calculateTotalQuant(order.products),
      ]);

      return [...accumulator, ...orderRows, []]; // Add an empty row between orders
    }, []);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(workbook, ws, "PickupLocationOrders");
    XLSX.writeFile(workbook, "pickuplocationorders.xlsx");
  };

  const generateSaleReportinExcel = () => {
    const wb = XLSX.utils.book_new();

    const wsData = orderedData.reduce((accumulator, order, index) => {
      const orderRows = [
        [
          `Name: ${order?.name}`,
          `Mobile: ${order.phNo}`,
          `Email: ${order.email}`,
        ],
        [
          `Address: ${order.address}, ${order.city}, ${order.country}, ${order.postalCode}`,
        ],
        [
          "Pick up location",
          order?.pickupLocation === "" ? "-" : order?.pickupLocation,
        ],
        [
          "",
          order?.pickupLocation === "Others"
            ? `(${order.otherAddress ?? "-"})`
            : "",
        ],
        ["Product Name", "Description", "Short Desc", "Price", "Quantity"],
        ...order.products.map((product) => [
          product.productName,
          product.description,
          product.shortDesc,
          `$ ${product.price}`,
          product.quantity,
        ]),
        [
          "Total",
          "",
          "",
          `$ ${calculateTotalPrice(order.products)?.toFixed(2)}`,
          calculateTotalQuant(order.products),
        ],
      ];

      return [...accumulator, ...orderRows, []]; // Add an empty row between orders
    }, []);

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    XLSX.utils.book_append_sheet(wb, ws, "SalesOrders");

    XLSX.writeFile(wb, "salesorders.xlsx");
  };

  const generateItemReportinExcel = () => {
    const wb = XLSX.utils.book_new();

    // Create worksheet data
    const wsData = [
      ["Item Name", "Quantity", "Price", "Total"],
      ...viewTableData.map((item) => [
        item[0],
        item[1],
        `$ ${item[2]}`,
        `$ ${item[3]}`,
      ]),
      ["Total", viewTotalQuantity, "", `$ ${viewTotalPrice.toFixed(2)}`],
    ];

    // Convert to worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "ItemData");

    // Save the workbook to a file
    XLSX.writeFile(wb, "item_wise_report.xlsx");
  };
  return (
    <div>
      <Button className="mx-2 my-2" onClick={() => handleSubmit()}>
        {!viewtable ? "View" : "Hide"}
      </Button>
      <Button onClick={generateAndDownloadPDF}>Download Sale Report</Button>
      <Button className="mx-2 my-2" onClick={generateItemReport}>
        Download Item Report
      </Button>

      <Button className="mx-2 my-2" onClick={generatePickupLocationReport}>
        Download Pickup Location Report
      </Button>

      <Button
        className="mx-2 my-2"
        onClick={generatePickupLocationReportinExcel}
      >
        Download Pickup Location Report in Excel
      </Button>

      <Button className="mx-2 my-2" onClick={generateSaleReportinExcel}>
        Download Sale Report in Excel
      </Button>
      <Button className="mx-2 my-2" onClick={generateItemReportinExcel}>
        Download Item Report in Excel
      </Button>

      {viewtable && (
        <>
          {" "}
          <Nav fill pills tabs children="my-2">
            <NavItem>
              <NavLink
                className={activeTab === "1" ? "active" : ""}
                onClick={() => toggleTab("1")}
                style={{ cursor: "pointer" }}
              >
                Sale wise
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                className={activeTab === "2" ? "active" : ""}
                onClick={() => toggleTab("2")}
              >
                Item wise
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Row>
                {orderedData.map((order, index) => (
                  <div key={index} className="order">
                    <table className="order-table">
                      <thead>
                        <tr>
                          <th colSpan="2">Name: {order?.name}</th>
                          <th colSpan="3">
                            Mobile: {order.phNo}, Email: {order.email}
                          </th>
                        </tr>
                        <tr>
                          <th colSpan="3">
                            Address: {order.address}, {order.city},{" "}
                            {order.country}, {order.postalCode}
                          </th>
                          <th colSpan="2">
                            Pick up location:{" "}
                            {order?.pickupLocation === ""
                              ? "-"
                              : order?.pickupLocation}{" "}
                            {order?.pickupLocation === "Others" &&
                              `(${order.otherAddress ?? "-"})`}
                          </th>
                        </tr>

                        <tr>
                          <th>Product Name</th>
                          <th>Description</th>
                          <th>Short Desc</th>
                          <th>Price</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order?.products?.map((product, productIndex) => (
                          <tr key={productIndex}>
                            <td>{product.productName}</td>
                            <td>{product.description}</td>
                            <td>{product.shortDesc}</td>
                            <td>$ {product.price}</td>
                            <td>{product.quantity}</td>
                          </tr>
                        ))}
                        <tr className="total-row">
                          <td colSpan="3">Total</td>
                          <td>
                            $ {calculateTotalPrice(order?.products)?.toFixed(2)}
                          </td>
                          <td>{calculateTotalQuant(order?.products)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewTableData.map((item, index) => (
                      <tr key={index}>
                        <td>{item[0]}</td>
                        <td>{item[1]}</td>
                        <td>$ {item[2]}</td>
                        <td>$ {item[3]}</td>
                      </tr>
                    ))}
                    <tr>
                      <td>Total</td>
                      <td>{viewTotalQuantity}</td>
                      <td></td>
                      <td>$ {viewTotalPrice.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </Row>
            </TabPane>
          </TabContent>
        </>
      )}
    </div>
  );
};

export default DynamicPdfGenerator;
