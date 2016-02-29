getInitialData() {
  return {
    // header, footer, etc elements WITHOUT wrappers
    headerElement: <tr><th>Food</th><th>Calories</th><th>Protein</th></tr>,
    bodyElement: [<tr><td>Apples</td><td>200</td><td>0g</td></tr>,
                <tr><td>Bananas</td><td>270</td><td>0g</td></tr>,
                <tr><td>Oranges</td><td>310</td><td>0g</td></tr>],

    footerElement: <tr><th>Totals</th><th>780</th><th>0g</th></tr>,

    // arrays
    headerArray: ["Type", "Column A","Column B","Column C","Column D"],
    bodyArray: [
      ["Strings", "A1", "B1", "C1", "D1" ],
      ["Numbers", 1, 2, 3, 4 ],
      ["Elements",
        <i className="check icon"/>,
        <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" className="ui rounded avatar image"/>,
        <b>Some bold text</b>,
        <a href="#">An anchor</a>
      ],
    ],
    footerArray: [" ", "Footer A", "Footer B", "", "Footer D" ],
  }
}
