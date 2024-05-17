import { Component } from "react";

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: { message: "", stack: "" },
    info: { componentStack: "" },
  };

  static getDerivedStateFromError = (error) => {
    return { hasError: true };
  };

  componentDidCatch = (error, info) => {
    return { error, info };
  };

  render() {
    const { hasError, error, info } = this.state;
    const { children } = this.props;

    return hasError ? (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="flex flex-col">
          <header className="font-semibold text-xl">{error.message}</header>
          <main>{error.stack}</main>
        </div>
      </div>
    ) : (
      children
    );
  }
}

export default ErrorBoundary;
