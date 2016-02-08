"use strict";
import React from "react";
import { Card } from "oak";

export default class CardsCard extends Card {
  static defaultProps = {
    id: "Cards",
    title: "Cards"
  }

  getInitialData() {
    return {
      image: "http://semantic-ui.com/images/wireframe/image.png",
      whiteImage: "http://semantic-ui.com/images/wireframe/white-image.png",

      joeAvatar: "http://semantic-ui.com/images/avatar/large/joe.jpg",
      kristyAvatar: "http://semantic-ui.com/images/avatar2/large/kristy.png",
      elliotAvatar: "http://semantic-ui.com/images/avatar/large/elliot.jpg",
      stevieAvatar: "http://semantic-ui.com/images/avatar/large/stevie.jpg",
      jennyAvatar: "http://semantic-ui.com/images/avatar/large/jenny.jpg",
      steveAvatar: "http://semantic-ui.com/images/avatar/large/steve.jpg",
    }
  }

  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Cards">
            A group of cards
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Example title="Cards match height">
              <c.Cards>
                <c.Card header="Kristy" meta="Joined in 2013"
                  description="Kristy is an art director living in New York."
                  extra={<a><c.Icon icon="user"/>22 Friends</a>}
                  image={data.kristyAvatar}
                />
                <c.Card header="Elliot" meta="Joined in 2012"
                  description="Elliot is a software manager living in New York.  His interests are gardening, chihchilla raising and knitting."
                  extra={<a><c.Icon icon="user"/>3,231 Friends</a>}
                  image={data.elliotAvatar}
                />
              </c.Cards>
            </c.Example>

            <c.Example title="Column Count">
              <c.Cards columns={3}>
                <c.Card header="Alphabet Inc" meta="NASDAQ: GOOG"
                  description="Alphabet Inc. is an American multinational conglomerate created in 2015 as the parent company of Google and several other companies previously owned by or tied to Google."
                  href="https://abc.xyz/" target="_blank"
                />
                <c.Card header="Apple Inc" meta="NASDAQ: AAPL"
                  description="Apple Inc. is an American multinational technology company headquartered in Cupertino, California, that designs, develops, and sells consumer electronics, computer software, and online services."
                  href="https://apple.com/" target="_blank"
                />
                <c.Card header="Amazon" meta="NASDAQ: AMZN"
                  description="Amazon.com, Inc., often referred to as simply Amazon, is an American electronic commerce and cloud computing company with headquarters in Seattle, Washington. It is the largest Internet-based retailer in the United States."
                  href="https://amazon.ocm/" target="_blank"
                />
              </c.Cards>
            </c.Example>

            <c.Example title="Stackable">
              <c.Cards columns={3} appearance="stackable">
                <c.Card image={data.elliotAvatar}/>
                <c.Card image={data.joeAvatar}/>
                <c.Card image={data.kristyAvatar}/>
                <c.Card image={data.stevieAvatar}/>
                <c.Card image={data.jennyAvatar}/>
                <c.Card image={data.steveAvatar}/>
              </c.Cards>
            </c.Example>

            <c.Example title="Doubling">
              <c.Cards columns={6} appearance="doubling">
                <c.Card image={data.elliotAvatar}/>
                <c.Card image={data.joeAvatar}/>
                <c.Card image={data.kristyAvatar}/>
                <c.Card image={data.stevieAvatar}/>
                <c.Card image={data.jennyAvatar}/>
                <c.Card image={data.steveAvatar}/>
              </c.Cards>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}
