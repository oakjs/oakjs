"use strict";
import React from "react";
import Card from "oak/Card";

export default class FeedCard extends Card {
  static defaultProps = {
    id: "Feed",
    title: "Feed"
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
          <c.PageTitle title="Feed">
            A feed presents user activity chronologically.
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title="Normal">
              <c.Feed>
                <c.FeedEvent meta={<a><i className="thumbs up icon"/>like</a>} date="Yesterday" author="Stevie" avatar={data.stevieAvatar} authorLink="/joe" summary="added you as a friend"/>
                <c.FeedEvent meta={<a><i className="like icon"/>4 likes</a>} date="3:30pm" author="Joe" avatar={data.joeAvatar} authorLink="/joe" summary="added two new images">
                  <div className="extra images">
                    <a><img src={data.image}/></a>
                    <a><img src={data.image}/></a>
                  </div>
                </c.FeedEvent>
                <c.FeedEvent meta={<a><i className="reply icon"/>reply</a>} date="1 hour ago" author="Elliot" avatar={data.elliotAvatar} authorLink="/elliot" summary="posted on his page">
                  <div className="extra text">
                    Ours is a life of constant reruns. We're always circling back to where we'd we started, then starting all over again. Even if we don't run extra laps that day, we surely will come back for more of the same another day soon.
                  </div>
                </c.FeedEvent>
              </c.Feed>
            </c.Example>

            <c.Example title="Header" hint="<Feed header='...'/>">
              <c.Segment appearance="compact">
                <c.Feed header='Your Feed'>
                  <c.FeedEvent meta={<a><i className="thumbs up icon"/>like</a>} date="Yesterday" author="Stevie" avatar={data.stevieAvatar} authorLink="/joe" summary="added you as a friend"/>
                  <c.FeedEvent meta={<a><i className="like icon"/>4 likes</a>} date="3:30pm" author="Joe" avatar={data.joeAvatar} authorLink="/joe" summary="added two new images">
                    <div className="extra images">
                      <a><img src={data.image}/></a>
                      <a><img src={data.image}/></a>
                    </div>
                  </c.FeedEvent>
                  <c.FeedEvent meta={<a><i className="reply icon"/>reply</a>} date="1 hour ago" author="Elliot" avatar={data.elliotAvatar} authorLink="/elliot" summary="posted on his page">
                    <div className="extra text">
                      Ours is a life of constant reruns. We're always circling back to where we'd we started, then starting all over again. Even if we don't run extra laps that day, we surely will come back for more of the same another day soon.
                    </div>
                  </c.FeedEvent>
                </c.Feed>
              </c.Segment>
            </c.Example>

            <c.Example title="Sizes" hint="<Feed size='small'/>">
              <c.Spacer/>
              <c.Feed size='small' header='Followers activity' headerAppearance=''>
                <c.FeedEvent author="Stevie" authorLink="/joe" summary="added you as a friend"/>
                <c.FeedEvent author="Joe" authorLink="/joe" summary="added two new images"/>
                <c.FeedEvent author="Elliot" authorLink="/elliot" summary="posted on his page"/>
              </c.Feed>

              <c.Spacer/>
              <c.Divider/>
              <c.Spacer/>

              <c.Feed size='large'>
                <c.FeedEvent meta={<a><i className="thumbs up icon"/>like</a>} date="Yesterday" author="Stevie" avatar={data.stevieAvatar} authorLink="/joe" summary="added you as a friend"/>
                <c.FeedEvent meta={<a><i className="like icon"/>4 likes</a>} date="3:30pm" author="Joe" avatar={data.joeAvatar} authorLink="/joe" summary="added two new images">
                  <div className="extra images">
                    <a><img src={data.image}/></a>
                    <a><img src={data.image}/></a>
                  </div>
                </c.FeedEvent>
                <c.FeedEvent meta={<a><i className="reply icon"/>reply</a>} date="1 hour ago" author="Elliot" avatar={data.elliotAvatar} authorLink="/elliot" summary="posted on his page">
                  <div className="extra text">
                    Ours is a life of constant reruns. We're always circling back to where we'd we started, then starting all over again. Even if we don't run extra laps that day, we surely will come back for more of the same another day soon.
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
