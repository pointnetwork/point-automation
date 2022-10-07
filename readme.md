# Point Test Automation project

This is the test automation project for Point test cases. This project includes the infrastructure needed to run
all the test cases properly.

## Technologies
The automated tests are build in Javascript and NodeJs. The framework is "WebdriverIO" and it uses also "Selenium"
to interact with the web browser.
There are some other dependencies as "wdio-html-reporter" for the HTML reports.
As the project to test was build in Electron, the following dependencies are also used : electron-chromedriver, wdio-electron-service and geckodriver.

# Requirements

Before running the automated tests, the user needs to have installed :

- NodeJS (It's recommended to install NVM to install NPM. Recommended version: 16.7.0)
- Point app installed
- Secret Words to login with your user

# Installation

Check this video with a demo of how to install and run the test cases : [Here](installation.mp4)

1. Download this project
2. Run command "npm install" in the root of this project
3. Run any of the following commands according to the test cases that you want to execute : 
   * "SECRET_WORDS=word1 word2 word3 npm run test-macos" => Run all the tests (MacOS)
   * "SECRET_WORDS=word1 word2 word3 npm run test-linux" => Run all the tests (MacOS)
   * "SECRET_WORDS=word1 word2 word3 npm run simple-test-linux" => Just one test (MacOS)
   * "SECRET_WORDS=word1 word2 word3 npm run simple-test-macos" => Just one test (MacOS)

*SECRET_WORDS environment variable should contain the secret words to login with a specific user.


# Reports

An HTML file with the test execution report is generated automatically and it's saved after every execution in tests/reports/html-reports/suite-0-0/0-0/report.html

# Electron

As Point is an electron app that also opens a Firefox browser when the nodes are up, we have to open 2 browsers to interact with them : 

- 1 Google Chrome instance with a special configuration to open Point
- 1 Firefox instance with a special configuration to load the same profile than Point app

The tests were developed to support both instances at the same time just specifying with which instance we want to interact.

# Known Issues : 

- Point App should be installed as a pre-condition before running the tests, if it's not installed the tests will fail
- Tests are not supported to run in Windows yet
- For some tests a lot of complex and high-level processes are executed, so it can take some time to finish all the test executions.
- Sometimes the tests fails if we have Point opened before running the test. Take care of this and close Point before running the tests.
- There are issues running the Linux tests in a pipeline (WIP)
