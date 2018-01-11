import React from 'react'
import { Modal } from 'semantic-ui-react'
import BugId from './BugId'

// this class displays a comment modal (used for both automation and user comments)
const BugIdModal = ({ id, heading, routeEndPoint, visible, onClose }) => (
    <Modal closeIcon={true} onClose={onClose} open={visible}>
        <Modal.Header>{heading}</Modal.Header>
        <Modal.Content scrolling>
            <Modal.Description>
                <BugId id={id} route={routeEndPoint}/>
            </Modal.Description>
        </Modal.Content>
    </Modal>
)

export default BugIdModal
