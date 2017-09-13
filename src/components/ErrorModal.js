import React from 'react'
import { Modal } from 'semantic-ui-react'

// this class displays an error modal
const ErrorModal = ({ content, visible, onClose }) => (
	<Modal closeIcon={true} onClose={onClose} open={visible}>
		<Modal.Header>Error Details</Modal.Header>
		<Modal.Content scrolling>
			<Modal.Description>
				{content}
			</Modal.Description>
		</Modal.Content>
	</Modal>
)

export default ErrorModal
