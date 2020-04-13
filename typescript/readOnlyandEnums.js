var ReadonlyExample = /** @class */ (function () {
    /**
     * You can only assign value to a 'readonly' prop in constructor or inline;
     * @param name
     */
    function ReadonlyExample(name) {
        this.name = name;
        this.name = name;
    }
    return ReadonlyExample;
}());
var DayofTheWeek;
(function (DayofTheWeek) {
    DayofTheWeek[DayofTheWeek["MON"] = 0] = "MON";
    DayofTheWeek[DayofTheWeek["TUE"] = 1] = "TUE";
    DayofTheWeek[DayofTheWeek["WED"] = 2] = "WED";
    DayofTheWeek[DayofTheWeek["THU"] = 3] = "THU";
    DayofTheWeek[DayofTheWeek["FRI"] = 4] = "FRI";
    DayofTheWeek[DayofTheWeek["SAT"] = 5] = "SAT";
    DayofTheWeek[DayofTheWeek["SUN"] = 6] = "SUN";
})(DayofTheWeek || (DayofTheWeek = {}));
var day = DayofTheWeek.MON;
if (day === DayofTheWeek.MON) {
    console.log("Go to work");
}
