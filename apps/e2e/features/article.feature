Feature: Article
  In order to listen to an article
  As a customer
  I want to transcode a URL to speach

  Scenario Outline: Create an article
    Given I am an authenticed customer
    When I create an article from URL "<url>" with voice "<voice>" at speed <speed>
    And I retrieve all articles
    Then the first article in the list should be from URL "<url>" with voice "<voice>" at speed <speed>

    Examples:
      | url                                      | voice | speed |
      | https://en.wikipedia.org/wiki/Nagaev_Bay | Amy   | 100   |