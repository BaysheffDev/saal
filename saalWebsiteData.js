const rp = require('request-promise');
const cheerio = require('cheerio');

// Base url to get meetings and race results
const baseUrl = 'https://www.saal.org.au/index.php/?id=30';

//
// Get names & dates and links of all race meetings available on site
// Returns an array of objects where each object is the name and link for 1 meet
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
            meetInfo["date"] = title[1];
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
        return results;
    })
    .catch(err => console.log("Error: getRaceResults - ", err));
}

module.exports = {
    getMeetings: getMeetings,
    getMeetingRaces: getMeetingRaces,
    getRaceResults: getRaceResults
}
