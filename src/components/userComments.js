import { Button, Comment, Divider, Form, Message } from 'semantic-ui-react'
import React, { Component } from 'react'
import $ from 'jquery'
import Moment from 'moment'


class ReactClass extends Component {
	constructor (props) {
		super(props)
	}

	render () {

	}
}

class UserComments extends Component {
	constructor (props) {
		super(props)
		this.state = {
			comments: [],
			id: this.props.id,
			route: this.props.route,
			commentButtonLoading: false,
			errorHidden: true,
			formAuthor: '',
			formText: '',
		}
		this.formSubmitHandler = this.formSubmitHandler.bind(this)
		this.fetchData = this.fetchData.bind(this)
	}

	fetchData () {
		$.get('/db/' + this.state.route + '/' + this.state.id)
			.done(comments => {
				this.setState({ comments })
			})
			.fail(err => {
				console.log(err)
			})
	}

	formSubmitHandler (e) {
		e.preventDefault()
		this.setState({ commentButtonLoading: true })
		$.ajax({
			url: '/db/' + this.state.route + '/' + this.state.id,
			method: 'PUT',
			data: {
				author: this.state.formAuthor,
				text: this.state.formText,
			},
		})
			.then(() => {
				this.fetchData()
				this.setState({
					formAuthor: '',
					formText: '',
					errorHidden: true,
					commentButtonLoading: false,
				})
			})
			.fail(() => {
				this.fetchData()
				this.setState({
					errorHidden: false,
					commentButtonLoading: false,
				})
			})
	}

	componentDidMount () {
		this.fetchData()
	}

	render () {
		var commentList
		if (this.state.comments.length === 0)
			commentList = 'No comments posted yet'
		else
			commentList = this.state.comments.map((comment, index) =>
				<Comment key={index}>
					<Comment.Content>
						<Comment.Author>{comment.author}</Comment.Author>
						<Comment.Metadata>
							<div>{Moment(comment.time).format('MM/DD/YYYY HH:mm')}</div>
						</Comment.Metadata>
						<Comment.Text>
							<p>{comment.text}</p>
						</Comment.Text>
					</Comment.Content>
					<Divider />
				</Comment>)

		return <Comment.Group>
			<Comment>
				<Comment.Content>
					{commentList}
				</Comment.Content>
			</Comment>
			<Message
				hidden = {this.state.errorHidden}
				error
				content='Missing nickname or comment content'
			/>
			<Form reply onSubmit= { this.formSubmitHandler } >
				<Form.Field>
					<label>Nickname</label>
					<input name='author' type='text' value={this.state.formAuthor} onChange={e => {
						this.setState({ formAuthor: e.target.value })
					}}/>
				</Form.Field>
				<Form.Field>
					<label>Comment</label>
					<Form.TextArea name='text'value={this.state.formText} onChange={e => {
						this.setState({ formText: e.target.value })
					}}/>
				</Form.Field>

				<Button content='Post Comment' labelPosition='left' icon='edit' type='submit' loading={this.state.commentButtonLoading} primary/>
			</Form>
		</Comment.Group>
	}
}

export default UserComments
