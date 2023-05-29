import React from "react";
import "./Footer.css";

import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/images/eco-logo.png";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="4" className="mb-4" md='6'>
            <div className="logo">
              <img src={logo} alt="logo" />
              <div>
                <h1 className="text-white">MSM Angadi </h1>
              </div>
            </div>
            <p className="footer__text mt-4">
              MSM Sweets, Savouries & Food Products started to bring authentic &
              native special items around Tamilnadu to USA residents. We started
              with group of friends in the year 2020.All the products are with
              no preservatives.
            </p>
          </Col>
          <Col lg="2" className="mb-4" md='3'>
            <div className="footer__quick-links">
              <h4 className="quick__links-title">Useful Links</h4>
              <ListGroup>
                <ListGroupItem className="ps-0 border-0">
                  <Link to="/shop">Shop</Link>
                </ListGroupItem>
                <ListGroupItem className="ps-0 border-0">
                  <Link to="/cart">Cart</Link>
                </ListGroupItem>
                <ListGroupItem className="ps-0 border-0">
                  <Link to="/login">Login</Link>
                </ListGroupItem>
                <ListGroupItem className="ps-0 border-0">
                  <Link to="#">Privacy Policy</Link>
                </ListGroupItem>
              </ListGroup>
            </div>
          </Col>
          <Col lg="3"className="mb-4" md='3'>
            <div className="footer__quick-links">
              <h4 className="quick__links-title">Location</h4>
              <ListGroup className="footer-contact">
                <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-2">
                  <span>
                    <i className="ri-map-pin-line"></i>
                  </span>
                  <p>
                    MSM Angadi LLC, 2772, Cleopatra Dr, Franklin, Ohio 45005,
                    USA
                  </p>
                </ListGroupItem>
                <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-2">
                <span>
                    <i className="ri-map-pin-line"></i>
                  </span>
                  <p>
                    2/486A South street,Sivan Nagar, Vinagar Colony,
                    Naranapuram, Sivakasi Tamilnadu - 626130, India
                  </p>
                </ListGroupItem>
              </ListGroup>
            </div>
          </Col>
          <Col lg="3"className="mb-4">
            <div className="footer__quick-links">
              <h4 className="quick__links-title">Contact</h4>
              <ListGroup className="footer-contact">
                <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-2">
                  <span>
                    {" "}
                    <i className="ri-phone-line"></i>{" "}
                  </span>
                  <p>USA +1 201 647 1716 </p>
                </ListGroupItem>
                <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-2">
                  <span>
                    {" "}
                    <i className="ri-phone-line"></i>{" "}
                  </span>
                  <p>India +91 82480 93484 </p>
                </ListGroupItem>
                <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-2">
                  <span>
                    {" "}
                    <i className="ri-mail-line"></i>
                  </span>
                  <p>msm.eangadi@gmail.com</p>
                </ListGroupItem>
              </ListGroup>
            </div>
          </Col>
          <Col lg="12">
            <p className="footer__copyright">
              Copyright {year} developed by eTAGers. All rights reserved
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
