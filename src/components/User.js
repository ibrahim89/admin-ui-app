import React, { useEffect, useState } from "react";
import { message } from "antd";
import { Button, Table, Modal, Form } from "react-bootstrap";
import UserService from "../services/UserService";
import Pagination from "../components/Pagination";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

export default function User() {
  const [searchVal, setSearchVal] = useState("");
  const [users, setUsers] = useState([]);
  const [tableFilter, setTableFilter] = useState([]);

  useEffect(() => {
    UserService.getUsers().then((res) => {
      setUsers(res.data);
      setDataSource(res.data);
    });
  }, []);

  const [dataSource, setDataSource] = useState(users);

  const filterData = (e) => {
    if (e.target.value !== "") {
      setSearchVal(e.target.value);
      const filterTable = dataSource.filter((o) =>
        Object.keys(o).some((k) =>
          String(o[k]).toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
      console.log("filterTable", filterTable);
      setTableFilter([...filterTable]);
    } else {
      setSearchVal(e.target.value);
      setDataSource([...dataSource]);
    }
  };
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });
  const [deletePopup, setDeletePopup] = useState(false);
  const clearUser = () => {
    let user = {
      id: "",
      name: "",
      email: "",
      role: "",
    };
    setUser(user);
  };
  const [show, setShow] = useState(false);
  const [action, setAction] = useState("ADD");

  const handleClose = () => {
    setShow(false);
    setAction("EDIT");
    clearUser();
  };

 

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("user", value);
    setUser({
      ...user,
      [name]: value,
    });
  };

  /** USER CRUD START */
  const editUser = (user) => {
    console.log("obj", user);
    setAction("EDIT");
    setShow(true);
    setUser(user);
  };
  const saveUser = () => {
    console.log("user", user);
    if(searchVal.length >0){
    const newArr = tableFilter.map(obj => {
        if (obj.id === user.id) {
          return user;
        }
      
        return obj;
      });
     
      setTableFilter(newArr);
    }else{
      const newArr = dataSource.map(obj => {
        if (obj.id === user.id) {
          return user;
        }
      
        return obj;
      });
      
      setDataSource(newArr);
    }
   
    clearUser();

    if (action === "ADD") {
      message.success("User successfully saved");
    } else {
      message.success("User successfully updated");
    }

    setShow(false);
  };
  const deleteUser = () => {
    console.log("delete user", user);
    message.success("User successfully deleted");
    setDeletePopup(false);
    if(searchVal.length>0){
      setTableFilter(tableFilter.filter((e)=>{
         return e !== user;
      }));
    }else{
      setDataSource(
        dataSource.filter((e) => {
          return e !== user;
        })
      );
    }
    
  };
  const deleteConfirm = (user) => {
    setUser(user);
    setDeletePopup(true);
  };
  const [tempUser, setTempUser] = useState([]);

  const onItemCheck = (item) => {
    setTempUser([item, ...tempUser]);
  };

  const deleteAllUser = () => {
    console.log("tempUser", tempUser);
    const namesToDeleteSet = new Set(tempUser);
    if(searchVal.length>0){
      const newArr = tableFilter.filter((name) => {
        return !namesToDeleteSet.has(name);
      });
      setTableFilter(newArr);
    }else{
      const newArr = dataSource.filter((name) => {
        return !namesToDeleteSet.has(name);
      });
      setDataSource(newArr);
    }
   
    message.success("All Selected Users deleted successfully");
  };

  /** USER CRUD END */

 
  const deleteConfirmTemplate = (
    <>
      <Modal
        size="sm"
        show={deletePopup}
        onHide={() => setDeletePopup(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>Delete User</Modal.Header>
        <Modal.Body>
          <p>Are you sure to delete this User?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setDeletePopup(false);
            }}
          >
            No
          </Button>
          <Button variant="primary" size="sm" onClick={deleteUser}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
  const addUserForm = (
    <>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={user.name}
            onChange={(e) => handleChange(e)}
            placeholder="Enter Username"
          />
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
          <Form.Label>Mobile</Form.Label>
          <Form.Control
            type="text"
            name="role"
            value={user.role}
            onChange={handleChange}
            placeholder="Enter Mobile"
          />
        </Form.Group>
      </Form>
    </>
  );
  const editUserForm = (
    <>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={user.name}
            onChange={(e) => handleChange(e)}
            placeholder="Enter Username"
          />
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={user.email}
            onChange={(e) => handleChange(e)}
            placeholder="Enter email"
          />
          <Form.Label>Mobile</Form.Label>
          <Form.Control
            type="text"
            name="role"
            value={user.role}
            onChange={(e) => handleChange(e)}
            placeholder="Enter Mobile"
          />
        </Form.Group>
      </Form>
    </>
  );
  const userModal = (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {action === "ADD" ? "Add New User" : "Edit User"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{action === "ADD" ? addUserForm : editUserForm}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={saveUser}>
            {action === "ADD" ? "Save Changes" : "Update Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
  // Pagination Logic Start
  const [showPerPage, setShowPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    start: 0,
    end: showPerPage,
  });

  const onPaginationChange = (start, end) => {
    setPagination({ start: start, end: end });
  };
  // Pagination Logic End

  return (
    <>
      <div className="container mt-5">
        <div>
          <input
            type="text"
            class="form-control"
            placeholder="search.."
            value={searchVal}
            onChange={filterData}
          />
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {searchVal.length > 0
              ? tableFilter
                  .slice(pagination.start, pagination.end)
                  .map((obj) => {
                    return (
                      <tr key={obj.id}>
                        <td>
                        <input
                              type="checkbox"
                              class="custom-control-input"
                              onChange={(e) => onItemCheck(obj)}
                            />
                        </td>
                        <td>{obj.name}</td>
                        <td>{obj.email}</td>
                        <td>{obj.role}</td>
                        <td>
                          <Button variant="info" onClick={() => editUser(obj)}>
                            Edit
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            onClick={() => deleteConfirm(obj)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })
              : dataSource
                  .slice(pagination.start, pagination.end)
                  .map((obj) => {
                    return (
                      <tr key={obj.id}>
                        <td>
                          
                            <input
                              type="checkbox"
                              class="custom-control-input"
                              onChange={(e) => onItemCheck(obj)}
                            />
                          
                        </td>
                        <td>{obj.name}</td>
                        <td>{obj.email}</td>
                        <td>{obj.role}</td>
                        <td>
                          
                        <a href="#" className="btn text-dark"><i  className="fa fa-edit" onClick={() => editUser(obj)}></i></a> 
                         <a href="#" className="btn text-danger"><i className="fa fa-trash fa-lg"  onClick={() => deleteConfirm(obj)}></i></a>
                        </td>
                      </tr>
                    );
                  })}
          </tbody>
        </Table>
        
        <div className="row">
          <div className="col-3">
            <Button variant="danger" size="sm" onClick={deleteAllUser}>
              Deleted Selected
            </Button>
          </div>
          <div className="col-9">
          <Pagination
            showPerPage={showPerPage}
            onPaginationChange={onPaginationChange}
            total={
              searchVal.length > 0 ? tableFilter.length : dataSource.length
            }
          />
          </div>
         
        </div>
        {userModal}
        {deleteConfirmTemplate}
      </div>
    </>
  );
}
