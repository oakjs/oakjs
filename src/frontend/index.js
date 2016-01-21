import React from "react";
import ReactDOM from "react-dom";

import AppRouter from "./Router";

const oakPlayerRoot = document.getElementById("OakPlayer");
const router = ReactDOM.render(<AppRouter/>, oakPlayerRoot);
export default router;
// DEBUG
window.router = router;
