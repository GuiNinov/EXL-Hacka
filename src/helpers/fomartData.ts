export const diffBetweenDatesInMs = (
  date1: Date | number | string,
  date2: Date | number | string
) => {
  const date1_ = new Date(date1);
  const date2_ = new Date(date2);

  return (date1_.getTime() - date2_.getTime()).toPrecision(4);
};
