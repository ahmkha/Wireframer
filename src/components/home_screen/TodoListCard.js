import React from 'react';
import { deleteHandler } from '../../store/database/asynchHandler';
import { connect } from 'react-redux';
import { compose } from 'redux';

class TodoListCard extends React.Component {

    render() {
        const { todoList } = this.props;
        return (
            <div className="card z-depth-0 todo-list-link">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title">{todoList.name}</span>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        profile: state.firebase.auth,
        auth: state.firebase.auth,
        todoLists: state.firebase.profile.wireframes,
    };
};

const mapDispatchToProps = dispatch => ({
    delete: (profile, wireframe, firebase) => dispatch(deleteHandler(profile, wireframe, firebase)),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(TodoListCard);