import { connect } from 'react-redux';
import * as actions from './redux/actions'
import { bindActionCreators } from 'redux';
import { State } from '../../rootReducer';

const mapStateToProps = (state : State, ownProps) => ({
  fetch: state.page.license.fetch,
  insert: state.page.license.insert 
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
);