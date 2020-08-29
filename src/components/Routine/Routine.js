import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { RRule, RRuleSet, rrulestr } from "rrule";
import { Link } from "react-router-dom";
import fire from "../../API/Fire";
// import 'react-big-calendar/lib/css/react-big-calendar.css';
import "react-big-calendar/lib/sass/styles.scss";

// export class Routine extends React.Component {

//     constructor(props) {
//         super(props)

//         this.state = {
//              date: new Date(),
//              ColoredDateCellWrapper: null,
//              myEvents: [],
//              eventsRecieved: false,
//              selectedEvent: {},
//              isRepeatEvent: false,
//              isDone: false,
//              repeat_start: null,
//              repeat_end: null,
//              showEventDetail: false,
//              createEvent: false,
//              slotStartDate: new Date(),
//              slotEndDate: new Date(),
//              isRoutineNow: false,
//              scheduledEvent: null,
//         }
//     }

//     componentDidMount(){
//         this.setState({
//                 ColoredDateCellWrapper: ({ children }) =>
//             React.cloneElement(React.Children.only(children), {
//                 style: {
//                 backgroundColor: '#282c34',
//                 },
//             })
//         })

//         fire.auth().onAuthStateChanged( user => {
//             if (user) {
//                 let uid = user.uid;
//                 let database = fire.database();
//                 let eventHolder = [];
//                 database.ref('/users/' + uid + '/routine').once('value').then((snap) => {
//                     console.log(snap.val());
//                     snap.forEach((childSnap) => {
//                         let eventObjectHolder =
//                         {
//                             'key': '',
//                             'id': '',
//                             'title': '',
//                             'start': new Date(),
//                             'end': new Date(),
//                             'desc': '',
//                             'isrepeat': false,
//                             'isdone': false,
//                             'repeat_start': 0,
//                             'repeat_end': 0
//                         }
//                         eventObjectHolder['key'] = childSnap.key;
//                         eventObjectHolder['id'] = childSnap.val().id;
//                         eventObjectHolder['title'] = childSnap.val().title;
//                         eventObjectHolder['start'] = new Date(childSnap.val().start);
//                         eventObjectHolder['end'] = new Date(childSnap.val().end);
//                         eventObjectHolder['desc'] = childSnap.val().desc;
//                         eventObjectHolder['isrepeat'] = childSnap.val().isrepeat;
//                         eventObjectHolder['isdone'] = childSnap.val().isdone;
//                         eventObjectHolder['repeat_start'] = childSnap.val().repeat_start;
//                         eventObjectHolder['repeat_end'] = childSnap.val().repeat_end;

//                         console.log("1: "+eventObjectHolder['start']);
//                         console.log("2: "+eventObjectHolder['start']);
//                         console.log("3: "+new Date());

//                         if(moment(new Date()).isBetween(eventObjectHolder['start'], eventObjectHolder['end'])) {
//                             console.log("There is an Event Now!");
//                             if(eventObjectHolder['isdone']){
//                                 this.setState({
//                                     isRoutineNow: false,
//                                     scheduledEvent: eventObjectHolder
//                                 });
//                             }else{
//                                 this.setState({
//                                     isRoutineNow: true,
//                                     scheduledEvent: eventObjectHolder
//                                 })
//                             }

//                         }
//                         eventHolder.push(eventObjectHolder);
//                     });

//                     // console.log(eventHolder);

//                     this.setState({
//                         myEvents: eventHolder,
//                         // eventsRecieved: true
//                     });
//                 });

//             }
//         });
//     }

//     /* When you choose a particular slot on the calendar */
//     onSlotChange(slotInfo) {
//         // var startDate = moment(slotInfo.start.toLocaleString()).format("YYYY-MM-DD HH:mm:ss");
//         // var endDate = moment(slotInfo.end.toLocaleString()).format("YYYY-MM-DD HH:mm:ss");
//         console.log(moment(slotInfo.end.toLocaleString()).format("YYYY-MM-DDTHH:mm:ss"));
//         var startDate = moment(slotInfo.start.toLocaleString()).format("YYYY-MM-DDTHH:mm:ss");
//         var endDate = moment(slotInfo.end.toLocaleString()).format("YYYY-MM-DDTHH:mm:ss");
//         this.setState({
//             createEvent: true,
//             slotStartDate: startDate,
//             slotEndDate: endDate,
//         })

//         // console.log('startTime', startDate); //shows the start time chosen
//         // console.log('endTime', endDate); //shows the end time chosen
//     }

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

