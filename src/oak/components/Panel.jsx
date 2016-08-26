//////////////////////////////
//
//	<Oak-Panel> component for use with oak.
//
//    <Oak-Panel>
//      <Oak-PanelHeader>...</Oak-PanelHeader>
//      <Oak-LeftSidebar>...</Oak-LeftSidebar>
//      <Oak-RightSidebar>...</Oak-RightSidebar>
//      <Oak-PanelFooter>...</Oak-PanelFooter>
//      ...main content elements...
//    </Oak-Panel>
//
//////////////////////////////

import { Children, Component, PropTypes } from "react";

import fn from "oak-roots/util/fn";
import { classNames, mergeProps, stringOrFn, boolOrFn } from "oak-roots/util/react";

import "./Panel.less";


// TODO:
//  - non-`scrolling` sidebars should always scroll?  be sticky?
//  - <PanelHeader> etc ?
//  - <Panel title> auto-create <PanelHeader><h2>{title}</h2></PanelHeader>
//  - <Panel closeable>   => set hidden dynamically?  how do we re-show it?  pref?
//  - <Toolbar> ?  <TopToolbar> vs <BottomToolbar> ?
//  - better name for "fluid`?  default to "fluid" and have "compact" ?
//  - padding?  applies to body only, with separate setting for header/sidebars/etc?
//      - "tight" | ("normal") | "relaxed" ?
//      - (none) | "padded" | "relaxed"
//      - appearance like SUI = "unpadded" "lightly padded" "padded" "very padded"
//


// Simple "Hide-able" class which supports boolean / function "hidden" property.
class Hideable extends Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    hidden: PropTypes.oneOfType([ PropTypes.bool, PropTypes.func ]),
  }

  getRenderProps() {
    const { hidden, ...props } = this.props;

    // normalize "hidden" in case we were passed a function
    if (hidden !== undefined) {
      if (typeof hidden === "function") props.hidden = hidden.call(this);
      else props.hidden = !!hidden;
    }

    return props;
  }
}


// Set ALL <Panel scrolling> body element heights, from the outside in.
const DEBUG_SCROLL = false;
function _setScrollBodyHeights() {
  const $scrollingPanels = $(".oak.scrolling.Panel");
  if (DEBUG_SCROLL) console.info("setScrollBodyHeights", $scrollingPanels);
  if ($scrollingPanels.length === 0) return;

  // first reset all body heights so we get an accurate measurement
  $scrollingPanels.children(".body").height(1);

  // now size bodies according to panel size
  $scrollingPanels.each(function (index, panel) {
    const $panel = $(panel);
    const panelHeight = $panel.innerHeight();
    const headerHeight = $panel.children(".oak.PanelHeader").outerHeight();
    const footerHeight = $panel.children(".oak.PanelFooter").outerHeight();
    const bodyHeight = panelHeight - headerHeight - footerHeight;

    const $body = $panel.children(".body");
    $body.height(bodyHeight);
  });
}

// Actually set scrollBodyHeights on an immediate debounce.
const setScrollBodyHeights = fn.debounce(_setScrollBodyHeights, 0);

// And make sure heights are set on resize with a larger throttle.
$(window).on("resize", fn.throttle(_setScrollBodyHeights, 100));


export default class Panel extends Hideable {
  static propTypes = {
    ...Hideable.propTypes,

    // take up full height?
    // TODO: name???
    fluid: PropTypes.bool,

    // Scroll body?
    scrolling: PropTypes.bool,
  }


  componentDidMount() {
    setScrollBodyHeights();
  }

  // if "scrolling" changes, clear explicitly body height
  // TESTME
  componentWillReceiveProps(nextProps) {
    if (this.props.scrolling !== nextProps.scrolling && this.props.scrolling) {
      $(this.refs.body).height("auto");
    }
  }

  componentWillUpdate() {
//    this.resetBodyHeight();
  }

  componentDidUpdate() {
    setScrollBodyHeights();
  }

  resetBodyHeight() {
    $(this.refs && this.refs.body).height(1);
  }

  // Munge children into:
  //  <PanelHeader>
  //  <.body>
  //      <LeftSidebar>
  //      <.contents> ...loose content elements ... </.contents>
  //      <RightSidebar/>
  //  </.body>
  //  <PanelFooter>
//TODO: can we eliminate "contents" if we don't have sidebars?
  mungeChildren(props) {
    // Pull children out for possible reordering, unknown stuff goes in `contents`.
    let header, footer, left, right, contents = [];
    Children.forEach( props.children, (child) => {
      switch (child.type) {
        case PanelHeader:
          header = child; break;
        case PanelFooter:
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

  getRenderProps() {
    const props = super.getRenderProps();
    if (props.hidden) return props;

    const { fluid, scrolling } = props;
    props.className = classNames(
      "oak",
      { fluid, scrolling },
      "Panel",
      props.className
    );

    props.children = this.mungeChildren(props);
    return props;
  }

  render() {
    const props = this.getRenderProps();
    if (props.hidden) return null;
    return React.createElement("div", props, ...props.children);
  }
}


// <PanelHeader> class inside a <Panel>
// TODO: <PanelHeader> ???
export class PanelHeader extends Hideable {
  getRenderProps() {
    const { className, height, ...props } = super.getRenderProps();

    // Add known className
    props.className = classNames("oak PanelHeader", className);

    // height => style.height
    if (height) {
      props.style = mergeProps(props.style, { height: height });
    }

    return props;
  }

	render() {
    const props = this.getRenderProps();
    if (props.hidden) return null;
    return React.createElement("header", props, ...props.children);
  }
}


// <PanelFooter> class inside a <Panel>
export class PanelFooter extends Hideable {
  getRenderProps() {
    const props = super.getRenderProps();
    props.className = classNames("oak PanelFooter", props.className);
    // height => style.height
    if (props.height) {
      props.style = mergeProps(props.style, { height: props.height });
    }
    return props;
  }

	render() {
    const props = this.getRenderProps();
    if (props.hidden) return null;
    return React.createElement("footer", props, props.children);
  }
}


// <LeftSidebar> class inside a <Panel>
export class LeftSidebar extends Hideable {
  static propTypes = {
    ...Hideable.propTypes,
    width: PropTypes.number,
  }

  getRenderProps() {
    const props = super.getRenderProps();
    props.className = classNames("oak LeftSidebar", props.className);
    // width => style.width
    if (props.width) {
      props.style = mergeProps(props.style, { width: props.width });
    }
    return props;
  }

	render() {
    const props = this.getRenderProps();
    if (props.hidden) return null;
    return React.createElement("div", props, props.children);
  }
}


// <RightSidebar> class inside a <Panel>
export class RightSidebar extends Hideable {
  getRenderProps() {
    const props = super.getRenderProps();
    props.className = classNames("oak RightSidebar", props.className);
    // width => style.width
    if (props.width) {
      props.style = mergeProps(props.style, { width: props.width });
    }
    return props;
  }

	render() {
    const props = this.getRenderProps();
    if (props.hidden) return null;
    return React.createElement("div", props, props.children);
  }
}
