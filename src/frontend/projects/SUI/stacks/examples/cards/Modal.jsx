"use strict";
import React from "react";
import { Card } from "oak";

export default class ModalCard extends Card {
  static defaultProps = {
    id: "Modal",
    title: "Modal"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Modal">
            A modal displays content that temporarily blocks interactions with the main view of a site
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Inline Content">
                  <c.Modal ref="inline">
                    <div className="header">Inline Header</div>
                    <div className="content">
                      <c.LoremIpsum/>
                    </div>
                    <div className="actions">
                      <c.Button className="approve">OK</c.Button>
                      <c.Button className="cancel">Cancel</c.Button>
                    </div>
                  </c.Modal>
                  <c.Button onClick={()=> card.refs.inline.show()}>Show Modal</c.Button>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Header, Content, Actions Attributes">
                  <c.Modal ref="attributes" header="Header Attribute" content={<c.LoremIpsum short/>} actions={["OK"]}/>
                  <c.Button onClick={()=> card.refs.attributes.show()}>Show Modal</c.Button>
                </c.Example>
              </c.Column>

            </c.Grid>
          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}