//     /* When you click on an already booked slot */
//     onEventClick(event) {
//         console.log(event) //Shows the event details provided while booking
//         if (event.isrepeat){
//             this.setState({
//                 isRepeatEvent: true,
//                 repeat_start: event.repeat_start,
//                 repeat_end: event.repeat_end
//             });
//         }
//         this.setState({
//             selectedEvent: event,
//             showEventDetail: true
//         });
//     }

//     onEventExit(event) {
//         this.setState({
//             showEventDetail: false
//         });
//     }

//     onChange = (date) => {
//         console.log(date);
//         this.setState({
//             date
//         })
//     }

//     deleteThisEvent = (e) => {
//         // delete the Event from the myEvents object
//         const prevMyEvents = this.state.myEvents;
//         const currEvent = this.state.selectedEvent;
//         let count = 0;
//         prevMyEvents.forEach((prevEvent) => {
//             if (prevEvent.key == currEvent.key){
//                 // remove this index of prevMyEvents
//                 prevMyEvents.splice(count, 1);
//             }
//             count++;
//         });
//         this.setState({
//             myEvents: prevMyEvents
//         });

//         // go to firebase, delete entry that matches selected Event
//         // find based on 'start' value

//         console.log(currEvent.key)
//         fire.auth().onAuthStateChanged( user => {
//             if (user) {
//                 let uid = user.uid;
//                 let database = fire.database();
//                 database.ref('/users/' + uid + '/routine/' + currEvent.key).remove();

//             }
//         });
//         this.setState({
//             showEventDetail: false
//         });
//     }

//     deleteRepeatEvent = (e) => {
//         // TODO: Fix edge case where delete one then delete repeat
//         // delete the Event from the myEvents object
//         const prevMyEvents = this.state.myEvents;
//         const currEvent = this.state.selectedEvent;
//         const prevRepeatStart = this.state.repeat_start;
//         const prevRepeatEnd = this.state.repeat_end;
//         const repeatArray = []
//         for (let i = prevRepeatStart; i <= prevRepeatEnd; i++){
//             repeatArray.push(i);
//         }
//         console.log(repeatArray);
//         let n = 0;
//         while(n < prevMyEvents.length -1){
//             prevMyEvents.reverse();
//             if(prevMyEvents[n].key in repeatArray){
//                 console.log("Key is in array: " + prevMyEvents[n].key);
//                 // remove this index of prevMyEvents
//                 prevMyEvents.splice(n, 1);
//             } else n++;
//             prevMyEvents.reverse();
//         }
//         console.log(prevMyEvents)
//         this.setState({
//             myEvents: prevMyEvents
//         });

//         // go to firebase, delete entry that matches selected Event
//         // find based on 'start' value
//         console.log(currEvent.key)
//         fire.auth().onAuthStateChanged( user => {
//             if (user) {
//                 let uid = user.uid;
//                 let database = fire.database();
//                 for(let i in repeatArray){
//                     console.log(i);
//                     database.ref('/users/' + uid + '/routine/' + repeatArray[i]).remove();
//                 }
//             }
//         });
//         this.setState({
//             showEventDetail: false
//         });
//     }

//     render() {
//         const localizer = momentLocalizer(moment);
//         const { showEventDetail, selectedEvent, isRepeatEvent, isDone, createEvent, slotStartDate, slotEndDate, isRoutineNow, scheduledEvent } = this.state;
//         return (
//             <div className='routine-background'>
//                 <div className='routine-container'>
//                     <div className='routine-daily-schedule'>
//                         <Calendar
//                             localizer={localizer}
//                             events={this.state.myEvents}
//                             startAccessor="start"
//                             endAccessor="end"
//                             // onSelectEvent={()=>alert("Selected!")}
//                             views={['month', 'day', 'agenda']}
//                             selectable
//                             onSelectEvent={event => this.onEventClick(event)}
//                             onSelectSlot={(slotInfo) => this.onSlotChange(slotInfo) }
//                             popup={true}
//                             components={{
//                                 timeSlotWrapper: this.state.ColoredDateCellWrapper,
//                                 event: Event,
//                                 agenda: {
//                                         event: EventAgenda
//                                     }
//                             }}
//                             style={{ height: 500 }}
//                             />
//                     </div>
//                 </div>
//                 {
//                     showEventDetail ?
//                     <div className='createEvent-container'>
//                         <h2>{selectedEvent.title}</h2>
//                         <button onClick={this.deleteThisEvent}>Delete this Event</button>
//                         {
//                             isRepeatEvent ?
//                             <button onClick={this.deleteRepeatEvent}>Delete all occurences of Event</button>
//                             :
//                             <div></div>
//                         }
//                         <button onClick={event=>this.onEventExit(event)}>Close</button>
//                     </div>
//                     :
//                     <div></div>
//                 }
//                 { createEvent ?
//                     <div className='createEvent-container'>
//                         <form onSubmit={this.addEvent}>
//                             <h2 className='createEvent-heading'>NO PROGRAM NAME</h2>
//                             <label>Start Date</label>
//                             <input type='datetime-local' defaultValue={slotStartDate} required name='beginentry' id='start-date'/>
//                             <label>End Date</label>
//                             <input type='datetime-local' defaultValue={slotEndDate} required name='endentry' id='create-event-end-date'/>

