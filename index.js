const english = new Intl.RelativeTimeFormat("en-us");
const spanish = new Intl.RelativeTimeFormat("es-es");

english.format(-2, "days");
// 2 days ago
spanish.format(10, "hours");
