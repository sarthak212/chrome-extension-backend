export function validateSlotUpdate(dates: any) {
  if (!Array.isArray(dates)) {
    return {
      status: false,
      message: "Dates should be an array with at least one value!",
    };
  }
  for (let i = 0; i < dates.length; i++) {
    if (!dates[i].year || !dates[i].month || !dates[i].date) {
      return {
        status: false,
        message: "Date, month and year are required in each date object",
      };
    }
  }
  return {
    status: true,
  };
}
