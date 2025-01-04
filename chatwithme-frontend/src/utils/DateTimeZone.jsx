export const convertDateTimeZone = (utcDate) => {
  const date = new Date(utcDate);

  const gmt7Offset = 7 * 60;
  return new Date(date.getTime() + gmt7Offset * 60 * 1000);
};
