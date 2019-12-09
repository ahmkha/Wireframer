import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import TodoListCard from './TodoListCard';

class TodoListLinks extends React.Component {
    render() {
        const todoLists = this.props.todoLists;
        console.log(todoLists);
        return (
            <div className="todo-lists section">
                {todoLists && todoLists.map(todoList => (
                    <Link to={'/wireframe/' + todoList.id} key={todoList.id}>
                        <TodoListCard todoList={todoList} />
                    </Link>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.log(state.firebase.profile);
    return {
        //todoLists: state.firestore.ordered.users,
        auth: state.firebase.auth,
        todoLists: state.firebase.profile.wireframes,
    };
};

export default compose(connect(mapStateToProps))(TodoListLinks);