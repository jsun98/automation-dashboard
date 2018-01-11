import React, { Component } from 'react'
import $ from 'jquery'
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import Moment from 'moment'
import ReactTable from 'react-table'
import CommentModal from './CommentModal'
import BugIdModal from './BugIdModal'


// this class renders the BP details page, details see BPG.js and TC.js
class BP extends Component {
	constructor (props) {
		super(props)
		this.state = {  loading: true,
						commentOpen: false,
						bugIdOpen: false
		}

			this.closeUserModal = this.closeUserModal.bind(this)
			this.closeAutoModal = this.closeAutoModal.bind(this)
      this.closeBugId = this.closeBugId.bind(this)
	}

	fetchData () {
		$.get('/db/BPByBPandBPG/' + this.props.bpName + '/' + this.props.bpgName)
			.done(data => {
				this.setState({
					name: this.props.id,
					data,
					loading: false,
				})
			})
	}

	closeUserModal () {
		this.setState({ userCommentOpen: false })
	}

	closeAutoModal () {
		this.setState({ autoCommentOpen: false })
	}

    closeBugId () {
        this.setState({ bugIdOpen :false })
    }

	componentDidMount () {
		this.fetchData()
	}
	render () {
		return<div>

		<CommentModal
			id={this.state.modalTcId} // id is used for getting comments from server endpoint
			heading='Testing Team Comments'
			routeEndPoint='combinedUserComment' // this is also used for getting comments from server endpoint
			visible={this.state.userCommentOpen} // controls whether modal is hidden or shown
			onClose={this.closeUserModal} // closes modal on click
		/>
		<CommentModal
			id={this.state.modalTcId}
			heading='Automation Team Comments'
			routeEndPoint='combinedAutoComment'
			visible={this.state.autoCommentOpen}
			onClose={this.closeAutoModal}
		/>

			<BugIdModal
				id={this.state.modalTcId} // id is used for getting comments from server endpoint
				heading='Bug Id'
				routeEndPoint='bug id' // this is also used for getting comments from server endpoint
				visible={this.state.bugIdOpen} // controls whether modal is hidden or shown
				onClose={this.closeBugId} // closes modal on click
			/>
		<ReactTable
			loading={ this.state.loading }
			data={ this.state.data }
			resizable={ this.props.tableStyle.resizable }
			className={ this.props.tableStyle.className }
			style={ this.props.tableStyle.style }
			defaultPageSize={10}
			columns={
				[ {
					Header: () =>
						<div>
							<Button secondary content="back" icon='left arrow' labelPosition='left' style={{
								position: 'absolute',
								left: 0,
							}} onClick={() => {
								this.props.prev()
							}}/>
							<h1 style={{ margin: 0 }}>Business Process Details: {this.state.name}</h1>
						</div>,
					columns: [ {
						Header: 'Test Case Name',
						accessor: 'name',
						minWidth: 200,
						Cell: row => <Link to={this.props.next + '/' + row.original._id}>{row.original._id}</Link>,
					}, {
						Header: 'Status',
						accessor: 'status',
						maxWidth: 100,
						Cell: cell => {
							let style = {}
							if (cell.original.status === 'pass')
								style = { background: '#60BD68' }
							else if (cell.original.status === 'fail')
								style = { background: '#F15854' }
							else if (cell.original.status === 'skip')
								style = { background: '#AAAAAA' }
							return <div style={ style }>
								{cell.original.status}
							</div>
						},
					}, {
						Header: 'Testing Team Comments',
						maxWidth: 250,
						Cell: row => <a href='javascript:void(0)' onClick={ () => {
							this.setState({
								userCommentOpen: true,
								modalTcId: row.original._id,
							})
						}}>View</a>,
					}, {
						Header: 'Automation Team Comments',
						maxWidth: 250,
						Cell: row => <a href='javascript:void(0)' onClick={ () => {
							this.setState({
								autoCommentOpen: true,
								modalTcId: row.original._id,
							})
						}}>View</a>,
					}, {
						Header: 'Bug ID',
						maxWidth: 250,
                        Cell: row => <a href='javascript:void(0)' onClick={ () => {
                            this.setState({
                                bugIdOpen: true,
                                modalTcId: row.original._id,
                            })
                        }}>View</a>
					},{
                            id: 'last_run_date',
                            Header: 'Last Run',
                            minWidth: 150,
                            accessor: r => Moment(r.last_run_date).format('MMM Do, YYYY HH:mm:ss'),
                }, {
						Header: 'Jenkins Job',
						accessor: 'job',
						maxWidth: 100,
						Cell: row => row.original.job ? <a target='_blank' href={row.original.job}>Link</a> : '',
					} ],
				} ]
			}
		/>
		</div>

	}
}


export default BP
