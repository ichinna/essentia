class ReadonlyExample {
    /**
     * You can only assign value to a 'readonly' prop in constructor or inline;
     * @param name 
     */
    constructor(readonly name: string) {
        this.name = name;
    }
}


enum DayofTheWeek {
    MON, TUE, WED, THU, FRI, SAT, SUN
}


let day = DayofTheWeek.MON;

if (day === DayofTheWeek.MON) {
    console.log("Go to work");
}
