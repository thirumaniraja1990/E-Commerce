import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  FormText,
  Button,
  Input,
} from "reactstrap";
import "../styles/dashboard.css";
import useGetData from "../custom-hooks/useGetData";
import { DatePicker } from "reactstrap-date-picker";
import { generateCSV } from "../custom-hooks/utils";
import DynamicPdfGenerator from "./PdfGenerate";

const Dashboard = () => {
  const { data: products } = useGetData("products");
  const { data: users } = useGetData("users");
  const { data: checkout } = useGetData("checkout");
  const [product, setProduct] = useState([]);
  const [pickupLocation, setPickupLocation] = useState("");

  useEffect(() => {
    setProduct([
      ...checkout.map((e) => {
        return {
          ...e,
          products: JSON.parse(e.products),
        };
      }),
    ]);

    const result = checkout
      .map((e) => {
        return {
          ...e,
          products: JSON.parse(e.products),
        };
      })
      .reduce((acc, obj) => {
        if (Array.isArray(obj.products)) {
          const productTotal = obj.products.reduce((sum, product) => {
            return sum + Number(product.price) * Number(product.quantity);
          }, 0);
          return acc + productTotal;
        }
        return acc;
      }, 0);
  }, [checkout]);

  const [fromDate, setFromDate] = useState(new Date().toISOString());
  const [toDate, setToDate] = useState(new Date().toISOString());

  const handleChangeDate = (name, value, formattedValue) => {
    if (name === "FROM") {
      setFromDate(value);
    } else {
      setToDate(value);
    }
  };
  return (
    <section>
      <Container>
        <Row>
          <Col className="lg-3">
            <div className="revenue__box">
              <h5>Total Sales</h5>
              <span>
                $
                {checkout
                  .map((e) => {
                    return {
                      ...e,
                      products: JSON.parse(e.products),
                    };
                  })
                  .reduce((acc, obj) => {
                    if (Array.isArray(obj.products)) {
                      const productTotal = obj.products.reduce(
                        (sum, product) => {
                          return (
                            sum +
                            Number(product.price) * Number(product.quantity)
                          );
                        },
                        0
                      );
                      return acc + productTotal;
                    }
                    return acc;
                  }, 0)
                  .toFixed(2)}
              </span>
            </div>
          </Col>
          <Col className="lg-3">
            <div className="order__box">
              <h5>Total Orders</h5>
              <span>{checkout.length}</span>
            </div>
          </Col>
          <Col className="lg-3">
            <div className="products__box">
              <h5>Total Products</h5>
              <span>{products.length}</span>
            </div>
          </Col>
          <Col className="lg-3">
            <div className="users__box">
              <h5>Total Users</h5>
              <span>{users.length}</span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="lg-3">
            <FormGroup>
              <Label>From</Label>
              <DatePicker
                id="example-datepicker"
                value={fromDate}
                onChange={(v, f) => handleChangeDate("FROM", v, f)}
              />
            </FormGroup>
          </Col>
          <Col className="lg-3">
            <FormGroup>
              <Label>To</Label>
              <DatePicker
                id="example-datepicker1"
                value={toDate}
                onChange={(v, f) => handleChangeDate("TO", v, f)}
              />
            </FormGroup>
          </Col>
          <Col className="lg-3" style={{ marginTop: "22px" }}>
            {/* <Input
              className="mx-2 my-2"
              required
              value={pickupLocation}
              type="select"
              placeholder="Select pickup location"
              style={{ width: "250px" }}
              onChange={(e) => setPickupLocation(e.target.value)}
            >
              <option>Select pickup location</option>

              <option>Franklin, Ohio</option>
              <option>Dayton, Ohio</option>
              <option>Columbus, Ohio</option>
              <option>Others</option>
            </Input> */}
          </Col>
        </Row>

        <Row>
          <DynamicPdfGenerator
            jsonData={{
              pickupLocation,
              products,
              checkout,
              fromDate,
              toDate,
            }}
          />
        </Row>
      </Container>
    </section>
  );
};

export default Dashboard;
