import React, { useEffect, useState } from "react";
import { Modal, Form, InputGroup, ListGroup } from "react-bootstrap";
import { createPrivateChatRoom, searchUsers } from "../../services/ChatService";

const SearchPopup = ({ currentUser, show, handleClose, openChatRoom }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);

  useEffect(()=>{
    if (!show) {
      setPage(0);
    }
  }, [show])

  const handleInputChange = async (e) => {
    setPage(0);
    if (e.target.value.length === 0) {
      setSearchTerm("");
      setUsers([]);
      return;
    }
    setSearchTerm(e.target.value);
    const res = await searchUsers(e.target.value, page, size);
    setUsers(res);
  };

  const handleShowMore = async () => {
    const res = await searchUsers(searchTerm, page + 1, size);
    setPage(page + 1);
    setUsers([...users, ...res]);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Tìm người yêu</Modal.Title>
      </Modal.Header>
      <Modal.Body className="dark:bg-gray-800">
        <Form onSubmit={(e) => e.preventDefault()}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Thêm @ để tìm theo username"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </InputGroup>
        </Form>
        <ListGroup className="mt-3 dark:bg-gray-800 overflow-y-auto max-h-96">
          {users.length != 0 &&
            users && <span>Show more</span> &&
            users.map((user, index) => (
              <ListGroup.Item key={index}>
                <span onClick={(e)=>{
                    e.preventDefault();
                    openChatRoom(user.userId);
                }} className={`${currentUser.userId === user.userId ? "cursor-not-allowed" : "cursor-pointer "} d-flex hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded-lg dark:text-white dark:bg-gray-800`}>
                  <img
                    src={user.photoURL || "/assets/images/logo.png"}
                    alt="avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="position-relative top-1">
                    {user.fullName}
                  </span>
                </span>
              </ListGroup.Item>
            ))}
          {users.length != 0 && users && (
            <span
              className="dark:text-white text-center cursor-pointer"
              onClick={handleShowMore}
            >
              Xem thêm
            </span>
          )}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default SearchPopup;
