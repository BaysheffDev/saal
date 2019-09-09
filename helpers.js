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

const convertMonthToNumber = (month) => {
  const dateComponents = month.split(' ');
  const monthNumber = months[dateComponents[0]];
  const date = dateComponents[2] + "-" + monthNumber + "-" + dateComponents[1];
  return date;
}
