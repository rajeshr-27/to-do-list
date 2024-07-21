import React, {useState} from "react";
import { Container,Row,Col,Card,Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;
    const [frmData,setFrmData] = useState({
        name:"",
        email:"",
        password:"",
        confirm_password:"",
        mobile_number:"",
        gender:"",
        country:"",
        state:"",
        city:"",
        photo:"",
        address:""
    });

    const handleChange = (e) => {
        const {name,value,files} = e.target;
        setFrmData({
            ...frmData,
            [name] : (files) ? files[0]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = new FormData();
        postData.append('photo', frmData.photo);
        postData.append('data', JSON.stringify(frmData));
        try{
            //create register
            const response = await axios.post(`${API_URL}/user/add`,postData);
            alert(response.data.message);
            navigate('/login',{replace:true})

        }catch(error){
            alert(error.response.data.message);
        }
    }
    return (
        <Container className="mt-5">
            <Row>
                <Col></Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Register</Card.Title>
                            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                <Form.Group className="mb-3">
                                    <Form.Label>Name *</Form.Label>
                                    <Form.Control name="name" value={frmData.name} onChange={handleChange} type="text" placeholder="Enter Name" required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email *</Form.Label>
                                    <Form.Control name="email" value={frmData.email} onChange={handleChange}  type="email" placeholder="Enter Email" required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password *</Form.Label>
                                    <Form.Control name="password" value={frmData.password} onChange={handleChange}  type="password" placeholder="Enter Password" required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm Password *</Form.Label>
                                    <Form.Control name="confirm_password" value={frmData.confirm_password} onChange={handleChange}  type="password" placeholder="Enter Confirm Password" required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mobile Nubmer *</Form.Label>
                                    <Form.Control  name="mobile_number" value={frmData.mobile_number} onChange={handleChange}  type="text" placeholder="Enter Mobile Number" required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Gender *</Form.Label>
                                    <Form.Select aria-label="Default select example" name="gender" value={frmData.gender} onChange={handleChange} >
                                        <option value="">---Select Gender---</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option> 
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Select aria-label="Default select example" name="country" value={frmData.country} onChange={handleChange}>
                                        <option value="">---Select Country---</option>
                                        <option value="India">India</option> 
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>State</Form.Label>
                                    <Form.Select aria-label="Default select example" name="state" value={frmData.state} onChange={handleChange}>
                                        <option value="">---Select State---</option>
                                        <option value="Tamilnadu">Tamilnadu</option> 
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>City</Form.Label>
                                    <Form.Select aria-label="Default select example" name="city" value={frmData.city} onChange={handleChange}>
                                        <option value="">---Select City---</option>
                                        <option value="Tamilnadu">Erode</option> 
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>Photo</Form.Label>
                                    <Form.Control type="file" name="photo"   onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control as="textarea" name="address" placeholder="Enter Address" value={frmData.address} onChange={handleChange} rows={3} />
                                </Form.Group>
                                <Form.Group className="mb-3 float-end">
                                     <Button type="submit" variant="primary">Register</Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}

export default Register;