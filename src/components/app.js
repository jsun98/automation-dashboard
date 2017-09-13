import 'babel-polyfill'
import React from 'react'
import BP from './BP'
import BPG from './BPG'
import BPGList from './BPGList'
import ReactDOM from 'react-dom'
import TC from './TC'
import {
	BrowserRouter as Router,
	Route,
	withRouter,
} from 'react-router-dom'

// some style settings for tables
const tableStyle = {
	resizable: true,
	className: '-highlight -striped',
	style: {
		textAlign: 'center',
		fontSize: '1rem',
	},
}

// wrap components to gain access to the 'match' object for frontend routing
const BPGListWrapper = () => <BPGList next='/BPG' tableStyle={tableStyle} />
const BPGWrapper = ({ match, history }) => <BPG next='/BP' prev={history.goBack} id={match.params.id} tableStyle={tableStyle} />
const BPWrapper = ({ match, history }) => <BP next='/TC' prev={history.goBack} id={match.params.id} tableStyle={tableStyle} />
const TCWrapper = ({ match, history }) => <TC prev={history.goBack} id={match.params.id} tableStyle={tableStyle} />

// further wrap the wrapper components to gain access to browser history
const BPwr = withRouter(BPWrapper)
const BPGwr = withRouter(BPGWrapper)
const BPGListwr = withRouter(BPGListWrapper)
const TCwr = withRouter(TCWrapper)

// this is the top level wrapper class for the application
// it assembles all the components and render the final view
// note: this app uses frontend routing instead of backend routing
const App = () => (
	<Router>
		<div>
			<Route exact path="/BPG" component={BPGListwr}/>
			<Route exact path="/BPG/:id" component={BPGwr}/>
			<Route exact path="/BP/:id" component={BPwr}/>
			<Route exact path="/TC/:id" component={TCwr}/>
		</div>
	</Router>
)

// ReactDOM is only called once to mount our entire application on a <div> with id 'root'
ReactDOM.render(
	<App />,
	document.getElementById('root')
)
