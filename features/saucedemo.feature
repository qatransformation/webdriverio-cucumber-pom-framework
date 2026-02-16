# language: en
Feature: SauceDemo Login Functionality
  As a SauceDemo user
  I want to be able to login to the application
  So I can access the product inventory

  Background:
    Given the user navigates to the SauceDemo login page

  @saucedemo @login @smoke
  Scenario Outline: Login with different user credentials
    When the user enters username "<username>"
    And the user enters password "<password>"
    And the user clicks the login button
    Then the user should see the "<expectedResult>"

    Examples:
      | username                | password     | expectedResult          |
      | standard_user           | secret_sauce | Products                |
      | problem_user            | secret_sauce | Products                |
      | performance_glitch_user | secret_sauce | Products                |
      | error_user              | secret_sauce | Products                |
      | visual_user             | secret_sauce | Products                |

  @saucedemo @login @negative
  Scenario Outline: Login with invalid credentials
    When the user enters username "<username>"
    And the user enters password "<password>"
    And the user clicks the login button
    Then the user should see the error message "<errorMessage>"

    Examples:
      | username      | password     | errorMessage                                                              |
      | invalid_user  | secret_sauce | Epic sadface: Username and password do not match any user in this service |
      | standard_user | wrong_pass   | Epic sadface: Username and password do not match any user in this service |
      |               | secret_sauce | Epic sadface: Username is required                                        |
      | standard_user |              | Epic sadface: Password is required                                        |

  @saucedemo @login @locked
  Scenario: Login with locked out user
    When the user enters username "locked_out_user"
    And the user enters password "secret_sauce"
    And the user clicks the login button
    Then the user should see the error message "Epic sadface: Sorry, this user has been locked out."

  @saucedemo @logout
  Scenario: Successful logout after login
    When the user enters username "standard_user"
    And the user enters password "secret_sauce"
    And the user clicks the login button
    Then the user should see the "Products"
    When the user clicks the menu button
    And the user clicks the logout option
    Then the user should be redirected to the login page
