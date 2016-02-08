"use strict";
import React from "react";
import { Card } from "oak";

export default class ProgressCard extends Card {
  static defaultProps = {
    id: "Progress",
    title: "Progress"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Progress">
            A progress bar shows the progression of a task
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title="Standard">
              <c.Progress value={3} total={4} activeText="Uploading Files" showProgress/>
            </c.Example>

            <c.Example title="Indicating" hint="<Progress appearance='indicating'/>">
              <c.Progress appearance="indicating" value={3} total={4} activeText="Uploading Files" showProgress/>
            </c.Example>

            <c.Example title="Attached" hint="<Progress appearance='top attached'/>">
              <c.Segment>
                <c.Progress appearance="top attached" value={2} total={4}/>
                <c.LoremIpsum/>
                <c.Progress appearance="bottom attached" value={2} total={4}/>
              </c.Segment>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Content">

            <c.Example title="Bar">
              <c.Progress value={1} total={4}/>
            </c.Example>

            <c.Example title="Progress" hint="<Progress showProgress/>">
              <c.Progress value={3} total={4} showProgress/>
            </c.Example>

            <c.Example title="Percentage Label" hint="<Progress showProgress percentText='...'/>">
              <c.Progress ref="percentage" value={10} total={40} showProgress percentText='{percent}% completed'/>
              <c.Buttons>
                <c.Button onClick={()=> card.refs.percentage.decrement()} icon="minus"/>
                <c.Button onClick={()=> card.refs.percentage.increment()} icon="plus"/>
              </c.Buttons>
            </c.Example>

            <c.Example title="Ratio Label" hint="<Progress showProgress label='ratio' ratioText='...'/>">
              <c.Progress ref="ratio" value={10} total={40} showProgress label='ratio' ratioText="{value} of {total} files uploaded"/>
              <c.Buttons>
                <c.Button onClick={()=> card.refs.ratio.decrement()} icon="minus"/>
                <c.Button onClick={()=> card.refs.ratio.increment()} icon="plus"/>
              </c.Buttons>
            </c.Example>

            <c.Example title="Label" hint="<Progress activeText='...' successText='...'/>">
              <c.Progress ref="label" value={1} total={4}
                activeText="Uploading file {value} of {total}"
                successText="All files uploaded"
                warningText="We're experiencing network difficulties, please stand by..."
                errorText="You ran out of space to upload files."
                />
              <c.Buttons>
                <c.Button onClick={()=> card.refs.label.decrement()} icon="minus"/>
                <c.Button onClick={()=> card.refs.label.increment()} icon="plus"/>
              </c.Buttons>
              <c.Spacer inline/>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="States">
            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Disabled" hint="<Progress disabled/>">
                  <c.Progress disabled value={2} total={4}
                    activeText="Uploading file {value} of {total}"
                    />
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Success" hint="<Progress state='success' successText='...'/>">
                  <c.Progress state='success' value={4} total={4} showProgress
                    activeText="Uploading file {value} of {total}"
                    successText="All files uploaded"
                    />
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Warning" hint="<Progress state='warning' warningText='...'/>">
                  <c.Progress state='warning' value={4} total={4}
                    warningText="We're experiencing network difficulties, please stand by..."
                    />
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Error" hint="<Progress state='error' errorText='...'/>">
                  <c.Progress state='error' value={4} total={4}
                    errorText="Sorry, you ran out of space."
                    />
                </c.Example>
              </c.Column>

            </c.Grid>
          </c.PageSection>

          <c.PageSection title="States">
            <c.Example title="All states (look at console)" hint="<Progress onChange='...'/>">
              <c.Progress ref="states" value={0} total={4}
                onChange={()=>console.warn("onChange() fired")}
                onSuccess={()=>console.warn("onSuccess() fired")}
                onActive={()=>console.warn("onActive() fired")}
                onError={()=>console.warn("onError() fired")}
                onWarning={()=>console.warn("onWarning() fired")}
                />
              <c.Buttons>
                <c.Button onClick={()=> card.refs.states.decrement()} icon="minus"/>
                <c.Button onClick={()=> card.refs.states.increment()} icon="plus"/>
              </c.Buttons>
              <c.Todo>How to do onError and onWarning?</c.Todo>
            </c.Example>
          </c.PageSection>


          <c.PageSection title="Appearance">
            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Inverted" hint="<Progress appearance='inverted'/>">
                  <c.Segment appearance="inverted">
                    <c.Progress appearance="inverted" value={2} total={4} activeText="Uploading file {value} of {total}" showProgress/>
                    <c.Progress appearance="inverted" value={4} total={4} successText="Success" showProgress/>
                    <c.Progress appearance="inverted" state="warning" value={2} total={4} warningText="Warning" showProgress/>
                    <c.Progress appearance="inverted" state="error" value={4} total={4} errorText="Error" showProgress/>
                  </c.Segment>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Sizes" hint="<Progress size='small'/>">
                  <c.Progress size="tiny" activeText="Tiny" value={2} total={4}/>
                  <c.Progress size="small" activeText="Small" value={2} total={4}/>
                  <c.Progress size="medium" activeText="Medium (default size)" value={2} total={4}/>
                  <c.Progress size="large" activeText="Large" value={2} total={4}/>
                  <c.Progress size="big" activeText="Big" value={2} total={4}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Colors" hint="<Progress color='red'/>">
                  <c.Progress color="red" activeText="Red" value={2} total={15}/>
                  <c.Progress color="orange" activeText="Orange" value={3} total={15}/>
                  <c.Progress color="yellow" activeText="Yellow" value={4} total={15}/>
                  <c.Progress color="olive" activeText="Olive" value={5} total={15}/>
                  <c.Progress color="green" activeText="Green" value={6} total={15}/>
                  <c.Progress color="teal" activeText="Teal" value={7} total={15}/>
                  <c.Progress color="blue" activeText="Blue" value={8} total={15}/>
                  <c.Progress color="violet" activeText="Violet" value={9} total={15}/>
                  <c.Progress color="purple" activeText="Purple" value={10} total={15}/>
                  <c.Progress color="pink" activeText="Pink" value={11} total={15}/>
                  <c.Progress color="brown" activeText="Brown" value={12} total={15}/>
                  <c.Progress color="grey" activeText="Grey" value={13} total={15}/>
                  <c.Progress color="black" activeText="Black" value={14} total={15}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Inverted Colors" hint="<Progress appearance='inverted' color='red'/>">
                  <c.Segment appearance="inverted">
                    <c.Progress appearance='inverted' color="red" activeText="Red" value={2} total={15}/>
                    <c.Progress appearance='inverted' color="orange" activeText="Orange" value={3} total={15}/>
                    <c.Progress appearance='inverted' color="yellow" activeText="Yellow" value={4} total={15}/>
                    <c.Progress appearance='inverted' color="olive" activeText="Olive" value={5} total={15}/>
                    <c.Progress appearance='inverted' color="green" activeText="Green" value={6} total={15}/>
                    <c.Progress appearance='inverted' color="teal" activeText="Teal" value={7} total={15}/>
                    <c.Progress appearance='inverted' color="blue" activeText="Blue" value={8} total={15}/>
                    <c.Progress appearance='inverted' color="violet" activeText="Violet" value={9} total={15}/>
                    <c.Progress appearance='inverted' color="purple" activeText="Purple" value={10} total={15}/>
                    <c.Progress appearance='inverted' color="pink" activeText="Pink" value={11} total={15}/>
                    <c.Progress appearance='inverted' color="brown" activeText="Brown" value={12} total={15}/>
                    <c.Progress appearance='inverted' color="grey" activeText="Grey" value={13} total={15}/>
                    <c.Progress appearance='inverted' color="black" activeText="Black" value={14} total={15}/>
                  </c.Segment>
                </c.Example>
              </c.Column>

            </c.Grid>
          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}
