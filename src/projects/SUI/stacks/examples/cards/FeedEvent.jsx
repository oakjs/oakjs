"use strict";
import React from "react";
import Card from "oak/Card";

export default class FeedEventCard extends Card {
  static defaultProps = {
    id: "FeedEvent",
    title: "FeedEvent"
  }

  getInitialData() {
    return {
      joeAvatar: "http://semantic-ui.com/images/avatar/small/joe.jpg",
      elliotAvatar: "http://semantic-ui.com/images/avatar/small/elliot.jpg",
      stevieAvatar: "http://semantic-ui.com/images/avatar/small/stevie.jpg",
      image: "http://semantic-ui.com/images/wireframe/image.png",
      actions: [
        <a className="like" href="reply"><i className="thumbs outline up icon"/>Like</a>,
        <a className="reply" href="#"><i className="reply icon"/>Reply</a>
      ]
    };
  }

  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="FeedEvent">
            Single event in a feed.
            <c.Info>Note that &lt;FeedEvent&gt; elements must be inside a &lt;Feed&gt; element to format properly.</c.Info>
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Example title="Summary attribute">
              <c.Feed>
                <c.FeedEvent summary="Simple feed event summary"/>
                <c.FeedEvent summary={<span><a href="#">Joe</a> added <a href="#">2 new illustrations</a> to his page</span>}/>
              </c.Feed>
            </c.Example>

            <c.Example title="Author and authorLink attributes">
              <c.Feed>
                <c.FeedEvent author="Joe" summary="posted something without an authorLink"/>
                <c.FeedEvent author="Joe" authorLink="/joe" summary="posted something with an authorLink"/>
              </c.Feed>
            </c.Example>

            <c.Example title="Avatar attribute">
              <c.Feed>
                <c.FeedEvent author="Joe" avatar={data.joeAvatar} summary="posted something without an authorLink"/>
                <c.FeedEvent author="Joe" avatar={data.joeAvatar} authorLink="/joe" summary="posted something with an authorLink"/>
              </c.Feed>
            </c.Example>

            <c.Example title="Icon attribute">
              <c.Feed>
                <c.FeedEvent author="Joe" icon="pencil" summary="You posted on your friend's wall."/>
              </c.Feed>
            </c.Example>

            <c.Example title="Date attribute" hint="<FeedEvent date='...'/>">
              <c.Feed>
                <c.FeedEvent date="Yesterday" author="Joe" avatar={data.joeAvatar} authorLink="/joe" summary="added you as a friend"/>
                <c.FeedEvent date="1 hour ago" author="Elliot" avatar={data.elliotAvatar} authorLink="/elliot" summary="signed up for the site"/>
              </c.Feed>
            </c.Example>

            <c.Example title="Date attribute dateOn=top" hint="<FeedEvent date='...' dateOn='top'/>">
              <c.Feed>
                <c.FeedEvent dateOn='top' date="Yesterday" author="Joe" avatar={data.joeAvatar} authorLink="/joe" summary="added you as a friend"/>
                <c.FeedEvent dateOn='top' date="1 hour ago" author="Elliot" avatar={data.elliotAvatar} authorLink="/elliot" summary="signed up for the site"/>
              </c.Feed>
            </c.Example>

            <c.Example title="Meta content" hint="<FeedEvent meta='...'/>">
              <c.Feed>
                <c.FeedEvent meta={<a><i className="like icon"/>4 likes</a>} date="Yesterday" author="Joe" avatar={data.joeAvatar} authorLink="/joe" summary="added you as a friend"/>
                <c.FeedEvent meta={<a><i className="check icon"/>approve mebership</a>} dateOn='top' date="1 hour ago" author="Elliot" avatar={data.elliotAvatar} authorLink="/elliot" summary="signed up for the site"/>
              </c.Feed>
            </c.Example>

            <c.Example title="Extra content" hint="<FeedEvent><div className='extra ...'>...</div></FeedEvent>">
              <c.Feed>
                <c.FeedEvent meta={<a><i className="like icon"/>4 likes</a>} dateOn='top' date="Yesterday" author="Joe" avatar={data.joeAvatar} authorLink="/joe" summary="added two new images">
                  <div className="extra images">
                    <a><img src={data.image}/></a>
                    <a><img src={data.image}/></a>
                  </div>
                </c.FeedEvent>
                <c.FeedEvent meta={<a><i className="reply icon"/>reply</a>} dateOn='top' date="1 hour ago" author="Elliot" avatar={data.elliotAvatar} authorLink="/elliot" summary="created a post">
                  <div className="extra text">
                    Can you believe what JLaw said at the Oscars???
                  </div>
                </c.FeedEvent>
              </c.Feed>
            </c.Example>


          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}
