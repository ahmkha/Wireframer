import * as actionCreators from '../actions/actionCreators'

const initState = {
    wireframes: []
};

const todoListReducer = (state = initState, action) => {
    switch (action.type) {
        case actionCreators.DELETE_SUCCESS:
      return {
        ...state,
        authError: 'Success',
      };
        default:
            return state;
            break;
    }
};

export default todoListReducer;