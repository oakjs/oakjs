"use strict";
import React from "react";
import Card from "oak/Card";

export default class MessageCard extends Card {
  static defaultProps = {
    id: "Message",
    title: "Message"
  }

  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Message">
            A dimmer hides distractions to focus attention on particular content.
            <c.Todo>Visual effects when showing and hiding!</c.Todo>
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title="Inline content" hint="<Message>...</Message>">
              <c.Message>Inline content.</c.Message>
              <c.Message>
                <div className="header">Inline header</div>
                Inline content.
              </c.Message>
            </c.Example>

            <c.Example title="Content and header attributes" hint="<Message content='...' header='...'/>">
              <c.Message content="Content attribute."/>
              <c.Message header="Header attribute" content="Content attribute."/>
            </c.Example>

            <c.Example title="Icon" hint="<Message icon='...'/>">
              <c.Message icon="inbox" header="Have you heard about your mailing list?" content="Get the best news to your inbox every day."/>
            </c.Example>

            <c.Example title="Closable" hint="<Dimmer closable onClose='...'/>">
              <c.Enablers for="closable" ref="closableEnablers" visibleOnly/>
              <c.Message closable onClose={()=>card.refs.closableEnablers.result = "onClose() called"}
                         ref="closable"
                         header="Welcome back!" content="Things have changed, have a look around"/>
            </c.Example>

          </c.PageSection>


          <c.PageSection title="States">

            <c.Example title="Visible" hint="<Message visible/>">
              <c.Message visible content="I am initially visible!"/>
            </c.Example>

            <c.Example title="Hidden" hint="<Message visible={false}/>">
              <c.Label pointing="right" content="Hidden message here"/>
              <c.Message visible={false} content="You can't see me!"/>
              <c.Label pointing="left" content="Hidden message here"/>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Variations">

            <c.Example title="Floating" hint="<Message appearance='floating'/>">
              <c.Message appearance="floating" content="I appear to be floating above the page!"/>
            </c.Example>

            <c.Example title="Compact" hint="<Message appearance='compact'/>">
              <c.Message appearance="compact" content="I'm compact so I dont take up the whole line."/>
            </c.Example>

            <c.Example title="Attached" hint="<Message appearance='attached'/> or <Message appearance='bottom attached'/>">
              <c.Message appearance="attached" header="Welcome to our site!"/>
              <c.Segment appearance="attached">
                <c.LoremIpsum/>
              </c.Segment>
              <c.Message appearance="info bottom attached" icon="help">Want help?  <a href="#"> Click here!</a></c.Message>
            </c.Example>

            <c.Example title="Warning" hint="<Message appearance='warning'/>">
              <c.Message appearance="warning" closable header="Oops!" content="You must register before you can do that."/>
            </c.Example>

            <c.Example title="Info" hint="<Message appearance='info'/>">
              <c.Message appearance="info" closable header="Howdy!" content="It's good to see you again!"/>
            </c.Example>

            <c.Example title="Positive / Success" hint="<Message appearance='positive'/> or <Message appearance='success'/>">
              <c.Message appearance="positive" header="You've earned a reward" content="Log in to claim it!"/>
              <c.Message appearance="success" closable icon="small dollar" content="The money was transferred into your account."/>
            </c.Example>

            <c.Example title="Negative / Error" hint="<Message appearance='negative'/> or <Message appearance='error'/>">
              <c.Message appearance="negative" header="We're sorry..." content="That just won't work."/>
              <c.Message appearance="error" closable icon="small warning sign" content="Please enter a password that's at least 20 characters long."/>
            </c.Example>

            <c.Example title="Colors" hint="<Message color='red'/>">
              <c.Message color='red' content="Red"/>
              <c.Message color='orange' content="Orange"/>
              <c.Message color='yellow' content="Yellow"/>
              <c.Message color='olive' content="Olive"/>
              <c.Message color='green' content="Green"/>
              <c.Message color='teal' content="Teal"/>
              <c.Message color='blue' content="Blue"/>
              <c.Message color='violet' content="Violet"/>
              <c.Message color='purple' content="Purple"/>
              <c.Message color='pink' content="Pink"/>
              <c.Message color='brown' content="Brown"/>
              <c.Message color='black' content="Black"/>
            </c.Example>

            <c.Example title="Sizes" hint="<Message size='large'/>">
              <c.Message size="small" icon="settings" content="A small message"/>
              <c.Message size="medium" icon="settings" content="A medium message (default size)"/>
              <c.Message size="large" icon="settings" content="A large message"/>
              <c.Message size="huge" icon="settings" content="A huge message"/>
              <c.Message size="massive" icon="settings" content="A massive message"/>
            </c.Example>
          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}
