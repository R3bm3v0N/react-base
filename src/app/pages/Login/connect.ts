import { connect } from 'react-redux';
import * as actions from './redux/actions'
import { bindActionCreators } from 'redux';
import {State} from '../../rootReducer';

const mapStateToProps = (state : State, ownProps) => ({
  loggedIn: state.session.jwt != null
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
);