import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, CalendarProps, stringOrDate } from "react-big-calendar";
import moment from "moment";
import { Link } from "react-router-dom";
import fire from "../../API/Fire";
// import 'react-big-calendar/lib/css/react-big-calendar.css';
import "react-big-calendar/lib/sass/styles.scss";

interface Events {
  key: number;
  id: string;
  title: string;
  desc: string;
  start: Date;
  end: Date;
  isdone: boolean;
  repeat_start?: number;
  repeat_end?: number;
  isrepeat: boolean;
}

interface SlotInfo {
  start: stringOrDate;
  end: stringOrDate;
  slots: Date[] | string[];
  action: 'select' | 'click' | 'doubleClick';
}

const Routine = () => {
  const [events, setEvents] = useState([]);
  // const [ColoredDateCellWrapper, setCDCW] = useState(null);
  const [routineNow, setRoutineNow] = useState(false);
  const [activeRoutine, setActiveRoutine] = useState<Events>();
  const [selectedEvent, setSelectedEvent] = useState<Events>();
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
          if (event.val().isdone) {
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

  const handleEventSelect = (event: Events) => {
    setSelectedEvent(event);
    setEventInfo(true);
  };

  const handleDeleteEvent = (isRepeat: boolean) => {
    if (selectedEvent) {
      if (!isRepeat) {
        // Delete event from events state
        let updatedEvents = events.filter(
          (event: Events) => event.key !== selectedEvent.key
        );
        console.log(updatedEvents);
        setEvents(updatedEvents);
        fire.updateUserEvents(updatedEvents);
        setSelectedEvent(undefined);
        setEventInfo(false);

        // if Deleting just one event from a repeat event,
        // need to decrease the repeat_end for remainder
      } else {
        console.log("Deleting Repeat Events");
        // Delete events from events state
        let repeatArr = Array.from(
          {
            length: selectedEvent.repeat_end! - selectedEvent.repeat_start! + 1,
          },
          (x, i) => i + selectedEvent.repeat_start!
        );
        let updatedEvents = events.filter(
          (event: Events) => repeatArr.indexOf(event.key) == -1
        );
        setEvents(updatedEvents);
        // Delete events from firebase database
        fire.updateUserEvents(updatedEvents);
        setSelectedEvent(undefined);
        setEventInfo(false);
      }
    }
  };

  const handleEventExit = () => {
    setSelectedEvent(undefined);
    setEventInfo(false);
  };

  // When you choose a particular slot on the calendar
  const onSlotChange = (slotInfo: SlotInfo) => {
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
      {eventInfo && selectedEvent && (
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
      {routineNow && activeRoutine && (
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
function Event({event}: {event: Events}) {
  return (
    <span>
      <strong>{event.title}</strong>
      {event.desc && ":  " + event.desc}
    </span>
  );
}

function EventAgenda({event}: {event: Events}) {
  return (
    <span>
      <em style={{ color: "magenta" }}>{event.title}</em>
      <p>{event.desc}</p>
    </span>
  );
}
