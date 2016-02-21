"use strict";
import React from "react";
import Card from "oak/Card";

import { COUNTRY_NAME_MAP } from "themes/SUI/CountryMap";

export default class SearchCard extends Card {
  static defaultProps = {
    id: "Search",
    title: "Search"
  }

  getInitialData({ card, components }) {
    return {
      countryNames: Object.keys(COUNTRY_NAME_MAP).map( key => { return { title: COUNTRY_NAME_MAP[key] } } ),

      processGithubResponse(githubResponse) {
        var
          response = {
            results : {}
          }
        ;
        // translate GitHub API response to work with search
        $.each(githubResponse.items, function(index, item) {
          var
            language   = item.language || 'Unknown',
            maxResults = 8
          ;
          if (index >= maxResults) {
            return false;
          }
          // create new language category
          if(response.results[language] === undefined) {
            response.results[language] = {
              name    : language,
              results : []
            };
          }
          // add result to category
          response.results[language].results.push({
            title       : item.name,
            description : item.description,
            url         : item.html_url
          });
        });
        return response;
      },

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
          <c.PageTitle title="Search">
            A search component allows a user to query for results from a selection of data
            <c.Todo>
              <ul>
                <li>Events tests</li>
              </ul>
            </c.Todo>
          </c.PageTitle>

          <c.PageSection title="Types">

            <c.Example title="API-Based" hint="<Search apiSettings={{...}} fields={{...}}/>">
              <c.Search apiSettings={{ url: "//api.github.com/search/repositories?q={query}"}}
                        fields={{ results: "items", title: "name", url: "html_url" }}
                        minCharacters={3}
                        placeholder="Search GitHub Repos"
                />
            </c.Example>

            <c.Example title="Local Source" hint="<Search category/>">
              <c.Search source={data.countryNames}
                        placeholder="Choose a Country"
                />
            </c.Example>

            <c.Example title="Category Results" hint="<Search source={[...]}/>">
              <c.Search category
                        apiSettings={{
                          url: "//api.github.com/search/repositories?q={query}",
                          onResponse: data.processGithubResponse
                        }}
                        placeholder="Search Github"
                        icon="github" iconOn="left"
                />
            </c.Example>

          </c.PageSection>


          <c.PageSection title="States">

            <c.Example title="Loading" hint="<Search loading/>">
              <c.Search loading
                        placeholder="Search..."
                />
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Appearance">

            <c.Example title="Fluid results" hint="<Search appearance='fluid'/>">
              <c.Search appearance="fluid"
                        source={data.countryNames}
                        placeholder="Search..."
                />
            </c.Example>

            <c.Example title="Right aligned results" hint="<Search appearance='right aligned'/>">
              <c.Search appearance="right aligned"
                        source={data.countryNames}
                        placeholder="Search..."
                />
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}
