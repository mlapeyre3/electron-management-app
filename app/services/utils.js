export default {

  addDays: function(currentDate, days){
    currentDate.setDate(currentDate.getDate() + days);
  },

  getDates: function(startDate,endDate,days) {
    if(!startDate) {
      return []
    } else if (!endDate && !days) {
      return [startDate]
    } else if (days) {
      var endDate = new Date(startDate);
      this.addDays(endDate,days);
    }

    if (startDate > endDate) {
      [startDate, endDate] = [endDate, startDate];
    }

    var dateArray = [];
    var currentDate = startDate;

    while(currentDate <= endDate){
      dateArray.push(new Date(currentDate));
      this.addDays(currentDate,1);
    }

    return dateArray;
  }

}