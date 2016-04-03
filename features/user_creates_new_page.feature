Feature:  User creates new page
  Staring point for all new pages in a project

  As a user
  I want to create a new page
  in order to populate the page later with components

  Scenario: Project has 0 or more pages
    Given that the projedt has 0 or more pages
    When user clicks New Page button in tool palette
    Then a New Page will be created
