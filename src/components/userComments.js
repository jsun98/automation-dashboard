import { Button, Comment, Divider, Form, Message } from 'semantic-ui-react'
import React, { Component } from 'react'
import $ from 'jquery'
import Moment from 'moment'

// this class implments the list of comments shown in the modal
class UserComments extends Component {
	constructor (props) {
		super(props)

		// before we get any data, the modal's initial state is empty
		this.state = {
			comments: [],
			id: this.props.id,
			route: this.props.route,
			commentButtonLoading: false,
			errorHidden: true,
			formAuthor: '',
			formText: '',
		}

		// bind event listeners
		this.formSubmitHandler = this.formSubmitHandler.bind(this)
		this.fetchData = this.fetchData.bind(this)
	}

	// fetches list of comments from server endpoint
	fetchData () {
		$.get('/db/' + this.state.route + '/' + this.state.id)
			.done(comments => {
				this.setState({ comments })
			})
			.fail(err => {
				console.log(err)
			})
	}

	// submits new comment
	formSubmitHandler (e) {
		e.preventDefault()
		this.setState({ commentButtonLoading: true }) // set ui loading

		// perform ajax request to add comment
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

	// fires before class is constructed, get initial data
	componentDidMount () {
		this.fetchData()
	}

	// renders view
	render () {
		var commentList
		if (this.state.comments.length === 0) // if there are no comments, render a msg
			commentList = 'No comments posted yet'
		else // perform some formating on our list of comments
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

		// finally, render our list of comments
		return (
			<Comment.Group>
				<Comment>
					<Comment.Content>
						{commentList}
					</Comment.Content>
				</Comment>

				{ /* Error msg if either name or content is missing, initially hidden */ }
				<Message
					hidden = {this.state.errorHidden}
					error
					content='Missing nickname or comment content'
				/>

				{ /* form for submitted a new comment */ }
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
		)
	}
}

export default UserComments
