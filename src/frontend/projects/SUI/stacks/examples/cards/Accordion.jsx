"use strict";
import React from "react";
import { Card } from "oak";


const WHAT_IS_A_DOG = `A dog is a type of domesticated animal. Known for its loyalty and faithfulness,
 it can be found as a welcome guest in many households across the world.`;

const KINDS_OF_DOGS = `There are many breeds of dogs. Each breed varies in size and temperament.
 Owners often select a breed of dog that they find to be compatible with their own
 lifestyle and desires from a companion.`;

const ACQUIRING_A_DOG = `Three common ways for a prospective owner to acquire a dog
 is from pet shops, private owners, or shelters.

A pet shop may be the most convenient way to buy a dog.
 Buying a dog from a private owner allows you to assess the pedigree
 and upbringing of your dog before choosing to take it home. Lastly,
 finding your dog from a shelter, helps give a good home to a dog who
 may not find one so readily.`;


export default class AccordionCard extends Card {
  static defaultProps = {
    id: "Accordion",
    title: "Accordion"
  }

  getInitialData() {
    return {
      dogStringMap: {
        "What is a dog?": WHAT_IS_A_DOG,
        "What kinds of dogs are there?": KINDS_OF_DOGS,
        "How do you acquire a dog?": ACQUIRING_A_DOG
      },

      whatIsADogTitle: <div className="title" appearance="active"><i className="dropdown icon"/>What is a dog?</div>,
      whatIsADogContent: <div className="content">{WHAT_IS_A_DOG}</div>,

      kindsOfDogsTitle: <div className="title" appearance="active"><i className="dropdown icon"/>What kinds of dogs are there?</div>,
      kindsOfDogsContent: <div className="content">{WHAT_IS_A_DOG}</div>,

      acquiringADogTitle: <div className="title" appearance="active"><i className="dropdown icon"/>How do you acquire a dog?</div>,
      acquiringADogContent: <div className="content">{ACQUIRING_A_DOG}</div>,

      dogStringArray: [
        "What is a dog",
        WHAT_IS_A_DOG,
        "What kinds of dogs are there?",
        KINDS_OF_DOGS,
        "How do you acquire a dog?",
        ACQUIRING_A_DOG
      ],


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
          <c.PageTitle title="Accordion">
            An accordion allows users to toggle the display of sections of content
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Inline Content">
                  <c.Accordion>
                    <c.Title appearance="active"><c.Icon icon="dropdown"/>What is a dog?</c.Title>
                    <c.Content appearance="active">
                      A dog is a type of domesticated animal. Known for its loyalty and faithfulness,
                      it can be found as a welcome guest in many households across the world.
                    </c.Content>

                    <c.Title><c.Icon icon="dropdown"/>What kinds of dogs are there?</c.Title>
                    <c.Content>
                      There are many breeds of dogs. Each breed varies in size and temperament.
                      Owners often select a breed of dog that they find to be compatible with their own
                      lifestyle and desires from a companion.
                    </c.Content>

                    <c.Title><c.Icon icon="dropdown"/>How do you acquire a dog?</c.Title>
                    <c.Content>
                      <p>
                        Three common ways for a prospective owner to acquire a dog
                        is from pet shops, private owners, or shelters.
                      </p>
                      <p>
                        A pet shop may be the most convenient way to buy a dog.
                        Buying a dog from a private owner allows you to assess the pedigree
                        and upbringing of your dog before choosing to take it home. Lastly,
                        finding your dog from a shelter, helps give a good home to a dog who
                        may not find one so readily.
                      </p>
                    </c.Content>

                  </c.Accordion>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Content from a Map">
                  <c.Accordion items={data.dogStringMap}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Content from Array of Elements">
                  <c.Accordion items={[
                    data.whatIsADogTitle,
                    data.whatIsADogContent,
                    data.kindsOfDogsTitle,
                    data.kindsOfDogsContent,
                    data.acquiringADogTitle,
                    data.acquiringADogContent,
                  ]}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Content from Array of Strings">
                  <c.Accordion items={data.dogStringArray}/>
                </c.Example>
              </c.Column>
            </c.Grid>

              <c.Example title="Nested">
                <c.Accordion id="nested" appearance="styled">
                  <c.Title><c.Icon icon="dropdown"/>Level 1</c.Title>
                  <c.Content>Welcome to level 1
                    <c.Accordion>
                      <c.Title><c.Icon icon="dropdown"/>Level 1A</c.Title>
                      <c.Content>Level 1A contents</c.Content>
                      <c.Title><c.Icon icon="dropdown"/>Level 1B</c.Title>
                      <c.Content>Level 1B contents</c.Content>
                    </c.Accordion>
                  </c.Content>
                  <c.Title><c.Icon icon="dropdown"/>Level 2</c.Title>
                  <c.Content>
                    Welcome to level 2
                    <c.Title><c.Icon icon="dropdown"/>Level 2A</c.Title>
                    <c.Content>Level 2A contents</c.Content>
                    <c.Title><c.Icon icon="dropdown"/>Level 2B</c.Title>
                    <c.Content>Level 2B contents</c.Content>
                  </c.Content>
                </c.Accordion>
              </c.Example>
              <c.Bug>This is not working properly...  Do we have to further initialize the nested accordion?</c.Bug>
          </c.PageSection>

          <c.PageSection title="Settings">
            <c.Example title="Non-collapsible" hint="<Accordion collapsible={false}/>">
              <c.Accordion collapsible={false} appearance="styled" items={data.dogStringArray}/>
            </c.Example>

            <c.Example title="Non-exclusive" hint="<Accordion exlusive={false}/>">
              <c.Accordion exclusive={false} appearance="styled" items={data.dogStringArray}/>
            </c.Example>

            <c.Example title="Opening items at the start" hint="<Accordion open={0}/> or <Accordion exclusive={false} open={[0,1]}/>">
              <c.Label pointing="down" color="teal">open = 0</c.Label>
              <c.Accordion open={0} appearance="styled" items={data.dogStringArray}/>

              <c.Spacer/>
              <c.Label pointing="down" color="teal">open = [0, 1]</c.Label>
              <c.Accordion exclusive={false} open={[0,1]} appearance="styled" items={data.dogStringArray}/>
            </c.Example>

            <c.Example title="Show on hover" hint="<Accordion on='mouseenter'/>">
              <c.Accordion on="mouseenter" appearance="styled" items={data.dogStringArray}/>
            </c.Example>

            <c.Example title="Non-animated children" hint="<Accordion animateChildren={false}/>">
              <c.Accordion animateChildren={false} appearance="styled" items={data.dogStringArray}/>
              <c.Bug>This doesn't seem to work.  Are we doing it right?</c.Bug>
            </c.Example>



          </c.PageSection>

          <c.PageSection title="Appearance">
            <c.Example title="Styled" hint="<Accordion appearance='styled'/>">
              <c.Accordion appearance="styled" items={data.dogStringArray}/>
            </c.Example>

            <c.Example title="Fluid" hint="<Accordion appearance='fluid'/>">
              <c.Segment>
                <c.Accordion appearance="styled fluid" items={data.dogStringArray}/>
              </c.Segment>
            </c.Example>

            <c.Example title="Inverted" hint="<Accordion appearance='inverted'/>">
              <c.Segment appearance="inverted">
                <c.Accordion appearance="inverted" items={data.dogStringArray}/>
              </c.Segment>

              <c.Spacer/>
              <c.Label pointing="down" color="teal">Inverted styled</c.Label>
              <c.Segment appearance="inverted compact unpadded">
                <c.Accordion appearance="inverted styled" items={data.dogStringArray}/>
              </c.Segment>
            </c.Example>
          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}
