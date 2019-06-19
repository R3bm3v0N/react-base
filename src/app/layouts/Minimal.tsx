import * as React from "react";

interface Props {
}

class MinimalLayout extends React.Component<Props> {

  render() {
    return (
      <>
        {this.props.children}
      </>
    );
  }
}

export default MinimalLayout;