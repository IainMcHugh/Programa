import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { RRule, RRuleSet, rrulestr } from "rrule";
import { Link } from "react-router-dom";
import fire from "../../API/Fire";
// import 'react-big-calendar/lib/css/react-big-calendar.css';
import "react-big-calendar/lib/sass/styles.scss";

//     addEvent = (e) => {
//         e.preventDefault();
//         console.log(e.target.elements.repeat.value); //norepeat or yesrepeat
//         let repeatValue = e.target.elements.repeat.value;
//         let startDateHolder = new Date(e.target.elements.beginentry.value);
//         let startDateHolderYear = startDateHolder.getFullYear();
//         let startDateHolderMonth = startDateHolder.getMonth();
//         let startDateHolderDate = startDateHolder.getDate();
//         let startDateHolderHour = startDateHolder.getHours();
//         let startDateHolderMinutes = startDateHolder.getMinutes();
//         let endDateHolder = new Date(e.target.elements.endentry.value);
//         let endDateHolderYear = endDateHolder.getFullYear();
//         let endDateHolderMonth = endDateHolder.getMonth();
//         let endDateHolderDate = endDateHolder.getDate();
//         let endDateHolderHour = endDateHolder.getHours();
//         let endDateHolderMinutes = endDateHolder.getMinutes();

//         let database = fire.database();
//         let uid = fire.auth().currentUser.uid;
//         var PostKey = this.state.program_id;
//         var PostName = this.state.program_name;
//         let updates = {};
//         let prevChildCount = 0
//         let prevMyEvents = this.state.myEvents;
//         // have to get count from routine child
//         database.ref('users/' + uid + '/routine').once('value').then((snap) => {
//             prevChildCount = snap.numChildren();
//             console.log(prevChildCount);

//             if (repeatValue === 'yesrepeat'){

//                 const ruleStart = new RRule({
//                     freq: RRule.WEEKLY,
//                     interval: 1,
//                     dtstart: new Date(Date.UTC(startDateHolderYear, startDateHolderMonth, startDateHolderDate, startDateHolderHour, startDateHolderMinutes)),
//                     count: 10
//                 });

//                 const ruleEnd = new RRule({
//                     freq: RRule.WEEKLY,
//                     interval: 1,
//                     dtstart: new Date(Date.UTC(endDateHolderYear, endDateHolderMonth, endDateHolderDate, endDateHolderHour, endDateHolderMinutes)),
//                     count: 10
//                 });

//                 let startRepeat = ruleStart.all();
//                 let startEnd = ruleEnd.all();

//                 for (let i=0; i < startRepeat.length; i++){
//                     let newEventHolder = {
//                         'id': '12345',
//                         'title': 'Back Workout',
//                         'start': startRepeat[i],
//                         'end': startEnd[i],
//                         'desc': 'this is a back workout',
//                         'isrepeat': true,
//                         'repeat_start': prevChildCount,
//                         'repeat_end': ((startRepeat.length -1) + prevChildCount)
//                     }
//                     updates['users/' + uid + '/routine/' + (i + prevChildCount) + '/'] = newEventHolder;
//                     database.ref().update(updates);
//                     prevMyEvents.push(newEventHolder);
//                 }

//                 alert("Event Created!");

//                 this.setState({
//                     createEvent: false,
//                     myEvents: prevMyEvents,
//                 })
//             }
//             else
//             {
//                 const ruleStart = new RRule({
//                     freq: RRule.WEEKLY,
//                     interval: 1,
//                     dtstart: new Date(Date.UTC(startDateHolderYear, startDateHolderMonth, startDateHolderDate, startDateHolderHour, startDateHolderMinutes)),
//                     count: 1
//                 });

//                 const ruleEnd = new RRule({
//                     freq: RRule.WEEKLY,
//                     interval: 1,
//                     dtstart: new Date(Date.UTC(endDateHolderYear, endDateHolderMonth, endDateHolderDate, endDateHolderHour, endDateHolderMinutes)),
//                     count: 1
//                 });

//                 let startRepeat = ruleStart.all();
//                 let startEnd = ruleEnd.all();

//                 let newEventHolder = {
//                     'id': '12345',
//                     'title': 'Back Workout',
//                     'start': startRepeat[0],
//                     'end': startEnd[0],
//                     'desc': 'This is a Back Workout',
//                     'isrepeat': false
//                 }
//                 console.log(prevChildCount);
//                 updates['users/' + uid + '/routine/' + prevChildCount + '/'] = newEventHolder;
//                 database.ref().update(updates);

//                 prevMyEvents.push(newEventHolder);
//                 alert("Event Created!");

//                 this.setState({
//                     createEvent: false,
//                     myEvents: prevMyEvents,
//                 })
//             }
//         })
//     }

