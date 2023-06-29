// in milliseconds, this value is the time the edit update will wait before
// returning control to the main list page.
// this allows the main page to wait for the update to be store in MongoDB
// before loading the list of obbjects.
export var CHILL_TIME_OUT = 1000;

export function CHILL(millis)
{
  var e = new Date().getTime() + (millis);
  while (new Date().getTime() <= e) {}
}
