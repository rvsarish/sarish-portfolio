import { Component } from 'react';
import SceneLoading from './SceneLoading.jsx';

export default class SceneLoadBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return <SceneLoading label="3D scene unavailable · the rest of the portfolio is ready" />;
    }
    return this.props.children;
  }
}
