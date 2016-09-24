//////////////////////////////
//
//  Pull all SemanticUI widgets into one file for easy include.
//
//  You can simply import `SUI` and use all of the components with the `SUI.` prefix:
//
//    import SUI from "./SUI/components"
//    ...
//    return <SUI.Menu.../><SUI.MenuHeader.../><SUI.MenuItem.../></SUI.Menu>
//
//  Or import the components you want individually and use them without prefixing:
//
//    import { Menu, MenuHeader, MenuItem } from "./SUI/components"
//    ...
//    return <Menu.../><MenuHeader.../><MenuItem.../></Menu>
//
//////////////////////////////

// Export all individual components here.
// NOTE: keep this list in alphabetical order!
export Accordion from "./Accordion";
export Ad from "./Ad";
export Button from "./Button";
export Buttons from "./Buttons";
export Breadcrumb from "./Breadcrumb";
export Card from "./Card";
export Cards from "./Cards";
export Checkbox from "./Checkbox";
export Column from "./Column";
export Comment from "./Comment";
export Comments from "./Comments";
export Content from "./Content";
export Conditional from "./Conditional";
export Container from "./Container";
export CountryMap from "./CountryMap";
export Description from "./Description";
export Dimmer from "./Dimmer";
export Divider from "./Divider";
export Dropdown from "./Dropdown";
export ElementBuffer from "./ElementBuffer";
export Embed from "./Embed";
export Feed from "./Feed";
export FeedEvent from "./FeedEvent";
export Field from "./Field";
export Fields from "./Fields";
export Flag from "./Flag";
export Form from "./Form";
export Grid from "./Grid";
export Header from "./Header";
export Icon from "./Icon";
export Image from "./Image";
export Images from "./Images";
export Input from "./Input";
export Item from "./Item";
export Items from "./Items";
export Label from "./Label";
export Labels from "./Labels";
export List from "./List";
export ListItem from "./ListItem";
export Loader from "./Loader";
export Menu from "./Menu";
export MenuHeader from "./MenuHeader";
export MenuItem from "./MenuItem";
export Message from "./Message";
export Meta from "./Meta";
export Modal from "./Modal";
export Nag from "./Nag";
export Popup from "./Popup";
export Pusher from "./Pusher";
export Progress from "./Progress";
export RadioButton from "./RadioButton";
export RadioGroup from "./RadioGroup";
export Rail from "./Rail";
export Rating from "./Rating";
export Row from "./Row";
export Reveal from "./Reveal";
export Shape from "./Shape";
export Side from "./Side";
export Sidebar from "./Sidebar";
export Search from "./Search";
export Segment from "./Segment";
export Segments from "./Segments";
export Statistic from "./Statistic";
export Statistics from "./Statistics";
export Step from "./Step";
export Steps from "./Steps";
export Sticky from "./Sticky";
export Stub from "./Stub";
export Subheader from "./Subheader";
export Submenu from "./Submenu";
export SUIComponent from "./SUIComponent";
export Tab from "./Tab";
export Tabbar from "./Tabbar";
export Table from "./Table";
export Tabs from "./Tabs";
export Title from "./Title";
export Toggle from "./Toggle";

// Assign as `SUI.components` so we get those bits distinct from other SUI helpers.
import SUI from "./SUI";
SUI.components = Object.assign({}, exports);

// Assign all directly to SUI for easy access
Object.assign(SUI, SUI.components);

// Assign as a component package to oak.
import oak from "oak/oak";
oak.registerComponents("SUI", SUI.components);

// Export the entire SUI package as the default.
export default SUI;
