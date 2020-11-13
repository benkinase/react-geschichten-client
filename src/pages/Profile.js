import React from "react";
import $ from "jquery";
import styled from "styled-components/macro";
import moment from "moment";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Row, Col, Modal, Button, Form } from "react-bootstrap";
import { StoryContext } from "../contexts/StoryContext";
const avatar = "http://www.nretnil.com/avatar/LawrenceEzekielAmos.png";

export default function Profile() {
  const { user, deleteUser, error, logoutUser, updateUser } = React.useContext(
    AuthContext
  );
  const { privateStories, getPrivateStories } = React.useContext(StoryContext);
  //create story
  const {
    saveStory,
    removeStory,
    error: addError,
    loading: addLoading,
  } = React.useContext(StoryContext);

  const [er, setEr] = React.useState("");
  const [story, setStory] = React.useState({
    id: "",
    title: "",
    content: "",
    status: "",
  });
  function validForm() {
    const validcontent = story.content.length > 10;
    const validtitle = story.title.length > 5;

    return validcontent && validtitle;
  }

  // save story
  async function handleSubmit(e) {
    e.preventDefault();
    const newStory = {
      _id: story.id,
      user: user._id,
      title: story.title,
      content: story.content,
      status: story.status,
    };

    try {
      if (!newStory) return false;
      saveStory(newStory);
      handleClose();
      setTimeout(function () {
        window.location.reload(false);
      }, 200);
    } catch (err) {
      setEr(err);
    }
  }

  // habndle story
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStory({ ...story, [name]: value });
  };

  $(document).ready(function () {
    $("*[data-max]").keyup(function () {
      let text_max = $(this).data("max");
      let text_length = $(this).val().length;
      let text_remaining = text_max - text_length;
      $(".char-max-alert").html(`${text_length}/${text_remaining}`);
    });
  });

  // create story
  const [username, setUsername] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [isShow, setisShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleShowUser = () => setisShow(true);
  const handleCloseUser = () => setisShow(false);

  // get story, load profile info
  React.useEffect(() => {
    if (user) {
      getPrivateStories(user?._id);
      setUsername(user.username);
    }

    return () => {};
  }, [user]);

  // handle profile edit
  const submitHandler = (e) => {
    e.preventDefault();
    updateUser(user?._id, { username });
    handleClose();
    setTimeout(function () {
      window.location.reload(false);
    }, 500);
  };

  //edit story
  const openModal = (story) => {
    setShow(true);
    setStory({
      id: story._id,
      title: story.title,
      content: story.content,
      status: story.status,
    });
  };
  return (
    <ProfileContainer className="mt-5 profile-page container">
      <div className="mt-2 profile ">
        <Row>
          <Col>
            <div className="shadow profile-left">
              <div className="profile-details">
                <div>
                  <img
                    src={user?.image ? user?.image : avatar}
                    alt="userImage"
                    className="profile-image"
                  />
                </div>
                <div className="user">
                  <p>Username: {user?.username}</p>
                  <p>Email: {user?.email}</p>
                  <p>Joined: {user?.date?.substring(0, 10)}</p>
                </div>
              </div>
              <span
                className="btn btn-danger mt-5"
                onClick={() => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#38778e",
                    cancelButtonColor: "#f10e8f",
                    confirmButtonText: "Yes, delete it!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      deleteUser(user._id);
                      logoutUser();
                      Swal.fire(
                        "Deleted!",
                        "Your account has been deleted.",
                        "success"
                      );
                    }
                    setTimeout(function () {
                      window.location.reload(false);
                    }, 300);
                  });
                }}
              >
                <i className="fas fa-trash"></i>
              </span>

              <span className="btn btn-success ml-2 mt-5">
                <i className="fas fa-pen"></i>
              </span>
              {isShow && (
                <div>
                  {error && <span className="text-danger">{error}</span>}
                  <Form onSubmit={submitHandler}>
                    <Form.Group controlId="username" bssize="large">
                      <Form.Control
                        autoFocus
                        required
                        className="mt-3"
                        type="text"
                        name="title"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </Form.Group>
                  </Form>

                  <Button variant="secondary " onClick={handleCloseUser}>
                    Close
                  </Button>
                  <Button
                    variant="info ml-2"
                    type="submit"
                    onClick={submitHandler}
                    className="text-blue"
                  >
                    Update
                  </Button>
                </div>
              )}
            </div>
          </Col>
          <Col>
            <div className=" profile-right shadow mb-5 ">
              <div className="profile-create">
                <button className=" create-btn h-25 mt-1  ">
                  <span onClick={handleShow}>Create Story</span>
                  <Modal show={show} onHide={handleClose} animation={true}>
                    <Modal.Header closeButton>
                      {er && <span className="text-danger">{er}</span>}
                      <Modal.Title>Story</Modal.Title>
                      {addLoading && <div>Loading...</div>}
                      {addError && (
                        <div className="yellow-text">{addError}</div>
                      )}
                    </Modal.Header>
                    <Modal.Body>
                      <Form className="container">
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Label>Status</Form.Label>
                          <Form.Control
                            as="select"
                            autoFocus
                            type="text"
                            name="status"
                            value={story.status}
                            onChange={handleChange}
                          >
                            <option disabled hidden value=""></option>
                            <option value="public">public</option>
                            <option value="private">private</option>
                          </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="email" bssize="large">
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            autoFocus
                            required
                            maxLength="20"
                            type="text"
                            name="title"
                            value={story.title}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group controlId="content" bssize="large">
                          <Form.Label>Content</Form.Label>
                          <span className="char-max-alert red-text ml-2"></span>
                          <Form.Control
                            as="textarea"
                            value={story.content}
                            onChange={handleChange}
                            type="text"
                            name="content"
                            required
                            maxLength="250"
                            data-max="250"
                          />
                        </Form.Group>
                      </Form>
                    </Modal.Body>

                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          handleClose();
                          setTimeout(function () {
                            window.location.reload(false);
                          }, 20);
                        }}
                      >
                        Close
                      </Button>
                      <Button
                        variant="info"
                        type="submit"
                        disabled={!validForm()}
                        onClick={handleSubmit}
                        className="text-blue"
                      >
                        {story.id ? "Update" : "Create"}
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </button>

                <span className="profile-search">
                  <div className="btn btn-outline-secondary mt-1 ">
                    {`Hallo, ${user?.username}`}
                  </div>
                </span>
              </div>
              {privateStories?.length === 0 ? (
                <p>You have no stories!</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>CreatedAt</th>
                      <th>Manage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {privateStories?.map((story) => (
                      <tr key={story._id}>
                        <td>
                          <Link
                            to={"/stories/" + story._id}
                            className="blue-text"
                          >
                            {story.title}
                          </Link>
                        </td>
                        <td>{story.status}</td>
                        <td>{moment(story.createdAt).fromNow()}</td>
                        <td>
                          <i
                            className="fas fa-pen mr-3"
                            onClick={() => openModal(story)}
                          ></i>

                          <i
                            className="fas fa-trash-alt"
                            onClick={() => {
                              Swal.fire({
                                height: 100,
                                title: `Sure to delete ${story?.title}?`,
                                text: "You won't be able to revert this!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#38778e",
                                cancelButtonColor: "#f10e8f",
                                confirmButtonText: "Yes, delete it!",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  removeStory(story._id);
                                  Swal.fire(
                                    "Deleted!",
                                    "The story has been deleted.",
                                    "success"
                                  );
                                }
                                setTimeout(function () {
                                  window.location.reload(false);
                                }, 200);
                              });
                            }}
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </ProfileContainer>
  );
}

const ProfileContainer = styled.div`
  /**profile*/
  .profile-page {
    background-color: white;
    color: var(--veryBlue);
  }
  .profile-right {
    min-height: 50vh;
    padding: 1rem;
    background-color: var(--profileBg);
  }
  .profile-left {
    background-color: var(--profileBg);
    padding: 1rem;
    max-height: 60vh;
    max-width: 400px;
    color: var(--mainDark);
  }

  .profile-details {
    display: grid;
    grid-template-columns: 1fr 2fr;
    place-items: center;
  }
  .profile-image {
    width: 120px;
    height: 130px;
    border-radius: 80px;
  }
  .profile-image:hover {
    opacity: 0.8;
  }

  .profile-create {
    display: flex;
    justify-content: space-between;
  }
  .create-btn {
    background: #cefa2e;
    outline: none;
    padding: 0.3rem;
    border: none;
    transition: var(--mainTransition);
    &:hover {
      background: #90f310;
    }
  }
  .table {
    margin-top: 1rem;
  }

  @media screen and (max-width: 1000px) {
    .profile-left {
      margin-bottom: 1rem;
      max-width: 500px;
    }
    .profile-create .modal {
      width: 400px;
    }
  }
`;
