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



### How to use install this project.

1. From the command line, clone the project down to the server you intend to use with the command `git clone https://github.com/golemheavy/ICE-Scraper.git`

2. From inside the project's new working directory, run `npm install` in order to install the node package dependencies required by the project.

3. Use the command `npm start` to start the server. (Note: if you don't specify a port value in your .env file, then the server will default to listening on port 3000.)

4. Navigate your browser to the URL of the listening server in order to interact with it.

### How to use the project to scrap article headlines and annotate them.

  1. Whenever a user visits your site, the app should scrape stories from a news outlet of your choice and display them for the user. Each scraped article should be saved to your application database. At a minimum, the app should scrape and display the following information for each article:

     * Headline - the title of the article

     * Summary - a short summary of the article

     * URL - the url to the original article

     * Feel free to add more content to your database (photos, bylines, and so on).

  2. Users should also be able to leave comments on the articles displayed and revisit them later. The comments should be saved to the database as well and associated with their articles. Users should also be able to delete comments left on articles. All stored comments should be visible to every user.

* Beyond these requirements, be creative and have fun with this!
