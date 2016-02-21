"use strict";
import React from "react";
import Card from "oak/Card";

export default class LabelsCard extends Card {
  static defaultProps = {
    id: "Labels",
    title: "Labels"
  }

  getInitialData() {
    return {
      joeAvatar: "http://semantic-ui.com/images/avatar/large/joe.jpg",
      elliotAvatar: "http://semantic-ui.com/images/avatar/large/elliot.jpg",
      stevieAvatar: "http://semantic-ui.com/images/avatar/large/stevie.jpg",
      placeholderImage: "http://semantic-ui.com/images/wireframe/image.png",
      onClosed: function(who){ alert(`Closed ${who}.`) }
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
          <c.PageTitle title="Labels">
            A group of <c.Link card="SUI/examples/Label">Labels</c.Link>.
          </c.PageTitle>


          <c.PageSection title="Appearance">

            <c.Example title="Normal" hint="<Labels/>">
              <c.Labels>
                <c.Label>Text label</c.Label>
                <c.Label icon="mail" content="Messages" detail="30"/>
                <c.Label content="Item with detail" detail="Detail"/>
                <c.Label image={data.elliotAvatar} size="small">Elliot</c.Label>
              </c.Labels>
            </c.Example>

            <c.Example title="Colors" hint="<Labels color='red'/>">
                <c.Labels color="red">
                  <c.Label>Text label</c.Label>
                  <c.Label icon="mail" content="Messages" detail="30"/>
                  <c.Label content="Item with detail" detail="Detail"/>
                  <c.Label image={data.elliotAvatar} size="small">Elliot</c.Label>
                </c.Labels>
            </c.Example>

            <c.Example title="Circular" hint="<Labels appearance='circular'/>">
                <c.Labels appearance="circular">
                  <c.Label>2</c.Label>
                  <c.Label>200</c.Label>
                  <c.Label>20,000</c.Label>
                  <c.Label>2,000,000</c.Label>
                </c.Labels>
            </c.Example>

            <c.Example title="Dots (empty circular)" hint="<Labels appearance='empty circular'/>">
                <c.Labels appearance="empty circular">
                  <c.Label color="red"/>
                  <c.Label color="green"/>
                  <c.Label color="blue"/>
                  <c.Label color="yellow"/>
                </c.Labels>
            </c.Example>

            <c.Example title="Tag" hint="<Labels appearance='tag'/>">
                <c.Labels appearance="tag">
                  <c.Label>Text label</c.Label>
                  <c.Label icon="mail" content="Messages" detail="30"/>
                  <c.Label color="grey" content="Item with detail" detail="Detail"/>
                </c.Labels>
            </c.Example>

            <c.Example title="horizontal" hint="<Labels appearance='horizontal'/>">
                <c.Labels appearance="horizontal">
                  <c.Label>Text label</c.Label>
                  <c.Label icon="mail" content="Messages" detail="30"/>
                  <c.Label color="grey" content="Item with detail" detail="Detail"/>
                  Text Here
                </c.Labels>
            </c.Example>

            <c.Example title="Sizes" hint="<Labels size='large'/>">
                <c.Labels size="tiny">
                  <c.Label>Tiny label</c.Label>
                  <c.Label icon="mail" content="Messages" detail="30"/>
                  <c.Label color="grey" content="Item with detail" detail="Detail"/>
                </c.Labels>

                <c.Labels size="large">
                  <c.Label>Large label</c.Label>
                  <c.Label icon="mail" content="Messages" detail="30"/>
                  <c.Label color="grey" content="Item with detail" detail="Detail"/>
                </c.Labels>
            </c.Example>

            <c.Example title="Fluid" hint="<Labels appearance='fluid'/>">
                <c.Labels appearance="fluid">
                  <c.Label>Text label</c.Label>
                  <c.Label icon="mail" content="Messages" detail="30"/>
                  <c.Label color="grey" content="Item with detail" detail="Detail"/>
                </c.Labels>
            </c.Example>


          </c.PageSection>

          <c.PageSection title="States">

            <c.Example title="Hidden" hint="<Labels hidden/>">
              <c.Label pointing="down">Hidden labels here</c.Label>
              <c.Labels hidden>
                <c.Label>Text label</c.Label>
                <c.Label icon="mail" content="Messages" detail="30"/>
                <c.Label content="Item with detail" detail="Detail"/>
                <c.Label image={data.elliotAvatar} size="small">Elliot</c.Label>
              </c.Labels>
              <c.Label pointing="up">Hidden labels here</c.Label>
            </c.Example>

            <c.Example title="Disabled" hint="<Labels disabled/>">
              <c.Labels disabled>
                <c.Label>Text label</c.Label>
                <c.Label icon="mail" content="Messages" detail="30"/>
                <c.Label content="Item with detail" detail="Detail"/>
                <c.Label image={data.elliotAvatar} size="small">Elliot</c.Label>
              </c.Labels>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Not Working but should work... ?">

            <c.Example title="Basic" hint="<Labels appearance='basic'/>">
              <c.Bug>This appears to be broken in Semantic UI.</c.Bug>
              <c.Labels appearance="basic">
                <c.Label>Text label</c.Label>
                <c.Label icon="mail" content="Messages" detail="30"/>
                <c.Label content="Item with detail" detail="Detail"/>
                <c.Label image={data.elliotAvatar} size="small">Elliot</c.Label>
              </c.Labels>
            </c.Example>

            <c.Example title="Transparent" hint="<Labels appearance='transparent'/>">
              <c.Bug>This appears to be broken in Semantic UI.</c.Bug>
              <c.Labels appearance="transparent">
                <c.Label>Text label</c.Label>
                <c.Label icon="mail" content="Messages" detail="30"/>
                <c.Label content="Item with detail" detail="Detail"/>
                <c.Label image={data.elliotAvatar} size="small">Elliot</c.Label>
              </c.Labels>
            </c.Example>

            <c.Example title="Inverted" hint="<Labels appearance='inverted'/>">
              <c.Bug>This appears to be broken in Semantic UI.</c.Bug>
              <c.Segment appearance="inverted">
                <c.Labels appearance="inverted">
                  <c.Label>Text label</c.Label>
                  <c.Label icon="mail" content="Messages" detail="30"/>
                  <c.Label content="Item with detail" detail="Detail"/>
                  <c.Label image={data.elliotAvatar} size="small">Elliot</c.Label>
                </c.Labels>
              </c.Segment>
            </c.Example>

            <c.Example title="active" hint="<Labels active/>">
              <c.Bug>This appears to be broken in Semantic UI.</c.Bug>
              <c.Labels active>
                <c.Label>Text label</c.Label>
                <c.Label icon="mail" content="Messages" detail="30"/>
                <c.Label content="Item with detail" detail="Detail"/>
                <c.Label image={data.elliotAvatar} size="small">Elliot</c.Label>
              </c.Labels>
            </c.Example>

            <c.Example title="Closable" hint="<Labels closable/>">
              <c.Bug>Unclear how to do this in react... :-(</c.Bug>
              <c.Labels closable>
                <c.Label>Text label</c.Label>
                <c.Label icon="mail" content="Messages" detail="30"/>
                <c.Label content="Item with detail" detail="Detail"/>
                <c.Label image={data.elliotAvatar} size="small">Elliot</c.Label>
              </c.Labels>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}
