import React, {useState} from "react";
import { Container,Row,Col,Card,Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { clearError, clearMessage, loginUser } from "../redux/features/loginSlice";
import { useNavigate } from "react-router-dom";

function Login() {

    const {message,error} = useSelector((state)=> state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [frmData,setFrmData] = useState({
        email:"",
        password:"",
    });

    const handleChange = (e) => {
        const {name,value} = e.target;
        setFrmData({
            ...frmData,
            [name] : value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(frmData));
        
    }
    if(message){
        alert(message);
        dispatch(clearMessage());
        navigate('/task',  {replace:true});

    }
    if(error){
        alert(error);
        dispatch(clearError());
    }
    return (
        <Container className="mt-5">
            <Row>
                <Col></Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Login</Card.Title>
                            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                <Form.Group className="mb-3">
                                    <Form.Label>Email *</Form.Label>
                                    <Form.Control name="email" value={frmData.email} onChange={handleChange}  type="email" placeholder="Enter Email" required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password *</Form.Label>
                                    <Form.Control name="password" value={frmData.password} onChange={handleChange}  type="password" placeholder="Enter Password" required />
                                </Form.Group>
                                <Form.Group className="mb-3 float-end">
                                     <Button type="submit" variant="primary">Login</Button>
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

export default Login;