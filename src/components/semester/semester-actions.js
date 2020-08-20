import React, { useState } from 'react'
import '../../css/semester-form-card.css'
import PopUp from '../pop-up';
import { handleUpdateSemesterDetails, deleteSemester } from '../../redux/actions/gpa';
import { connect } from 'react-redux'
import { disableScroll, revertScroll } from '../../redux/utility-functions';

const dispatch = {
  handleUpdateSemesterDetails,
  deleteSemester
}

function SemesterActions({ semesterid, levelid, semestername, handleUpdateSemesterDetails, deleteSemester }) {
  const [editPopup, setEditPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [name, setName] = useState(semestername);

  const closePopup = (id) => {
    if (id === 1) {
      setEditPopup(false)
    }
    else if (id === 2) {
      setDeletePopup(false)
    }
  }
  const className = {
    inner: 'popup-inner',
    closepopup: 'close-popup',
    closepopupcont: "close-popup-cont"
  }
  const handleUpdate = event => {
    event.preventDefault();
    if (name.trim().length !== 0) {
      handleUpdateSemesterDetails(name, semesterid, levelid);
      closePopup(1);
      revertScroll();
    }
  }
  const handleDelete = event => {
    const semester = event.target.parentNode.parentNode.parentNode.parentNode;
    const semesterid = semester.dataset.semesterid;
    const levelid = semester.dataset.levelid;
    deleteSemester(semesterid, levelid);
  }
  const handleChange = event => {
    setName(event.target.value)
  }
  const setPopUp = () => {
    if (editPopup) {
      return <PopUp
        semesterid={semesterid}
        levelid={levelid}
        closePopup={closePopup}
        id={1}
        className={className}
      >
        <h3>Edit semester details</h3>
        <form className="edit-semester-details-form">
          <label>
            <span>Semester Name</span>
            <input name="semester-name" onChange={handleChange} value={name} className="semester-details-name" placeholder="semester name" />
          </label>
          <div className="update-semester-details-cont">
            <button onClick={handleUpdate} className="update-semester-details">Update</button>
          </div>
        </form>
      </PopUp>
    }
    else if (deletePopup) {
      return <PopUp
        semesterid={semesterid}
        levelid={levelid}
        closePopup={closePopup}
        id={2}
        className={className}
      >
        <h3>Are you sure you want to delete this semester?</h3>
        <div className="delete-actions">
          <button onClick = {handleDelete} className="semester-button dab dab-yes">Yes delete this semester</button>
          <button onClick={() => closePopup(2)} className="semester-button dab dab-no">No, go back</button>
        </div>

      </PopUp>
    }
  }
  return (
    <div data-semesterid = {semesterid} data-levelid = {levelid} className="semester-actions">
      <button onClick={() => { setEditPopup(true); disableScroll() }} type="submit" className="semester-button edit-semester">Edit</button>
      {/* DO NOT DELTE THIS COMMENT */}
      {/* <button onClick={() => { setDeletePopup(true); disableScroll() }} className="semester-button delete-semester">Delete</button> */}
      {
        setPopUp()
      }
    </div>
  )
}

export default connect(null, dispatch)(SemesterActions);