"use strict";
import React from "react";
import { Card } from "oak";

export default class SidebarCard extends Card {
  static defaultProps = {
    id: "Sidebar",
    title: "Sidebar"
  }

  getInitialData({ card, components:c }) {
    console.warn(c);
    return {
      iconMenu: [
        <c.MenuItem icon="home">Home</c.MenuItem>,
        <c.MenuItem icon="block layout">Topics</c.MenuItem>,
        <c.MenuItem icon="smile">Friends</c.MenuItem>,
        <c.MenuItem icon="calendar">History</c.MenuItem>,
      ],
    }
  }

  adjustTransitionAndShow(ref, transition) {
    return () => {
      const sidebar = this.refs[ref];
      if (sidebar.isVisible()) {
        sidebar.hide();
      }
      else {
        sidebar.setTransition(transition);
        sidebar.show();
      }
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
          <c.PageTitle title="Sidebar">
            A sidebar hides additional content beside a page.
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Example title="Inline Content" hint="<Sidebar>...</Sidebar><Pusher>...</Pusher>">
              <c.Menu appearance="top attached">
                <c.MenuItem icon="sidebar" onClick={()=>card.refs.inline.toggle()}>Menu</c.MenuItem>
              </c.Menu>
              <c.Segment appearance="bottom attached ">
                <c.Sidebar ref="inline" appearance="inverted labeled icon vertical menu">
                  <c.MenuItem icon="home">Home</c.MenuItem>
                  <c.MenuItem icon="block layout">Topics</c.MenuItem>
                  <c.MenuItem icon="smile">Friends</c.MenuItem>
                  <c.MenuItem icon="calendar">History</c.MenuItem>
                </c.Sidebar>
                <c.Pusher>
                  <c.Segment appearance="basic">
                    <c.LoremIpsum/>
                  </c.Segment>
                </c.Pusher>
              </c.Segment>
            </c.Example>

            <c.Example title="Content Attribute" hint="<Sidebar content={...}/><Pusher>...</Pusher>">
              <c.Menu appearance="top attached">
                <c.MenuItem icon="sidebar" onClick={()=>card.refs.content.toggle()}>Menu</c.MenuItem>
              </c.Menu>
              <c.Segment appearance="bottom attached">
                <c.Sidebar ref="content" appearance="inverted labeled icon vertical menu" content={data.iconMenu}/>
                <c.Pusher>
                  <c.Segment appearance="basic">
                    <c.LoremIpsum/>
                  </c.Segment>
                </c.Pusher>
              </c.Segment>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Appearance">
            <c.Example title="Start Visible" hint="<Sidebar visible/>">
              <c.Menu appearance="top attached">
                <c.MenuItem icon="sidebar" onClick={()=>card.refs.visible.toggle()}>Left</c.MenuItem>
              </c.Menu>
              <c.Segment appearance="bottom attached">
                <c.Sidebar ref="visible" visible direction="left" transition='push' appearance="inverted labeled icon vertical menu" content={data.iconMenu}/>
                <c.Pusher>
                  <c.Segment appearance="basic">
                    <c.LoremIpsum/>
                  </c.Segment>
                </c.Pusher>
              </c.Segment>
            </c.Example>

            <c.Example title="Side" hint="<Sidebar side='left'/>">
              <c.Menu appearance="top attached">
                <c.MenuItem icon="left arrow" onClick={()=>card.refs.left.toggle()}>Left</c.MenuItem>
                <c.MenuItem icon="up arrow" onClick={()=>card.refs.top.toggle()}>Top</c.MenuItem>
                <c.MenuItem icon="down arrow" onClick={()=>card.refs.bottom.toggle()}>Bottom</c.MenuItem>
                <c.MenuItem icon="right arrow" onClick={()=>card.refs.right.toggle()}>Right</c.MenuItem>
              </c.Menu>
              <c.Segment appearance="bottom attached">
                <c.Sidebar ref="left" direction="left" appearance="inverted labeled icon vertical menu" content={data.iconMenu}/>
                <c.Sidebar ref="top" direction="top" appearance="inverted labeled icon menu" content={data.iconMenu}/>
                <c.Sidebar ref="bottom" direction="bottom" appearance="inverted labeled icon menu" content={data.iconMenu}/>
                <c.Sidebar ref="right" direction="right" appearance="inverted labeled icon vertical menu" content={data.iconMenu}/>
                <c.Pusher>
                  <c.Segment appearance="basic">
                    <c.LoremIpsum/>
                    <c.LoremIpsum/>
                  </c.Segment>
                </c.Pusher>
              </c.Segment>
            </c.Example>

            <c.Example title="Exclusive" hint="<Sidebar exclusive/>">
              <c.Menu appearance="top attached">
                <c.MenuItem icon="left arrow" onClick={()=>card.refs.exclusiveLeft.toggle()}>Left</c.MenuItem>
                <c.MenuItem icon="right arrow" onClick={()=>card.refs.exclusiveRight.toggle()}>Right</c.MenuItem>
              </c.Menu>
              <c.Segment appearance="bottom attached">
                <c.Sidebar ref="exclusiveLeft" exclusive direction="left" appearance="inverted labeled icon vertical menu" content={data.iconMenu}/>
                <c.Sidebar ref="exclusiveRight" exclusive direction="right" appearance="inverted labeled icon vertical menu" content={data.iconMenu}/>
                <c.Pusher>
                  <c.Segment appearance="basic">
                    <c.LoremIpsum/>
                  </c.Segment>
                </c.Pusher>
              </c.Segment>
            </c.Example>

            <c.Example title="Transition" hint="<Sidebar transition='push'/>">
              <c.Menu appearance="top attached">
                <c.MenuItem onClick={card.adjustTransitionAndShow("transition", "overlay")}>Overlay</c.MenuItem>
                <c.MenuItem onClick={card.adjustTransitionAndShow("transition", "push")}>Push</c.MenuItem>
                <c.MenuItem onClick={card.adjustTransitionAndShow("transition", "scale down")}>Scale Down</c.MenuItem>
                <c.MenuItem onClick={card.adjustTransitionAndShow("transition", "uncover")}>Uncover</c.MenuItem>
                <c.MenuItem onClick={card.adjustTransitionAndShow("transition", "slide along")}>Slide Along</c.MenuItem>
                <c.MenuItem onClick={card.adjustTransitionAndShow("transition", "slide out")}>Slide Out</c.MenuItem>
              </c.Menu>
              <c.Segment appearance="bottom attached pushable">
                <c.Sidebar ref="transition" appearance="inverted labeled icon vertical menu" content={data.iconMenu}/>
                <c.Pusher>
                  <c.Segment appearance="basic">
                    <c.LoremIpsum/>
                  </c.Segment>
                </c.Pusher>
              </c.Segment>
              <c.Bug>SUI appears to scroll the page to the top on `scale down`. <c.Icon icon="frown"/> </c.Bug>
            </c.Example>

          </c.PageSection>
        </c.Page>
      </c.CardContainer>
    );
  }
}
