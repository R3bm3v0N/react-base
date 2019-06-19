import { connect } from 'react-redux';
import * as userActions from '../../redux/actions'
import { bindActionCreators } from 'redux';

import {State} from '../../../../rootReducer';

const mapStateToProps = (state : State, ownProps: any) => ({
  loginPending: state.page.login.status === 'pending',
  error: state.page.login.error
})

const mapDispatchToProps = (dispatch: any) => bindActionCreators(userActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
);