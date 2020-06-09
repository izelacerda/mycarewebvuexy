import React, { useState, useEffect } from "react"
import AddEventSidebar from "./AddEventSidebar"
import AddAgendaSidebar from "./AddAgendaSidebar"
import AddEventButton from "./AddEventButton"
import { Card, CardBody, Button, ButtonGroup, Col } from "reactstrap"
import { Calendar, momentLocalizer } from "react-big-calendar"
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import moment from "moment"

import { ChevronLeft, ChevronRight, Plus } from "react-feather"
import { useSelector } from "react-redux";
import Select from "react-select"
import { toast, Flip } from "react-toastify"
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { zonedTimeToUtc } from 'date-fns-tz';
import {
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds
} from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

import "react-big-calendar/lib/addons/dragAndDrop/styles.scss"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "../../../assets/scss/plugins/calendars/react-big-calendar.scss"
import api from "../../../services/api"


const DragAndDropCalendar = withDragAndDrop(Calendar)
const localizer = momentLocalizer(moment)
// let eventColors = [
//   {id: 1, label: 'RM', color1: '1', color2: '1'},
//   {id: 2, label: 'GKN', color1: '2', color2: '2'},
//   {id: 3, label: 'Pessoal', color1: '3', color2: '3'},
//   {id: 4, label: 'Profi', color1: '4', color2: '4'}
//   // business: "bg-success",
//   // work: "bg-warning",
//   // personal: "bg-danger",
//   // others: "bg-primary",
//   // teste: "bg-danger"
// ]
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function AppointmentApp(props) {
  const auth = useSelector(state => state.auth);
  // let insertPermission = props.userPermission.includes(20)
  // let deletePermission = props.userPermission.includes(22)
  // let reportPermission = props.userPermission.includes(23)
  // let dadosdoCadastroPermission = props.userPermission.includes(24)

  const [events, setEvents] = useState([])
  const views = {
                                      month: true,
                                      week: true,
                                      day: true
                                    }
  const [eventInfo, setEventInfo] = useState(null)
  const [sidebar, setSidebar] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [providers, setProviders] = useState([])
  const [provider_id, setProvider_id] = useState(0)
  const [calendars, setCalendars] = useState([])
  const [calendar_id, setCalendar_id] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [sideBarType, setSideBarType] = useState(1)

  useEffect(() => {
    async function loadDados() {
      if (auth.login !== undefined) {
        if (auth.login.licence_id !== undefined) {

          //providers
          let response = null
          let body = {
            licence_id: auth.login.licence_id,
            id: 0,
            active: "active"
          };
          response = await api.post("/providers.list",
            body
          );
          const providers = response.data
          let provider_id = 0
          setProviders(providers)
          if(providers.length>0) {
            provider_id = providers[0].id
            setProvider_id(provider_id)
          }

          //calendars
          body = {
            licence_id: auth.login.licence_id,
            id: 0,
            active: "active"
          };
          response = await api.post("/calendars.list",
            body
          );
          const calendars = response.data
          let calendar_id = 0
          calendars.push( {
            "id": 0,
            "name": "Geral",
            "is_active": true
          })
          setCalendars(calendars)
          setCalendar_id(calendar_id)
          setLoaded(true)
        }
      }
     }
     if(auth !== undefined && !loaded)
      {
        loadDados();
      }
  }, [auth, loaded]);
  // }, [load]); // eslint-disable-line

  useEffect(() =>
  {
     async function loadDados() {
          let body = {
            licence_id: auth.login.licence_id,
            user_id: provider_id,
            id: 0,
          	calendar_id: calendar_id
          };
          let response = await api.post("/appointments.list",
            body
          );
          let rowData= []
          if(response.data && response.data.length>0) {
             rowData = response.data.map(event => {
              event.start = new Date(event.start)
              event.end = new Date(event.end)
              return event
            })
          }
          setEvents(rowData)
          setLoaded(true)
     }
     if(loaded && provider_id>0)
      {
        loadDados();
      }
  }, [loaded, provider_id, calendar_id]) // eslint-disable-line

  const handleColors = (color, type) => {
    let ret = "primary"
    if(color==="2") {
      ret = "success"
    }
    else  if(color==="3") {
      ret = "warning"
    }
    else  if(color==="4") {
      ret = "danger"
    }
    if(type==="1") {
      ret= "bg-"+ret
    }
    if(type==="2") {
      ret= "chip-"+ret
    }
    if(type==="3") {
      ret= "bullet-"+ret
    }
    return ret
  }
  const handleEventColors = event => {
    const item = calendars.find(x => x.name === event.label)
    let color = handleColors(item.color1,"1")
    return { className: color }
  }
  const handleEventColorsW = event => {
    const item = calendars.find(x => x.name === event)
    let color = handleColors(item.color1,"2")
    return color
  }
  const handleEventColorsB = event => {
    const item = calendars.find(x => x.name === event)
    let color = handleColors(item.color1,"3")
    return color
  }
  const moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const idx = events.indexOf(event)
    let allDay = event.allDay
    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }
    events[idx].start = start
    events[idx].end = end
    events[idx].allDay = allDay
    // const updatedEvent = { ...event, start, end, allDay }
    // const nextEvents = [...events]
    // nextEvents.splice(idx, 1, updatedEvent)
    // this.setState({
    //   events: nextEvents
    // })
    // this.props.updateDrag(updatedEvent)
  }

  // const resizeEvent = ({ event, start, end }) => {
  //   // const { events } = this.state
  //   // const nextEvents = events.map(existingEvent => {
  //   //   return existingEvent.id === event.id
  //   //     ? { ...existingEvent, start, end }
  //   //     : existingEvent
  //   // })

  //   // this.setState({
  //   //   events: nextEvents
  //   // })

  //   // this.props.updateResize({ ...event, start, end })
  // }
  function findCalendar(label) {
    if(label===null) return 0
    const ret = calendars.find(e => e.name === label)
    if(ret !== null) {
      return ret.id
    }
    else {
      return 0
    }
  }
  const HandleAddEvent  = async (event) => {

    let calendar_id = findCalendar(event.label)
    try {
      let data =
      {
        licence_id: auth.login.licence_id,
        user_id: provider_id,
        calendar_id: calendar_id,
        title:  event.title,
        desc: " ",
        start: event.start
        ? format(
            zonedTimeToUtc(event.start, timezone),
            'MM/dd/yyyy HH:mmXXX',
            {
              locale: pt,
            }
          )
        : '',
        end: event.end
        ? format(
            zonedTimeToUtc(event.end, timezone),
            'MM/dd/yyyy HH:mmXXX',
            {
              locale: pt,
            }
          )
        : '',
        allDay: false,
        selectable: true,
        userlog_id: auth.login.values.loggedInUser.id
      }
      const response = await api.post(`/appointments`, data )
      const eventos = events.map(e => { return e })
      event.id=response.data.id
      eventos.push(event)
      setEvents(eventos)

      toast.success("Evento incluído com sucesso!", { transition: Flip })

    } catch (error) {
      toast.success(`Erro ao Incluir Evento! ${error.message}`, { transition: Flip });
    }
  }

  const handleSelectEvent = event => {
    // let filteredState = events.filter(i => i.id === event.id)
    setSideBarType(1)
    setSidebar(true)
    setEventInfo(event)
    // this.props.handleSidebar(true)
    // this.props.handleSelectedEvent(filteredState[0])
    // this.setState({
    //   eventInfo: filteredState[0]
    // })
  }
  const handleTypeAgenda = () => {
    setSideBarType(2)
    setSidebar(true)
  }
  const updateEvent = async event => {
    let calendar_id = findCalendar(event.label)
    try {
      let data =
      {
        licence_id: auth.login.licence_id,
        user_id: provider_id,
        calendar_id: calendar_id,
        id: event.id,
        title:  event.title,
        desc: " ",
        start: event.start
        ? format(
            zonedTimeToUtc(event.start, timezone),
            'MM/dd/yyyy HH:mm:ssXXX',
            {
              locale: pt,
            }
          )
        : '',
        end: event.end
        ? format(
            zonedTimeToUtc(event.end, timezone),
            'MM/dd/yyyy HH:mm:ssXXX',
            {
              locale: pt,
            }
          )
        : '',
        allDay: event.allDay,
        selectable: true,
        userlog_id: auth.login.values.loggedInUser.id
      }
      await api.put(`/appointments`, data);
      let updatedEvents = events.map(e => {
        if (e.id === event.id) {
          return event
        }
        return e
      })
      setEvents(updatedEvents)
      toast.success("Evento alterado com sucesso!", { transition: Flip });

    } catch (error) {
      toast.success(`Erro ao Alterar Evento! ${error.message}`, { transition: Flip });
    }
  }
  const deleteEvent = async event => {
    try {
      let data = {
        licence_id: auth.login.licence_id,
        id:  event.id,
      };
      await api.delete("/appointments",
        { data }
      );
      let updatedEvents = events.filter(e => e.id !== event.id)
      setEvents(updatedEvents)
      toast.success("Evento excluído com sucesso!", { transition: Flip });

    } catch (error) {
      toast.success(`Erro ao excluir Evento! ${error.message}`, { transition: Flip });
    }
  }
  function handleChangeSelect(select, value) {
    if(select==="provider") {
      setProvider_id(value.id)
    }
    if(select==="calendar") {
      setCalendar_id(value.id)
    }
  }

  function handleSelectSlot(startP, endP) {
    let start = null
    let end = null
    if(startP === null) {
      start = new Date()
    }
    else {
      start = new Date(startP)
    }
    if(endP === null) {
      end = new Date()
    }
    else {
      end = new Date(endP)
    }
    let minutes = start.getMinutes()
    let hours = start.getHours()
    if(minutes!==0 && minutes!==30) {
      if(minutes>=21 && minutes<=29) {
        minutes=30
      }
      else {
        minutes=0
        hours+=1
      }
    }
    start = setMilliseconds(
      setSeconds(setMinutes(setHours(start, hours), minutes), 0),
      0
    );
    let newStartDate = utcToZonedTime(start, timezone);
    end = setMilliseconds(
      setSeconds(setMinutes(newStartDate, minutes+30), 0),
      0
    );
    let newEndDate = utcToZonedTime(end, timezone);
    let eventInfo = {
          id: 0,
          title: "",
          label: null,
          start: newStartDate,
          end: newEndDate
        }

    setSideBarType(1)
    setEventInfo(eventInfo)
    setSidebar(true)
  }
  function Toolbar(props) {

    return (
      <div className="calendar-header mb-2 d-flex justify-content-between flex-wrap">
        <div>
          <div className="w-100 text-bold-500 font-medium-2 align-left">
            <Select
                getOptionLabel={option => option.username}
                getOptionValue={option => option.id}
                className="React"
                classNamePrefix="select"
                name="provider"
                options={providers}
                defaultValue={providers.filter(option => option.id === provider_id)}
                onChange={e => handleChangeSelect("provider", e)}
                // isDisabled={!salvarPermission}
            />
          </div>
          <div className="event-tags d-none d-sm-flex justify-content-start mt-1">
            {calendars.map(calendar => {
              return (
              calendar.id>0 ? <div key={calendar.id} className="tag mr-1">
                <span className={`bullet bullet-sm mr-50 ${handleEventColorsB(calendar.name)}`}></span>
                <span>{calendar.name}</span>
              </div> : null)
            })}
             <Button.Ripple
              className="btn-icon rounded-circle"
              size="sm"
              color="primary"
              onClick={() => handleTypeAgenda(2)}
            >
              <Plus size={10} />
            </Button.Ripple>
          </div>
        </div>
        <div className="text-center view-options mt-1 mt-sm-0 ml-lg-5 ml-0">
          <div className="mb-1">
            <ButtonGroup>
              <button
                className={`btn ${
                  props.view === "month"
                    ? "btn-primary"
                    : "btn-outline-primary text-primary"
                }`}
                onClick={() => {
                  props.onView("month")
                }}
              >
                Month
              </button>
              <button
                className={`btn ${
                  props.view === "week"
                    ? "btn-primary"
                    : "btn-outline-primary text-primary"
                }`}
                onClick={() => {
                  props.onView("week")
                }}
              >
                Week
              </button>
              <button
                className={`btn ${
                  props.view === "day"
                    ? "btn-primary"
                    : "btn-outline-primary text-primary"
                }`}
                onClick={() => {
                  props.onView("day")
                }}
              >
                Day
              </button>
            </ButtonGroup>
          </div>
          <div className="calendar-navigation">
            <Button.Ripple
              className="btn-icon rounded-circle"
              size="sm"
              color="primary"
              onClick={() => props.onNavigate("PREV")}
            >
              <ChevronLeft size={15} />
            </Button.Ripple>
            <div className="month d-inline-block mx-75 text-bold-500 font-medium-2 align-middle">
              {props.label}
            </div>
            <Button.Ripple
              className="btn-icon rounded-circle"
              size="sm"
              color="primary"
              onClick={() => props.onNavigate("NEXT")}
            >
              <ChevronRight size={15} />
            </Button.Ripple>
          </div>

        </div>
          <Col  md="2" sm="2">
            <Select
              getOptionLabel={option => option.name}
              getOptionValue={option => option.id}
              className="React"
              classNamePrefix="select"
              name="calendar"
              options={calendars}
              defaultValue={calendars.filter(option => option.id === calendar_id)}
              onChange={e => handleChangeSelect("calendar", e)}
              // isDisabled={!salvarPermission}
            />
          <div className="text-md-right d-md-block d-none mt-1">
            <AddEventButton onAdd={() => handleSelectSlot(null,null)} />
          </div>
          </Col>
      </div>
    )
  }

    // const { events, views, sidebar } = this.state
  return (
      <div className="app-calendar position-relative">
        <div
          className={`app-content-overlay ${sidebar ? "show" : "hidden"}`}
          onClick={() => {
            setSideBarType(1)
            setSidebar(false)
            setSelectedEvent(null)
            // this.props.handleSidebar(false)
            // this.props.handleSelectedEvent(null)
          }}
        ></div>
        <Card>
          <CardBody>
            { loaded ? <DragAndDropCalendar
              localizer={localizer}
              events={events}
              onEventDrop={moveEvent}
              // onEventResize={resizeEvent}
              startAccessor="start"
              endAccessor="end"
              resourceAccessor="url"
              views={views}
              // step={60}
              // timeslots={1}
              // showMultiDayTimes
              components={{ toolbar: Toolbar }}
              eventPropGetter={handleEventColors}
              popup={true}
              dados={providers}
              onSelectEvent={event => {
                handleSelectEvent(event)
              }}
              onSelectSlot={({ start, end }) =>handleSelectSlot(start, end) }
              selectable={true}
            />
            : null }
          </CardBody>
        </Card>
        {sideBarType === 1 ?
          <AddEventSidebar
            sidebar={sidebar}
            handleSidebar={setSidebar}
            HandleAddEvent={HandleAddEvent}
            events={events}
            eventInfo={eventInfo}
            selectedEvent={selectedEvent}
            updateEvent={updateEvent}
            deleteEvent={deleteEvent}
            handleEventColorsW={handleEventColorsW}
            handleEventColorsB={handleEventColorsB}
            calendars={calendars}
            resizable
            agenda={true}
            userPermission={props.userPermission}
          />
        :
        <AddAgendaSidebar
          sidebar={sidebar}
          handleSidebar={setSidebar}
          agenda={true}
          userPermission={props.userPermission} />
        }
      </div>
    )
}

// const mapStateToProps = state => {
//   return {
//     app: state.calendar
//   }
// }

// export default connect(mapStateToProps, {
//   fetchEvents,
//   handleSidebar,
//   HandleAddEvent,
//   handleSelectedEvent,
//   updateEvent,
//   updateDrag,
//   updateResize
// })(CalendarApp)
