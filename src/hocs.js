import React from 'react';
import {
  useNavigate, useParams, useLocation,
} from 'react-router';

// react-router 6 dropped support for class components and requires hooks.
// This component wraps the hooks into an HOC to be used like the old withRouter.
// Inspired by a combination of several StackOverflow and GitHub posts.
export function withRouter(Component) {
  const WithRouterComponent = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    return (
      <Component
        {...props}
        router={{
          location, navigate, params,
        }}
      />
    );
  };

  return WithRouterComponent;
}
