"use strict";
import React from "react";
import Card from "oak/Card";

export default class CommentCard extends Card {
  static defaultProps = {
    id: "Comment",
    title: "Comment"
  }

  getInitialData() {
    return {
      joeAvatar: "http://semantic-ui.com/images/avatar/small/joe.jpg",
      elliotAvatar: "http://semantic-ui.com/images/avatar/small/elliot.jpg",
      stevieAvatar: "http://semantic-ui.com/images/avatar/small/stevie.jpg",
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
          <c.PageTitle title="Comment">
            A comment displays user feedback to site content
            <c.Info>Note that &lt;Comment&gt; elements must be inside a &lt;Comments&gt; element to format properly.</c.Info>
            <c.Todo>Reply form</c.Todo>
          </c.PageTitle>

          <c.PageSection title="Content">
            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Text attribute" hint="<Comment text='...'/>">
                  <c.Comments>
                    <c.Comment text="Comment 1"/>
                    <c.Comment text="Comment 2"/>
                    <c.Comment text="Comment 3"/>
                  </c.Comments>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Author and AuthorLink attributes" hint="<Comment author='...'/>">
                  <c.Comments>
                    <c.Comment author="Elliot" text="This comment has no authorLink, so you can't click my name."/>
                    <c.Comment author="Joe" authorLink="/go/to/joe" text="This comment has an authorLink"/>
                  </c.Comments>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Avatar attribute" hint="<Comment avatar='...'/>">
                  <c.Comments>
                    <c.Comment author="Elliot" avatar={data.elliotAvatar} text="This comment has no authorLink, so you can't click my avatar."/>
                    <c.Comment author="Joe" avatar={data.joeAvatar} authorLink="/go/to/joe" text="This comment has an authorLink"/>
                  </c.Comments>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Metadata attribute" hint="<Comment metadata='...'/>">
                  <c.Comments>
                    <c.Comment metadata="Yesterday at 12:30AM" author="Elliot" avatar={data.elliotAvatar} text="I got the job!"/>
                    <c.Comment metadata="Just now" author="Joe" avatar={data.joeAvatar} text="Congratulations!"/>
                  </c.Comments>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Actions attribute" hint="<Comment actions={...}/>">
                  <c.Comments>
                    <c.Comment metadata="Yesterday at 12:30AM" author="Elliot" avatar={data.elliotAvatar} text="I got the job!" actions={data.actions}/>
                    <c.Comment metadata="10 minutes ago" author="Stevie" avatar={data.stevieAvatar} text="That makes me happy!!" actions={data.actions}/>
                    <c.Comment metadata="Just now" author="Joe" avatar={data.joeAvatar} text="Congratulations!" actions={data.actions}/>
                  </c.Comments>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Nested Comments" hint="<Comment...><Comments/></Comment>">
                  <c.Comments>
                    <c.Comment metadata="Yesterday at 12:30AM" author="Elliot" avatar={data.elliotAvatar} text="I got the job!">
                      <c.Comments>
                        <c.Comment metadata="2 hours ago" author="Joe" avatar={data.joeAvatar} text="That's rad!">
                          <c.Comments>
                            <c.Comment metadata="Just now" author="Elliot" avatar={data.elliotAvatar} text="Yes it is!"/>
                          </c.Comments>
                        </c.Comment>
                      </c.Comments>
                    </c.Comment>
                    <c.Comment metadata="10 minutes ago" author="Stevie" avatar={data.stevieAvatar} text="That makes me happy!!"/>
                  </c.Comments>
                </c.Example>

              </c.Column>
            </c.Grid>
          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}
