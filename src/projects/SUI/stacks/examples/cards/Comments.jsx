"use strict";
import React from "react";
import { Card } from "oak";

export default class CommentsCard extends Card {
  static defaultProps = {
    id: "Comments",
    title: "Comments"
  }

  getInitialData() {
    return {
      joeAvatar: "http://semantic-ui.com/images/avatar/small/joe.jpg",
      elliotAvatar: "http://semantic-ui.com/images/avatar/small/elliot.jpg",
      stevieAvatar: "http://semantic-ui.com/images/avatar/small/stevie.jpg",
      mattAvatar: "http://semantic-ui.com/images/avatar/small/matt.jpg",
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
          <c.PageTitle title="Comments">
            A list of comments.
            <c.Todo>Reply form</c.Todo>
          </c.PageTitle>

          <c.PageSection title="Content">
            <c.Example title="Header attribute">
              <c.Comments header="Comments">
                <c.Comment metadata="Yesterday at 12:30AM" author="Elliot" avatar={data.elliotAvatar} text="Super duper!" actions={data.actions}/>
                <c.Comment metadata="10 minutes ago" author="Stevie" avatar={data.stevieAvatar} text="That makes me happy!!" actions={data.actions}/>
                <c.Comment metadata="Just now" author="Joe" avatar={data.joeAvatar} text="That's rad!" actions={data.actions}/>
              </c.Comments>
            </c.Example>
          </c.PageSection>

          <c.PageSection title="Apperance">
            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Basic">
                  <c.Comments>
                    <c.Comment metadata="Yesterday at 12:30AM" author="Elliot" avatar={data.elliotAvatar} text="Super duper!" actions={data.actions}/>
                    <c.Comment metadata="10 minutes ago" author="Stevie" avatar={data.stevieAvatar} text="That makes me happy!!" actions={data.actions}/>
                    <c.Comment metadata="Just now" author="Joe" avatar={data.joeAvatar} text="That's rad!" actions={data.actions}/>
                  </c.Comments>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Minimal" hint="<Comments appearance='minimal'/>">
                  <c.Comments appearance="minimal">
                    <c.Comment metadata="Yesterday at 12:30AM" author="Elliot" avatar={data.elliotAvatar} text="Super duper!" actions={data.actions}/>
                    <c.Comment metadata="10 minutes ago" author="Stevie" avatar={data.stevieAvatar} text="That makes me happy!!" actions={data.actions}/>
                    <c.Comment metadata="Just now" author="Joe" avatar={data.joeAvatar} text="That's rad!" actions={data.actions}/>
                  </c.Comments>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Nested" hint="<Comment...><Comments/></Comment>">
                  <c.Comments>
                    <c.Comment metadata="Tuesday at 2pm" author="Stevie" avatar={data.stevieAvatar} text="Elliot, how did it go????"/>
                    <c.Comment metadata="Yesterday at 12:30AM" author="Elliot" avatar={data.elliotAvatar} text="I got the job!">
                      <c.Comments>
                        <c.Comment metadata="2 hours ago" author="Joe" avatar={data.joeAvatar} text="That's rad!">
                          <c.Comments>
                            <c.Comment metadata="Just now" author="Elliot" avatar={data.elliotAvatar} text="Yes it is!"/>
                          </c.Comments>
                        </c.Comment>
                      </c.Comments>
                    </c.Comment>
                    <c.Comment metadata="10 minutes ago" author="Stevie" avatar={data.stevieAvatar} text="That makes me happy!!">
                      <c.Comments>
                        <c.Comment metadata="Just now" author="Elliot" avatar={data.elliotAvatar} text="I know, right?!?!"/>
                      </c.Comments>
                    </c.Comment>
                    <c.Comment metadata="5 minutes ago" author="Matt" avatar={data.mattAvatar} text="Drinks are on Elliot!!"/>
                  </c.Comments>
                </c.Example>
                <c.Bug>There's some extraneous space under the nested comments.</c.Bug>
              </c.Column>

              <c.Column>
                <c.Example title="Threaded" hint="<Comments appearance='threaded'/>">
                  <c.Comments appearance="threaded">
                    <c.Comment metadata="Tuesday at 2pm" author="Stevie" avatar={data.stevieAvatar} text="Elliot, how did it go????"/>
                    <c.Comment metadata="Yesterday at 12:30AM" author="Elliot" avatar={data.elliotAvatar} text="I got the job!">
                      <c.Comments>
                        <c.Comment metadata="2 hours ago" author="Joe" avatar={data.joeAvatar} text="That's rad!">
                          <c.Comments>
                            <c.Comment metadata="Just now" author="Elliot" avatar={data.elliotAvatar} text="Yes it is!"/>
                          </c.Comments>
                        </c.Comment>
                      </c.Comments>
                    </c.Comment>
                    <c.Comment metadata="10 minutes ago" author="Stevie" avatar={data.stevieAvatar} text="That makes me happy!!">
                      <c.Comments>
                        <c.Comment metadata="Just now" author="Elliot" avatar={data.elliotAvatar} text="I know, right?!?!"/>
                      </c.Comments>
                    </c.Comment>
                    <c.Comment metadata="5 minutes ago" author="Matt" avatar={data.mattAvatar} text="Drinks are on Elliot!!"/>
                  </c.Comments>
                  <c.Bug>The extra line below Joe looks weird...</c.Bug>
                </c.Example>
              </c.Column>
            </c.Grid>
          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}
