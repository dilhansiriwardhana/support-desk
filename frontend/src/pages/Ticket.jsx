import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { getTicket, closeTicket } from "../features/tickets/ticketSlice"
import {getNotes, createNote, reset as noteReset} from '../features/notes/noteSlice'
import BackButton from "../components/BackButton"
import Spinner from "../components/Spinner"
import { toast } from "react-toastify"
import Modal from 'react-modal'
import NoteItem from '../components/NoteItem'
import {FaPlus} from 'react-icons/fa'


const customStyles = {
  content: {
    width: '600px',
    left: '50%',
    top: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    position: 'relative',
  },
}

Modal.setAppElement('#root')

function Ticket() {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [noteText, setNoteText] = useState('')


  const {ticket, isLoading, isSuccess, isError, message } = useSelector((state) => state.tickets)
  const {notes, isLoading: notesIsLoading } = useSelector((state) => state.notes)

  const params = useParams()
  const dispatch = useDispatch()
  const {ticketId} = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if(isError) {
        toast.error(message)
    }

    dispatch(getTicket(ticketId))
    dispatch(getNotes(ticketId))
    // eslint-disable-next-line
  }, [isError, message, ticketId])

  if(isLoading || notesIsLoading ) {
    return <Spinner />
  }

  if(isError) {
    return <h3>Something Went Wrong</h3>
  }

  const onTicketClose = (e) => {
    dispatch(closeTicket(ticketId))
    toast.success('Ticket Closed')
    navigate('/tickets')
  }

  //  open / close modal
  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  //  onNoteSubmit 
  const onNoteSubmit = (e) => {
    e.preventDefault()
    dispatch(createNote({noteText, ticketId}))
    closeModal()
  }
 

  return (
    <div className="ticket-page" >
        <header className="ticket-header">
            <BackButton url='/tickets' />
            <h2>
                Ticket ID: {ticket._id}
                <span className={`status status-${ticket.status}`} >
                    {ticket.status}
                </span>
            </h2>
            <h3>Date Submitted: {new Date(ticket.createdAt).toLocaleString('en-Us')} </h3>
            <h3>Product: {ticket.product}</h3>
            <hr/>
            <div className="ticket-desc">
                <h3>Description of Issue</h3>
                <p>{ticket.description}</p>
            </div>

            <h2>Notes</h2>
        </header>

        {ticket.status !== 'closed' && (
          <button onClick={openModal} className='btn'><FaPlus/>Add Note
          
          </button>
        )}

        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel='Add Note'>
          <h2>Add Note</h2>
          <button className='btn-close' onClick={closeModal} >X</button>
          <form onSubmit={onNoteSubmit} >
            <div className="form-group">
              <textarea name="noteText" id="noteText" className="form-control" placeholder="Note text" value={noteText} onChange={(e) => setNoteText(e.target.value)} ></textarea>
            </div>
            <div className="form-group">
              <button type="submit" className="btn">
                Submit
              </button>
            </div>
          </form>

        </Modal>

        {notes.map((note) => (
          <NoteItem key={note._id} note={note} />
        ))}

        {ticket.status !== 'closed' && (
            <button onClick={onTicketClose} className="btn btn-block btn-danger " >
                Close Ticket
            </button>
        )}
    </div>
  ) 
}

export default Ticket