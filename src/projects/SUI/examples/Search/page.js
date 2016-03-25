//import { COUNTRY_NAME_MAP } from "themes/SUI/CountryMap";
getInitialData(context) {
  const components = context.components;
  const COUNTRY_NAME_MAP = components.CountryMap.COUNTRY_NAME_MAP;

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
