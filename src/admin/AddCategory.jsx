import React,{useState} from 'react';
import { Form, FormGroup, Container, Row, Col, Button, Input, Label, Table } from "reactstrap";
import { toast } from "react-toastify";
import { db, storage } from "../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import useGetData from '../custom-hooks/useGetData';
function AddCategory(props) {
    const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { data: category, loading: isLoad } = useGetData("category");

    const [payload, setPayload] = useState({
        category: ''
    })
  const addCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = await collection(db, "category");
        await addDoc(docRef, {
              categoryName: payload.category,
        });
      setLoading(false);
      toast.success("Category successfully added!");
      setPayload({
        category: ''
      })
    } catch (err) {
      setLoading(false);
      toast.error("Product not added!");
    }
  };

    return (
        <section>
      <Container>
        <Row>
          <Col lg="12">
            {loading ? (
              <h4 className="py-5">Loading.......</h4>
            ) : (
              <>
                <h4 className="mb-5">Add Category</h4>
                <Form onSubmit={addCategory}>
                <Container>
        <Row>
            <Col>
            <FormGroup>
    <Label for="category">
    Category
    </Label>
    <Input
      id="category"
      name="category"
      value={payload.category}
      onChange={(e) => setPayload({...payload, category: e.target.value})}
      placeholder="Category"
      type="text"
    />
  </FormGroup>
                    
                  </Col><Col>
                  <Button   color="primary" style={{marginTop: '30px'}} type="submit">
                    Add Category
                  </Button>
                  </Col></Row></Container>
                </Form>
              </>
            )}
          </Col>
        </Row>
        <Row>
        <Table hover responsive>
  <thead>
    <tr>
      <th>
        #
      </th>
      <th>
        Category Name
      </th>
      
    </tr>
  </thead>
  <tbody>
  {category.map((item,index) => (
      <tr>
      <th scope="row">
        {index+1}
      </th>
      <td>
        {item.categoryName}
      </td>
      
    </tr>
      ))}
  
    
   
  </tbody>
</Table>
        </Row>
      </Container>
    </section>
    );
}

export default AddCategory;