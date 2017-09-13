import React from 'react'
import { Modal } from 'semantic-ui-react'
import UserComments from './UserComments'

const CommentModal = ({ id, heading, routeEndPoint, visible, onClose }) => (
	<Modal closeIcon={true} onClose={onClose} open={visible}>
		<Modal.Header>{heading}</Modal.Header>
		<Modal.Content scrolling>
			<Modal.Description>
				<UserComments id={id} route={routeEndPoint}/>
			</Modal.Description>
		</Modal.Content>
	</Modal>
)

export default CommentModal
