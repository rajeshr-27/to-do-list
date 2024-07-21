import axios from "axios";
import React,{useEffect, useState} from "react";
import { Button, Card, Col, Container, Row, Table, Modal, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { getTask, getTasks } from "./api";
import { authUser } from "../redux/features/loginSlice";
import moment from "moment";
function Task() {
    const dispatch = useDispatch();
    const {token} = useSelector((state)=>state.user);
    const API_URL = process.env.REACT_APP_API_URL;
    const initialFrmData = {
        task:"",
        status:1
    }
    const [frmData, setFrmData] = useState(initialFrmData)
    const [tasks,setTasks] = useState('');
    const [show, setShow] = useState(false);

    const task_status = {
        1:'Pending',
        2:'Process',
        3:'Completed'
    }
    const handleClose = () => setShow(false);
    const handleShow =  async (id) =>{
        if(id) {
             const response = await getTask(token, id);
             if(response.status ===1){
                setFrmData(response.task);
             }
        }else {
            setFrmData(initialFrmData)
        }
        setShow(true);
    } 

    useEffect(()=> {

        const fetchTasks = async () => {
            const response = await getTasks(token);
            if(response.status === 1){
                setTasks(response.tasks);
            }
        }
        fetchTasks();

    },[])

    const handleChange = (e) => {
        const {name,value} = e.target;
        setFrmData({
            ...frmData,
            [name]:value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{

            try{
                let response; 
                if(frmData._id){
                    //Update Task
                    response = await axios.put(`${API_URL}/task/edit/${frmData._id}` , frmData,{
                        headers:{
                            Authorization: `Bearer ${token}`
                        }
                    });

                }else {
                    //create task
                    response = await axios.post(`${API_URL}/task/add` , frmData,{
                        headers:{
                            Authorization: `Bearer ${token}`
                        }
                    });
                }
                if(response){
                    alert(response.data.message);
                    setFrmData(initialFrmData)
                    const taskList = await getTasks(token);
                    if(taskList.status === 1){
                        setTasks(taskList.tasks);
                        //auth user update
                        dispatch(authUser(token))
                    }
                    setShow(false);
                }
            }catch(error){
                console.log(error)
            }
           
            

        }catch(error){
            alert(error.response.data.message);
        }
    }

    const formatDate = (date) => {
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
    return(
        <Container>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th colSpan={5} >Task List<Button onClick={() =>handleShow('')} variant="success float-end">Add Task</Button></th>
                                        </tr>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Task</th>
                                            <th>Status</th>
                                            <th>Created Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>{ tasks && 
                                            tasks.map((task_data, index) => (
                                                <tr className={(task_data.status == 3)? 'table-success':''} key={task_data._id}>
                                                    <td>{index+1}</td>
                                                    <td>{task_data.task}</td>
                                                    <td>{task_status[task_data.status]}</td>
                                                    <td>{formatDate(task_data.createdAt)}</td>
                                                    <td>
                                                        <Button onClick={() =>handleShow(task_data._id)} variant="primary">Edit</Button> 
                                                        
                                                        {(task_data.status == 3)? <> | <Button variant="danger">Delete</Button> </>:''}
                                                        
                                                    </td>
                                                </tr>
                                            ))
                                        }</tbody>
                                </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Task</Modal.Title>
                </Modal.Header>
                <Modal.Body> 
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Form.Group className="mb-3">
                        <Form.Label>Task *</Form.Label>
                        <Form.Control name="task" value={frmData.task} onChange={handleChange}  type="text" placeholder="Enter Task" required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Status *</Form.Label>
                        <Form.Select   name="status" value={frmData.status} onChange={handleChange} required>
                            <option value="">---Select Status---</option>
                            <option value="1">Pending</option> 
                            <option value="2">Process</option> 
                            <option value="3">Completed</option> 
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3 float-end">
                            <Button type="submit" variant="primary">Submit</Button>
                    </Form.Group>
                </Form>
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default Task;