import { RRule, RRuleSet, rrulestr } from "rrule";

const RRules = (rrdate, rrcount) => {
    return new RRule({
        freq: RRule.WEEKLY,
        interval: 1,
        dtstart: new Date(
          Date.UTC(
            rrdate.getFullYear(),
            rrdate.getMonth(),
            rrdate.getDate(),
            rrdate.getHours(),
            rrdate.getMinutes()
          )
        ),
        count: rrcount,
      }).all();
}

export {RRules}