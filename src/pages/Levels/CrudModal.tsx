import { FormEvent, useEffect, useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import PulsatingSpinner from "components/PulsatingSpinner";
import maxios from "utils/maxios";
import { Course, Cumulative, Grade } from "utils/types";
import { useAuth } from "context/AuthProvider";
import { nanoid } from "nanoid";

interface Props {
  createMode: boolean;
  setCourseUpdated: React.Dispatch<React.SetStateAction<number>>;
  crudModalVisible: boolean;
  setCrudModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  editedCourseDetails: Course | undefined;
  setEditedCourseDetails: React.Dispatch<
    React.SetStateAction<Course | undefined>
  >;
  selectedSemester: number;
  selectedLevel: number;
  setCumulative: React.Dispatch<
    React.SetStateAction<{
      semester: Cumulative;
      overall: Cumulative;
    }>
  >;
  updateCourseTable: (course: Course) => void;
}

function CrudModal({
  createMode,
  setCourseUpdated,
  crudModalVisible,
  setCrudModalVisible,
  editedCourseDetails,
  setEditedCourseDetails,
  selectedSemester,
  selectedLevel,
  setCumulative,
  updateCourseTable,
}: Props) {
  const defaultCourseDetails = {
    title: "",
    credit_load: 3,
    code: "",
    grade: "A",
  };
  const [courseAddedMessage, setCourseAddedMessage] = useState("");
  const [courseAdded, setCourseAdded] = useState(Math.random());

  const { authState } = useAuth();
  const { isAuthenticated } = authState;

  useEffect(() => {
    setCourseAddedMessage("Course Created, add another");
    const timeout = setTimeout(() => {
      setCourseAddedMessage("");
    }, 1500);

    return () => clearTimeout(timeout);
  }, [courseAdded]);

  const [courseDetails, setCourseDetails] = useState(defaultCourseDetails);
  const [loading, setLoading] = useState(false);
  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target as HTMLInputElement;
    if (createMode) {
      setCourseDetails({ ...courseDetails, [name]: value });
    } else {
      if (editedCourseDetails)
        setEditedCourseDetails({ ...editedCourseDetails, [name]: value });
    }
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (createMode) {
        // if (isAuthenticated) {
        const { data: course_res } = await maxios.post("/api/v1/courses", {
          ...courseDetails,
          semester: String(selectedSemester),
          level: String(selectedLevel),
        });

        updateCourseTable(course_res.course);
        setCumulative({
          overall: course_res.cumulative,
          semester: course_res.semester_cumulative,
        });
        // } else {
        // updateCourseTable({
        //   id: nanoid(),
        //   grade: courseDetails.grade as Grade,
        //   code: courseDetails.code,
        //   credit_load: courseDetails.credit_load,
        //   title: courseDetails.title,
        // });
        // }

        setCourseAdded(Math.random());
      } else {
        const { data: course_res } = await maxios.patch(
          `/api/v1/courses/${editedCourseDetails?.id}`,
          editedCourseDetails
        );
        setCourseUpdated(Math.random());
        setCumulative({
          overall: course_res.cumulative,
          semester: course_res.semester_cumulative,
        });
        setCrudModalVisible(false);
      }
      setCourseDetails(defaultCourseDetails);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Modal
      centered
      show={crudModalVisible}
      onHide={() => setCrudModalVisible(false)}
    >
      <Modal.Title className="p-3">
        {createMode ? "Add New Course" : "Update Course"}
      </Modal.Title>
      <span className="text-success text-center">{courseAddedMessage}</span>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Course Code</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={
                createMode ? courseDetails.code : editedCourseDetails?.code
              }
              name="code"
              required
              type="text"
              placeholder="e.g. MTH 320"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Course Title</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={
                createMode
                  ? courseDetails.title
                  : editedCourseDetails?.title || ""
              }
              name="title"
              type="text"
              placeholder="e.g. Everyday Mathematics"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Credit Load</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={
                createMode
                  ? courseDetails.credit_load
                  : editedCourseDetails?.credit_load
              }
              name="credit_load"
              as="select"
              required
            >
              {Array(10)
                .fill(0)
                .map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Grade</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={
                createMode ? courseDetails.grade : editedCourseDetails?.grade
              }
              name="grade"
              as="select"
              required
            >
              {["A", "B", "C", "D", "F"].map((letter, index) => (
                <option key={index} value={letter}>
                  {letter}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              <PulsatingSpinner loading={loading} />

              {createMode
                ? courseAddedMessage
                  ? courseAddedMessage
                  : "Add Course"
                : "Update Course"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CrudModal;
