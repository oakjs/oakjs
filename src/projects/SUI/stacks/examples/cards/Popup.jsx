"use strict";
import React from "react";
import Card from "oak/Card";

export default class PopupCard extends Card {
  static defaultProps = {
    id: "Popup",
    title: "Popup"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Popup">
            A popup displays additional information on top of a page
          </c.PageTitle>

          <c.PageSection title="Content">
            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Inline Content" hint="<Popup>...</Popup>">
                  <c.Button>Hover Over Me</c.Button>
                  <c.Popup>
                    <div className="header">Wow!</div>
                    Inline content <i>just works</i>!
                  </c.Popup>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Header & Content" hint="<Popup title='...' content='...'/>">
                  <c.Button>Hover Over Me</c.Button>
                  <c.Popup title="And and and..." content="Content attributes work, too!"/>
                </c.Example>
              </c.Column>
            </c.Grid>
          </c.PageSection>

          <c.PageSection title="Events">
            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Explicit target element" hint="<Popup target='...'/>">
                  <c.Button id='explicitTarget'>Hover Over Me</c.Button>
                  <c.Spacer/>
                  <c.Button>But Not Over Me</c.Button>
                  <c.Popup target="#explicitTarget" title="Achievement Unlocked" content="Explicit target works"/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Popup on click" hint="<Popup on='click'/>">
                  <c.Button>Click Me</c.Button>
                  <c.Popup on='click' title="Achievement Unlocked" content="Click button works!"/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Hoverable" hint="<Popup hoverable={true}/>">
                  <c.Button>Click Me</c.Button>
                  <c.Popup hoverable={true} title="Move mouse inside...">
                    <c.Button>So you can click me!</c.Button>
                  </c.Popup>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Event handlers (check out console)" hint="<Popup onShow={...}/>">
                  <c.Button>Hover over me</c.Button>
                  <c.Popup title="Move mouse inside..." content="Blah blah blah"
                    onCreate={(e)=> console.log("onCreate(", e, ") called")}
                    onRemove={(e)=> console.log("onRemove(", e, ") called")}
                    onShow={(e)=> console.log("onShow(", e, ") called")}
                    onVisible={(e)=> console.log("onVisible(", e, ") called")}
                    onHide={(e)=> console.log("onHide(", e, ") called")}
                    onHidden={(e)=> console.log("onHidden(", e, ") called")}
                    onUnplaceable={(e)=> console.log("onUnplaceable(", e, ") called")}
                  />

                  <c.Button>Click me</c.Button>
                  <c.Popup on="click" title="Click the button..." content="Blah blah blah"
                    onCreate={(e)=> console.log("onCreate(", e, ") called")}
                    onRemove={(e)=> console.log("onRemove(", e, ") called")}
                    onShow={(e)=> console.log("onShow(", e, ") called")}
                    onVisible={(e)=> console.log("onVisible(", e, ") called")}
                    onHide={(e)=> console.log("onHide(", e, ") called")}
                    onHidden={(e)=> console.log("onHidden(", e, ") called")}
                    onUnplaceable={(e)=> console.log("onUnplaceable(", e, ") called")}
                  />
                </c.Example>
              </c.Column>

            </c.Grid>
          </c.PageSection>



          <c.PageSection title="Appearance">
            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Basic" hint="<Popup appearance='basic'/>">
                  <c.Button icon="plus"/>
                  <c.Popup appearance="basic" content="The default theme's basic popup just hides the arrow."/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Width" hint="<Popup appearance='wide'/> or <Popup appearance='very wide'/>">
                  <c.Button>Wide</c.Button>
                  <c.Popup appearance="wide"><c.LoremIpsum short/></c.Popup>
                  <c.Button>Very Wide</c.Button>
                  <c.Popup appearance="very wide"><c.LoremIpsum short/></c.Popup>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Fluid" hint="<Popup appearance='fluid'/>">
                  <c.Button>Fluid</c.Button>
                  <c.Popup appearance="fluid"><c.LoremIpsum short/></c.Popup>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Flowing" hint="<Popup appearance='flowing'/>">
                  <c.Button>Flowing</c.Button>
                  <c.Popup appearance="flowing"><c.LoremIpsum short/></c.Popup>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Inverted" hint="<Popup appearance='inverted'/>">
                  <c.Button>Inverted</c.Button>
                  <c.Popup appearance="inverted"><c.LoremIpsum tiny/></c.Popup>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Offset" hint="<Popup offset={50}/>">
                  <c.Button>Offset</c.Button>
                  <c.Popup offset={100}>I should be positioned off to the left</c.Popup>
                </c.Example>
              </c.Column>


              <c.Column>
                <c.Example title="Position" hint="<Popup position='top left'/>">
                  <c.Segment style={{height:200}}>
                    <c.Icon icon="heart" color='red' style={{position: "absolute", left:10, top: 10}}/>
                    <c.Popup position="top left" content="top left positioned popup"/>

                    <c.Icon icon="heart" color='red' style={{position: "absolute", left:"50%", top: 10}}/>
                    <c.Popup position="top center" content="top center positioned popup"/>

                    <c.Icon icon="heart" color='red' style={{position: "absolute", right:10, top: 10}}/>
                    <c.Popup position="top right" content="top right positioned popup"/>

                    <c.Icon icon="heart" color='red' style={{position: "absolute", left:10, top: "50%"}}/>
                    <c.Popup position="left center" content="left center positioned popup"/>

                    <c.Icon icon="heart" color='red' style={{position: "absolute", right:10, top: "50%"}}/>
                    <c.Popup position="right center" content="right center positioned popup"/>

                    <c.Icon icon="heart" color='red' style={{position: "absolute", left:10, bottom: 10}}/>
                    <c.Popup position="bottom left" content="bottom left positioned popup"/>

                    <c.Icon icon="heart" color='red' style={{position: "absolute", left:"50%", bottom: 10}}/>
                    <c.Popup position="bottom center" content="bottom center positioned popup"/>

                    <c.Icon icon="heart" color='red' style={{position: "absolute", right:10, bottom: 10}}/>
                    <c.Popup position="bottom right" content="bottom right positioned popup"/>
                  </c.Segment>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Size" hint="<Popup size='small'/>">
                  <c.Button size="mini">Mini</c.Button>
                  <c.Popup size="mini" content="A mini popup for a mini button."/>

                  <c.Spacer/>
                  <c.Button size="tiny">Tiny</c.Button>
                  <c.Popup size="tiny" content="A tiny popup for a tiny button."/>

                  <c.Spacer/>
                  <c.Button size="small">Small</c.Button>
                  <c.Popup size="small" content="A small popup for a small button."/>

                  <c.Spacer/>
                  <c.Button size="medium">Medium</c.Button>
                  <c.Popup size="medium" content="A medium popup for a medium button."/>

                  <c.Spacer/>
                  <c.Button size="large">Large</c.Button>
                  <c.Popup size="large" content="A large popup for a large button."/>

                  <c.Spacer/>
                  <c.Button size="huge">Huge</c.Button>
                  <c.Popup size="huge" content="A huge popup for a huge button."/>
               </c.Example>
              </c.Column>
            </c.Grid>
          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}
