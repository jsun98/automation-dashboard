import { Button } from 'semantic-ui-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import React, { Component } from 'react'
import $ from 'jquery'
import Moment from 'moment'
import ReactTable from 'react-table'
import ErrorModal from './ErrorModal'
import CommentModal from './CommentModal'

// this class displays the testcase level page
class TC extends Component {
	constructor (props) {

		// required reactjs semantics
		super(props)

		// initial state
		this.state = {
			loading: true,
			userCommentOpen: false,
			autoCommentOpen: false,
			errorModalOpen: false,
		}

		// perform binding
		this.closeUserModal = this.closeUserModal.bind(this)
		this.closeAutoModal = this.closeAutoModal.bind(this)
		this.closeErrorModal = this.closeErrorModal.bind(this)
	}

	// fetches data for this page from the server endpoint
	fetchData () {
		$.get('/db/TCByName/' + this.props.id)
			.done(data => {
				data.map(datum => {

					// format data for readability
					datum.last_run_date_simp = Moment(datum.last_run_date).format('DD/MM')

					// convert status string to numbers for use in line chart
					if (datum.status === 'pass')
						datum.statusNum = 3
					else if (datum.status === 'fail')
						datum.statusNum = 2
					else
						datum.statusNum = 1
					return datum
				})

				// store the fetched data in state to be passed to our table
				this.setState({
					name: this.props.id,
					data,
					loading: false, // UI loading screen while fetching
				})
			})
	}

	// this fires before component is rendered, so we fetch our initial data
	componentDidMount () {
		this.fetchData()
	}

	// the following three functions are passed down to modal components to close them on click

	closeUserModal () {
		this.setState({ userCommentOpen: false })
	}

	closeAutoModal () {
		this.setState({ autoCommentOpen: false })
	}

	closeErrorModal () {
		this.setState({ errorModalOpen: false })
	}



	// this method renders HTML to our page
	render () {

		// define columns for table
		const columns = [ {
			Header: () =>
				<div>
					<Button secondary content="back" icon='left arrow' labelPosition='left' style={{
						position: 'absolute',
						left: 0,
					}} onClick={() => {
						this.props.prev()
					}}/>
					<h1 style={{ margin: 0 }}>Test Case History: {this.state.name}</h1>
				</div>,
			columns: [ {
				id: 'last_run_date',
				Header: 'Last Run Date',
				minWidth: 150,
				accessor: r => Moment(r.last_run_date).format('dddd, MMMM Do YYYY, HH:mm'),
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
				Header: 'Error',
				accessor: 'error',
				maxWidth: 150,
				Cell: row => {
					if (row.original.error)
						return <a onClick={() => {
							this.setState({
								errorModalOpen: true,
								errorText: row.original.error,
							})
						}} href={'javascript:void(0)'}>View</a>

				},
			}, {
				Header: 'Screenshot',
				accessor: 'screenshot',
				maxWidth: 100,
				Cell: row => {
					if (row.original.screenshot)
						return <a target='_blank' href={row.original.screenshot}>Link</a>

				},
			}, {
				Header: 'Jenkins Job',
				accessor: 'job',
				maxWidth: 100,
				Cell: row => <a target='_blank' href={row.original.job}>Link</a>,
			} ],
		} ]

		return (
			<div>
				{ /* define modals for comments and error (initially hidden) */}
				<CommentModal
					id={this.state.modalTcId} // id is used for getting comments from server endpoint
					heading='Testing Team Comments'
					routeEndPoint='userComment' // this is also used for getting comments from server endpoint
					visible={this.state.userCommentOpen} // controls whether modal is hidden or shown
					onClose={this.closeUserModal} // closes modal on click
				/>
				<CommentModal
					id={this.state.modalTcId}
					heading='Automation Team Comments'
					routeEndPoint='autoComment'
					visible={this.state.autoCommentOpen}
					onClose={this.closeAutoModal}
				/>

				<ErrorModal
					content={this.state.errorText} // error text
					visible={this.state.errorModalOpen}
					onClose={this.closeErrorModal}
				/>
				{/* Renders table */}
				<ReactTable
					loading={ this.state.loading }
					data={ this.state.data } // dump data from state
					resizable={ this.props.tableStyle.resizable }
					className={ this.props.tableStyle.className }
					style={ this.props.tableStyle.style }
					defaultPageSize={10}
					columns={ columns } // define columns
				/>
				<h1 style={{ textAlign: 'center' }}>Graph</h1>

				{ /* defines line chart */}
				<ResponsiveContainer height={500}>
					<LineChart
						data={ this.state.data }
						margin={{
							top: 5,
							right: 50,
							left: 20,
							bottom: 5,
						}}>
						<XAxis dataKey="last_run_date_simp"/>
						<YAxis
							interval="preserveStartEnd"
							padding={{
								top: 40,
								bottom: 40,
							}}
							domain={[ 1, 3 ]}
							ticks={[ 3, 2, 1 ]}
							tickFormatter={arg => {
								if (arg === 3)
									return 'pass'
								else if (arg === 2)
									return 'fail'
								return 'skip'
							}}
						/>
						<CartesianGrid strokeDasharray="3 3"/>
						<Line type="linear" dataKey="statusNum" stroke="black" strokeWidth={3} activeDot={{ r: 8 }}/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		)
	}
}


export default TC
