import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

class Canvas extends Component {
    render() {
        const auth = this.props.auth;
        const wireframe = this.props.wireframe;

        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        return (
            <div className = "wireframeCanvas">
                <div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
//   const { id } = ownProps.match.params;
//   const  wireframes  = state.firebase.profile.wireframes;
//   const wireframe = wireframes ? wireframes[id] : null;
//   if(wireframe)
//     wireframe.id = id;

  return {
    // wireframe,
    auth: state.firebase.auth,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'users' },
  ]),
)(Canvas);