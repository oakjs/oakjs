"use strict";
import React from "react";
import { Card } from "oak";

export default class AdCard extends Card {
  static defaultProps = {
    id: "Ad",
    title: "Ad"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Ad">
            An ad displays third-party promotional content
            <c.Info>
              SUI Ads don't actually serve ads -- you should create
              a subclass of this element for your particular ad network.
            </c.Info>
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title="Common Units">
              <c.Ad size="banner" test/>
              <c.Ad size="leaderboard" test/>
              <c.Grid columns={2}>
                <c.Column>
                  <c.Ad size="medium rectangle" test/>
                  <c.Spacer/>
                  <c.Ad size="large rectangle" test/>
                </c.Column>
                <c.Column>
                  <c.Ad size="half page" test/>
                </c.Column>
              </c.Grid>
            </c.Example>

            <c.Example title="Mobile Sizes">
              <c.Info>Mobile ads only appear when in mobile viewport width.</c.Info>
              <c.Ad size="mobile leaderboard" test/>
              <c.Ad size="mobile banner" test/>
            </c.Example>

            <c.Example title="Rectangle Sizes">
              <c.Grid columns={2}>
                <c.Column>
                  <c.Ad size="small rectangle" test/>
                </c.Column>
                <c.Column>
                  <c.Ad size="vertical rectangle" test/>
                </c.Column>
              </c.Grid>
            </c.Example>

            <c.Example title="Button Sizes">
              <c.Grid columns={3}>
                <c.Column>
                  <c.Ad size="button" test/>
                </c.Column>
                <c.Column>
                  <c.Ad size="square button" test/>
                </c.Column>
                <c.Column>
                  <c.Ad size="small button" test/>
                </c.Column>
              </c.Grid>
            </c.Example>

            <c.Example title="Skyscraper Sizes">
              <c.Grid columns={2}>
                <c.Column>
                  <c.Ad size="skyscraper" test/>
                </c.Column>
                <c.Column>
                  <c.Ad size="wide skyscraper" test/>
                </c.Column>
              </c.Grid>
            </c.Example>

            <c.Example title="Banner">
              <c.Ad size="half banner" test/>
              <c.Ad size="banner" test/>
              <c.Ad size="top banner" test/>
              <c.Ad size="vertical banner" test/>
            </c.Example>

            <c.Example title="Leaderboard">
              <c.Ad size="leaderboard" test/>
              <c.Ad size="large leaderboard" test/>
              <c.Ad size="billboard" test/>
            </c.Example>

            <c.Example title="Panorama">
              <c.Ad size="panorama" test/>
            </c.Example>

            <c.Example title="Netboard">
              <c.Ad size="netboard" test/>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Appearance">

            <c.Example title="Centered" hint="<Ad appearance='centered'/>">
              <c.Ad size="half banner" appearance="centered" test/>
            </c.Example>

            <c.Example title="Hidden" hint="<Ad hidden/>">
              <c.Label pointing="right">Hidden ad here</c.Label>
              <c.Ad size="half banner" hidden test/>
              <c.Label pointing="left">Hidden ad here</c.Label>
            </c.Example>

            <c.Example title="Test" hint="<Ad test/> or <Ad test='text to show'/>">
              <c.Ad size="leaderboard" test/>
              <c.Ad size="leaderboard" test="custom text in leaderboard ad"/>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}
