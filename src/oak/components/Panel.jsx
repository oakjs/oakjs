//////////////////////////////
//
//	<Oak-Panel> component for use with oak.
//
//    <Oak-Panel>
//      <Oak-Header>...</Oak-Header>
//      <Oak-LeftSidebar>...</Oak-LeftSidebar>
//      <Oak-RightSidebar>...</Oak-RightSidebar>
//      <Oak-Footer>...</Oak-Footer>
//      ...main content elements...
//    </Oak-Panel>
//
//////////////////////////////

import { Children, Component, PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import "./Panel.less";

export default class Panel extends Component {
    static propTypes = {
      id: PropTypes.string,
      className: PropTypes.string,
      style: PropTypes.object,

      // take up full height?
      // TODO: name???
      fluid: PropTypes.bool,

      // Scroll body?
      scrolling: PropTypes.bool,
    }

    componentDidMount() {
      this.setBodyHeight();
      $(window).on("resize", this.setBodyHeight);
    }

    // if "scrolling" changes, clear explicitly body height
    // TESTME
    componentWillReceiveProps(nextProps) {
      if (this.props.scrolling !== nextProps.scrolling && this.props.scrolling) {
        $(this.refs.body).height("auto");
      }
    }

    componentDidUpdate() {
      this.setBodyHeight();
    }

    componentWillUnmount() {
      $(window).off("resize", this.setBodyHeight);
    }

    setBodyHeight = () => {
      if (!this.props.scrolling) return;

      const $panel = $(ReactDOM.findDOMNode(this));
      const $body = $(this.refs.body);

      // reset body height before measuring so we get an accurate read pn panel height
      $body.height(1);

      const panelHeight = $panel.height();
      const headerHeight = $panel.children(".oak.Header").outerHeight();
      const footerHeight = $panel.children(".oak.Footer").outerHeight();

      $body.height(panelHeight - headerHeight - footerHeight);
    };

    getRenderClass(props) {
      const { fluid, scrolling, className } = props;
      return classNames(
        "oak",
        { fluid, scrolling },
        "Panel",
        props.className
      );
    }

    // Munge children into:
    //  <header>
    //  <main> <leftSidebar> ...content elements ... <rightSidebar>
    //  <footer>
    mungeChildren(props) {
      // Pull children out for possible reordering, unknown stuff goes in `contents`.
      let header, footer, left, right, contents = [];
      Children.forEach( props.children, (child) => {
        switch (child.type) {
          case Header:
            header = child; break;
          case Footer:
            footer = child; break;
          case LeftSidebar:
            left = child; break;
          case RightSidebar:
            right = child;  break;
          default:
            contents.push(child);
        }
      });

      const children = [];
      // header
      if (header) children.push(header);
      // "main" row contains <LeftSidebar>...contents...<RightSidebar>
      const main = [];
      if (left) main.push(left);
      main.push(React.createElement("div", { className: "contents", ref: "contents" }, ...contents));
      if (right) main.push(right);
      children.push(React.createElement("div", { className: "body", ref: "body" }, ...main));
      // footer
      if (footer) children.push(footer);

      return children;
    }

    render() {
      const props = {
        ...this.props,
        className: this.getRenderClass(this.props)
      }
      const children = this.mungeChildren(this.props);
      return React.createElement("div", props, ...children);
    }
}


export class Header extends Component {
	render() {
		const props = this.props;
    const className = classNames("oak Header", props.className);
    return (
      <header {...props} className={className}>
        {props.children}
      </header>
    );
  }
}


export class Footer extends Component {
	render() {
		const props = this.props;
    const className = classNames("oak Footer", props.className);
    return (
      <footer {...props} className={className}>
        {props.children}
      </footer>
    );
  }
}

export class LeftSidebar extends Component {
	render() {
		const props = this.props;
    const className = classNames("oak LeftSidebar", props.className);
    return (
      <div {...props} className={className}>
        {props.children}
      </div>
    );
  }
}

export class RightSidebar extends Component {
	render() {
		const props = this.props;
    const className = classNames("oak RightSidebar", props.className);
    return (
      <div {...props} className={className}>
        {props.children}
      </div>
    );
  }
}