const Routine = () => {
  const [events, setEvents] = useState([]);
  const [ColoredDateCellWrapper, setCDCW] = useState(null);
  const [routineNow, setRoutineNow] = useState(false);
  const [activeRoutine, setActiveRoutine] = useState({});
  const [selectedEvent, setSelectedEvent] = useState({});
  const [eventInfo, setEventInfo] = useState(false);
  const [createEvent, setCreateEvent] = useState(false);
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");

  const localizer = momentLocalizer(moment);

  useEffect(() => {
    fire.getUserRoutines().then((data) => {
      setEvents(data.val());
      data.forEach((event) => {
        if (moment(new Date()).isBetween(event.val().start, event.val().end)) {
          console.log("There is an event now");
          if (event.isdone) {
            setRoutineNow(false);
            setActiveRoutine(event.val());
          } else {
            setRoutineNow(true);
            setActiveRoutine(event.val());
          }
        }
      });
    });
  }, []);

  const handleEventSelect = (event) => {
    console.log(event);
    setSelectedEvent(event);
    setEventInfo(true);
  };

  const handleDeleteEvent = (isRepeat) => {
    if (!isRepeat) {
      // Delete event from events state
      let updatedEvents = events.filter(
        (event) => event.key !== selectedEvent.key
      );
      console.log(updatedEvents);
      setEvents(updatedEvents);
      fire.updateUserEvents(updatedEvents);
      setSelectedEvent({});
      setEventInfo(false);

      // if Deleting just one event from a repeat event,
      // need to decrease the repeat_end for remainder
    } else {
      console.log("Deleting Repeat Events");
      // Delete events from events state
      let repeatArr = Array.from(
        {
          length: selectedEvent.repeat_end - selectedEvent.repeat_start + 1,
        },
        (x, i) => i + selectedEvent.repeat_start
      );
      let updatedEvents = events.filter(
        (event) => repeatArr.indexOf(event.key) == -1
      );
      setEvents(updatedEvents);
      // Delete events from firebase database
      fire.updateUserEvents(updatedEvents);
      setSelectedEvent({});
      setEventInfo(false);
    }
  };

  const handleEventExit = (e) => {
    setSelectedEvent({});
    setEventInfo(false);
  };

  // When you choose a particular slot on the calendar
  const onSlotChange = (slotInfo) => {
    console.log(
      moment(slotInfo.end.toLocaleString()).format("YYYY-MM-DDTHH:mm:ss")
    );
    setSlotStart(
      moment(slotInfo.start.toLocaleString()).format("YYYY-MM-DDTHH:mm:ss")
    );
    setSlotEnd(
      moment(slotInfo.end.toLocaleString()).format("YYYY-MM-DDTHH:mm:ss")
    );
    setCreateEvent(true);
    // Choose from drop-down of saved programs
  };

  return (
    <div className="routine-background">
      {console.log(events)}
      <div className="routine-container">
        <div className="routine-daily-schedule">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={["month", "day", "agenda"]}
            selectable
            onSelectEvent={(event) => handleEventSelect(event)}
            onSelectSlot={(slotInfo) => onSlotChange(slotInfo)}
            popup={true}
            components={{
              //   timeSlotWrapper: ColoredDateCellWrapper,
              event: Event,
              agenda: {
                event: EventAgenda,
              },
            }}
            style={{ height: 500 }}
          />
        </div>
      </div>
      {eventInfo && (
        <div className="createEvent-container">
          <h2>{selectedEvent.title}</h2>
          <button onClick={() => handleDeleteEvent(false)}>
            Delete this Event
          </button>
          {selectedEvent.isrepeat && (
            <button onClick={() => handleDeleteEvent(true)}>
              Delete all occurences of Event
            </button>
          )}
          <button onClick={() => handleEventExit()}>Close</button>
        </div>
      )}
      {/* {createEvent ? (
        <div className="createEvent-container">
          <form onSubmit={this.addEvent}>
            <h2 className="createEvent-heading">NO PROGRAM NAME</h2>
            <label>Start Date</label>
            <input
              type="datetime-local"
              defaultValue={slotStartDate}
              required
              name="beginentry"
              id="start-date"
            />
            <label>End Date</label>
            <input
              type="datetime-local"
              defaultValue={slotEndDate}
              required
              name="endentry"
              id="create-event-end-date"
            />

            <p>Repeat Event</p>
            <input
              type="radio"
              id="yesrepeat"
              name="repeat"
              value="yesrepeat"
            />
            <label for="yesrepeat">Repeat</label>
            <input
              type="radio"
              id="norepeat"
              name="repeat"
              value="norepeat"
              defaultChecked
            />
            <label for="norepeat">Dont Repeat</label>
            <button type="submit">Add to Calendar</button>
          </form>
          <button onClick={() => this.setState({ createEvent: false })}>
            Cancel
          </button>
        </div>
      ) : (
        <div></div>
      )} */}
      {routineNow && (
        <div>
          {console.log(activeRoutine)}
          <Link
            to={"programs/" + activeRoutine.id + "/" + activeRoutine.key}
            key={activeRoutine.id}
          >
            <button>Start {activeRoutine.title} Workout Now!</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Routine;

/*Agenda Rendering*/
//Outside the class
function Event({ event }) {
  return (
    <span>
      <strong>{event.title}</strong>
      {event.desc && ":  " + event.desc}
    </span>
  );
}

function EventAgenda({ event }) {
  return (
    <span>
      <em style={{ color: "magenta" }}>{event.title}</em>
      <p>{event.desc}</p>
    </span>
  );
}
