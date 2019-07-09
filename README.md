# ICE-Scraper
Internet Content Extractor site scraper utility

# Deployed Site: [Heroku](https://ice-scraper.herokuapp.com/)
### Overview

This project is a utility for scraping news sites. Currently the project is set up to use the science news site [quantamagazine.org](https://www.quantamagazine.org/).

### Technology Stack

This project uses several Node.js-based technologies and packages, including:

* *ExpressJS (for the server)*
* *Cheerio, for its jQuery-like API*
* *MongoDB, used to record article headlines and links, and user notes*
* *Mongoose, which is an ODM for use with MongoDB*
* *Axios*

Axios is used by the server to conduct the asynchronous GET request of the news site, and Cheerio is used to target the appropriate selectors in order to retrieve the article URLs and headlines. Mongoose makes interacting with MongoDB simpler, as well as providing thenable class methods for retrieving and storing data in the MongoDB installation.

### How to use install this project.

1. From the command line, clone the project down to the server you intend to use with the command `git clone https://github.com/golemheavy/ICE-Scraper.git`

2. From inside the project's new working directory, run `npm install` in order to install the node package dependencies required by the project.

3. Use the command `npm start` to start the server. (Note: if you don't specify a port value in your .env file, then the server will default to listening on port 3000.)

4. Navigate your browser to the URL of the listening server in order to interact with it.

### How to use the project to scrap article headlines and annotate them. (UPDATE THIS, and add some features to project)

  1. Whenever a user visits your site, the app should scrape stories from a news outlet of your choice and display them for the user. Each scraped article should be saved to your application database. At a minimum, the app should scrape and display the following information for each article:

     * Headline - the title of the article

     * Summary - a short summary of the article

     * URL - the url to the original article

     * Feel free to add more content to your database (photos, bylines, and so on).

  2. Users should also be able to leave comments on the articles displayed and revisit them later. The comments should be saved to the database as well and associated with their articles. Users should also be able to delete comments left on articles. All stored comments should be visible to every user.

* Beyond these requirements, be creative and have fun with this!

### Next Steps

There are several possible ways to improve this project. Some possible ways to extend it in the future include:

1. Currently, only the top four featured articles are scraped from the target site. It should be a simple matter to add functionality using Cheerio in order to also retrieve headlines and links from the articles in sections further down the page.

2. It could be configured to retrieve data from several news sites. A developer could manually extend the project in order to allow the user to choose from several different sites from which to scrape data.

3. It seems theoretically possible to create a feature that will allow scraping data from any news site, without previously hard-coding the specific selectors needed. This feature would be more complex to develop, but in essence it entails creating a function which can recognize the form of the data needed (headline and URL), and automatically choose those items to scrape. It makes sense, at least as an incremental behavior, for the server to request confirmation from the user that it has identified the correct selectors for data scraping prior to scraping the site using those selectors. Over time, however, it is easy to envision a feature which both records the needed structure information from a variety of sites and updates them automatically in response to structural changes at the target news sites. Machine learning could definitely be employed in order to train the algorithm to recognize the items needed to perform the scrape. Presumably, the URL value would be simpler and easier to distinguish that the headline value, but it is reasonable to believe that such a feature is possible.