//                             <p>Repeat Event</p>
//                             <input type='radio' id='yesrepeat' name='repeat' value='yesrepeat' />
//                             <label for='yesrepeat'>Repeat</label>
//                             <input type='radio' id='norepeat' name='repeat' value='norepeat' defaultChecked />
//                             <label for='norepeat'>Dont Repeat</label>
//                             <button type='submit'>Add to Calendar</button>
//                             {/* <button type='button' onClick={()=>this.setState({createEvent: false})}>Cancel</button> */}
//                         </form>
//                         <button onClick={()=>this.setState({createEvent: false})}>Cancel</button>
//                     </div>
//                     :
//                     <div></div>
//                 }
//                 {
//                     isRoutineNow ?
//                     <div>
//                         <Link to={'programs/' + scheduledEvent.id + '/' + scheduledEvent.key} key={scheduledEvent.id}>
//                             <button>Start {scheduledEvent.title} Workout Now!</button>
//                         </Link>
//                     </div>
//                     :
//                     <div>Your all caught up!</div>
//                 }
//             </div>
//         )
//     }
// }

const Routine = () => {
  const [events, setEvents] = useState([]);
  const [ColoredDateCellWrapper, setCDCW] = useState(null);
  const [routineNow, setRoutineNow] = useState(false);
  const [activeRoutine, setActiveRoutine] = useState({});
  const [selectedEvent, setSelectedEvent] = useState({});
  const [eventInfo, setEventInfo] = useState(false);

  const localizer = momentLocalizer(moment);

  useEffect(() => {
    fire.getUserRoutines().then((data) => {
      setEvents(data.val());
      data.forEach((event) => {
        if (moment(new Date()).isBetween(event.val().start, event.val().end)) {
          console.log("There is an event now");
          if (event.isdone) {
            setRoutineNow(false);
            setActiveRoutine(event);
          } else {
            setRoutineNow(true);
            setActiveRoutine(event);
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
      
    // ***** ADD KEY TO ROUTINE CHILDREN, V IMPORTANT *****
    // May be more than one occurrence of same event
    // need to target key and not id for this reason
      if(!isRepeat){
          // Delete event from events state
          let updatedEvents = events.filter(event => event.id !== selectedEvent.id);
          setEvents(updatedEvents);
          // Delete event from firebase database
          fire.deleteUserEvent(selectedEvent.key);
          setSelectedEvent({});
          setEventInfo(false);
      } else {
        console.log("Work in progress...");
      }
  }


//     deleteRepeatEvent = (e) => {
//         // TODO: Fix edge case where delete one then delete repeat
//         // delete the Event from the myEvents object
//         const prevMyEvents = this.state.myEvents;
//         const currEvent = this.state.selectedEvent;
//         const prevRepeatStart = this.state.repeat_start;
//         const prevRepeatEnd = this.state.repeat_end;
//         const repeatArray = []
//         for (let i = prevRepeatStart; i <= prevRepeatEnd; i++){
//             repeatArray.push(i);
//         }
//         console.log(repeatArray);
//         let n = 0;
//         while(n < prevMyEvents.length -1){
//             prevMyEvents.reverse();
//             if(prevMyEvents[n].key in repeatArray){
//                 console.log("Key is in array: " + prevMyEvents[n].key);
//                 // remove this index of prevMyEvents
//                 prevMyEvents.splice(n, 1);
//             } else n++;
//             prevMyEvents.reverse();
//         }
//         console.log(prevMyEvents)
//         this.setState({
//             myEvents: prevMyEvents
//         });

//         // go to firebase, delete entry that matches selected Event
//         // find based on 'start' value
//         console.log(currEvent.key)
//         fire.auth().onAuthStateChanged( user => {
//             if (user) {
//                 let uid = user.uid;
//                 let database = fire.database();
//                 for(let i in repeatArray){
//                     console.log(i);
//                     database.ref('/users/' + uid + '/routine/' + repeatArray[i]).remove();
//                 }
//             }
//         });
//         this.setState({
//             showEventDetail: false
//         });
//     }

  const handleEventExit = (e) => {
    setSelectedEvent({});
    setEventInfo(false);
  }

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
            onSelectSlot={(slotInfo) => console.log(slotInfo)}
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
          <button onClick={() => handleDeleteEvent(false)}>Delete this Event</button>
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
