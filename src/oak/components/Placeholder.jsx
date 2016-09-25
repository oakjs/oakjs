//////////////////////////////
//  Placeholder component -- shows as an `[X]` to represent some un-drawable component.
//////////////////////////////

import { classNames } from "oak-roots/util/react";

import "./Placeholder.less";

export default function Placeholder(props, context) {
  const { className, label } = props;
  return (
    <div className={classNames("oak", className, "Placeholder")}>
      <div className="inset">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path width="100" height="100"
            transform="matrix(1 0 0 1 0.5 0.5)"
            strokeDasharray="5,5" strokeWidth="1.5" vectorEffect="non-scaling-stroke"
            stroke="#000" fill="none"
            d="M0,0 L99,0 L99,99 L0,99 L0,0 M0,0 L99,99 M0,99 L99,0" />
        </svg>
      </div>
      {label && <label>{label}</label>}
    </div>
  );
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify("Oak", { draggable: true, droppable: false }, Placeholder);
