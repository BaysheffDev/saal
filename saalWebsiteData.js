// Functions to scrape data from saal website

const rp = require('request-promise');
const cheerio = require('cheerio');

// Base url to get meetings and race results
const baseUrl = 'https://www.saal.org.au/index.php/?id=30';

// Object to convert month words into numbers
var months = {
    'Jan' : '01',
    'Feb' : '02',
    'Mar' : '03',
    'Apr' : '04',
    'May' : '05',
    'Jun' : '06',
    'Jul' : '07',
    'Aug' : '08',
    'Sep' : '09',
    'Oct' : '10',
    'Nov' : '11',
    'Dec' : '12'
}

// Convert saal website dates into SQL format
const sqlDateFormat = (date) => {
  const dateComponents = date.trim().split(' ');
  const monthNumber = months[dateComponents[0]];
  const dayComponents = dateComponents[1].split(/(\d+)/);
  const sqlDate = dateComponents[2] + "-" + monthNumber + "-" + dayComponents[1];
  return sqlDate;
}

//
// Get names & dates and links of all race meetings available on site
// Returns an array of objects where each object containes the Name, Date and Link for 1 meet
const getMeetings = () => {
    const options = {
        url: `${baseUrl}`,
        transform: body => cheerio.load(body)
    }
    return rp(options)
    .then(function ($) {
        const raceMeets = [];
        $('#mainContent a').each(function (i, el) {
            const meetInfo = {};
            const title = $(el).text().split('-');
            const link = $(el).attr('href');
            meetInfo["name"] = title[0];
            meetInfo["date"] = sqlDateFormat(title[title.length-1]);
            meetInfo["link"] = link.split('&')[1];
            raceMeets.push(meetInfo);
        });
        return raceMeets;
    })
    .catch(err => console.log("Error: getMeetings - ", err));
}

//
// Returns an array of objects where each object is the name and link for 1 race
const getMeetingRaces = (meeting) => {
    const options = {
        url: `${baseUrl}&${meeting}`,
        transform: body => cheerio.load(body)
    }
    return rp(options)
    .then(function ($) {
        const races = [];
        $('#mainContent p a').each(function (i, el) {
            const raceInfo = {};
            const name = $(el).text();
            const link = $(el).attr('href');
            raceInfo["name"] = name;
            let urlParams = link.split('&');
            raceInfo["link"] = urlParams[1] + "&" + urlParams[2];
            races.push(raceInfo);
        });
        return races;
    })
    .catch(err => console.log("Error: getMeetingRaces - ", err));
}

//
// Get meeting race results
// Returns an array of objects where each object is 1 race
const getRaceResults = (raceAndMeeting) => {
    // Headings for csv file
    const headings = ['position', 'name', 'color', 'mark', 'time'];
    const options = {
      url: `${baseUrl}&${raceAndMeeting}`,
      transform: body => cheerio.load(body)
    }
    return rp(options)
    .then(function ($) {
        const results = [];
        $('tr').each(function() {
            let result = {};
            $(this).find('td').each(function(i, el) {
                const data = $(el).text().trim();
                result[headings[i]] = data;
            });
            results.push(result);
        });
        // Format marks by removing "m"
        for (let i = 0, len = results.length; i < len; i++) {
          results[i].mark = results[i].mark.split('m')[0];
        }
        return results;
    })
    .catch(err => console.log("Error: getRaceResults - ", err));
}

module.exports = {
    getMeetings: getMeetings,
    getMeetingRaces: getMeetingRaces,
    getRaceResults: getRaceResults
}
