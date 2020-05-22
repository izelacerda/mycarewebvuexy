import React, { useState, useEffect } from "react"
import { X, Tag } from "react-feather"
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
  Button
} from "reactstrap"
import {
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds
} from "date-fns";
import Flatpickr from "react-flatpickr";
import { toast, Flip } from "react-toastify"
import { utcToZonedTime } from "date-fns-tz";

import "flatpickr/dist/themes/light.css";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"

// const eventColors = {
//   // business: "chip-success",
//   // work: "chip-warning",
//   // personal: "chip-danger",
//   // others: "chip-primary",
//   // teste: "chip-danger"
// }
export default function AddEvent(props) {
// class AddEvent extends React.Component {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [title, setTitle] = useState("")
  const [label, setLabel] = useState(null)
  const [allDay, setAllDay] = useState(false)
  const [selectable, setSelectable] = useState(true)

  useEffect(() => {
    async function loadDados() {
      setStartDate(props.eventInfo.start)
      setEndDate(props.eventInfo.end)
      setTitle(props.eventInfo.title)
      setLabel(props.eventInfo.label)
      setAllDay(props.eventInfo.allDay)
      setSelectable(props.eventInfo.selectable)
     }
     if(props.eventInfo) {
      loadDados();
     }
  }, [props.eventInfo]);

  const handleDateChange = date => {
    let data = new Date(date.toString())
    let minutes = data.getMinutes()
    let hours = data.getHours()
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if(minutes!==0 && minutes!==30) {
      if(minutes>=21 && minutes<=29) {
        minutes=30
      }
      else {
        minutes=0
        hours+=1
      }
    }
    let start = setMilliseconds(
      setSeconds(setMinutes(setHours(data, hours), minutes), 0),
      0
    );
    const newStartDate = utcToZonedTime(start, timezone);
    let end = setMilliseconds(
      setSeconds(setMinutes(newStartDate, minutes+30), 0),
      0
    );
    const newEndDate = utcToZonedTime(end, timezone);
    setStartDate(newStartDate)
    setEndDate(newEndDate)
  }

  const handleEndDateChange = date => {
    setEndDate(date)
  }

  const handleLabelChange = label => {
    setLabel(label)
  }

  const handleAddEvent = id => {
    if(label === null || label === undefined) {
      toast.error(`Obrigado informar o tipo de Agendamento! `, { transition: Flip });
      return
    }
    props.handleSidebar(false)
    props.HandleAddEvent({
      id: id,
      title: title,
      start: startDate,
      end: endDate,
      label: label === null && props.calendars.length>1 ? props.calendars[0].label : label,
      allDay: allDay,
      selectable: selectable
    })
    setStartDate(new Date())
    setEndDate(new Date())
    setTitle("")
    setLabel(null)
    setAllDay(true)
    setSelectable(true)
  }
  const handleUpdateEvent = id => {
    props.handleSidebar(false)
    props.updateEvent({
      id: props.eventInfo.id,
      title: title,
      label: label,
      start: startDate,
      end: endDate,
      allDay: false,
      selectable: true
    })
  }

  return (
    <div
        className={`add-event-sidebar ${
          props.sidebar ? "show" : "hidden"
        }`}
    >
      <div className="header d-flex justify-content-between">
        <h3 className="text-bold-600 mb-0">
          {props.eventInfo !== null &&
          props.eventInfo.title.length > 0
            ? "Alterar Evento"
            : "Incluir Evento"}
        </h3>
        <div
          className="close-icon cursor-pointer"
          onClick={() => props.handleSidebar(false)}
        >
          <X size={20} />
        </div>
      </div>
      <div className="add-event-body">
        <div className="category-action d-flex justify-content-between my-50">
          <div className="event-category">
            {label !== null ? (
              <div className={`chip ${props.handleEventColorsW(label)}`}>
                <div className="chip-body">
                  <div className="chip-text text-capitalize">
                    {label}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="category-dropdown">
            <UncontrolledDropdown>
              <DropdownToggle tag="div" className="cursor-pointer">
                <Tag size={18} />
              </DropdownToggle>
              <DropdownMenu tag="ul" right>
                {props.calendars.map(calendar => {
                  return (
                  calendar.id>0 ?
                  <DropdownItem
                    tag="li"
                    key={calendar.id}
                    onClick={() => handleLabelChange(calendar.name)}
                  >
                    <span className={`bullet bullet-sm mr-50 ${props.handleEventColorsB(calendar.name)}`}></span>
                    <span>{calendar.name}</span>
                  </DropdownItem>
                  : null)
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
        <div className="add-event-fields mt-2">
          <FormGroup className="form-label-group">
            <Input
              type="text"
              id="EventTitle"
              placeholder="Event Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <Label for="EventTitle">Título</Label>
          </FormGroup>
          <FormGroup>
            <Label for="startDate">Início</Label>
            <Flatpickr
              id="startDate"
              className="form-control"
              data-enable-time
              value={startDate}
              onChange={date => handleDateChange(date)}
              // options={{ altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", }}
            />
              {/* <Flatpickr
            className="form-control"
            data-enable-time
            value={dateTimePicker}
            onChange={date => {
              propssetState({ dateTimePicker : date });
            }} */}
          </FormGroup>
          <FormGroup>
            <Label for="endDate">Fim</Label>
            <Flatpickr
              id="endDate"
              className="form-control"
              data-enable-time
              value={endDate}
              onChange={date => handleEndDateChange(date)}
              // options={{ altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", }}
            />
          </FormGroup>
        </div>
        <hr className="my-2" />
        <div className="add-event-actions text-right">

          <Button.Ripple
            disabled={title.length > 0 ? false : true}
            color="primary"
            onClick={() => {
              if (props.eventInfo !== null &&
                props.eventInfo.title.length > 0)
                handleUpdateEvent()
              else
                handleAddEvent(0)
            }}
          >
            {props.eventInfo !== null &&
            props.eventInfo.title.length > 0
              ? "Alterar"
              : "Incluir"}
          </Button.Ripple>
          <Button.Ripple
            className="ml-1 mr-1"
            color="flat-primary"
            onClick={() => {
              props.handleSidebar(false)
              if (props.handleSelectedEvent)
                props.handleSelectedEvent(null)
              else return null
            }}
          >
            Cancelar
          </Button.Ripple>
          {  props.eventInfo === null ||
                props.eventInfo.title.length <= 0
             ? null
             :
             <Button.Ripple
              className="mr-1"
              disabled={false}
              color="flat-danger"
              onClick={() => {
                  props.handleSidebar(false)
                  props.deleteEvent({
                    id: props.eventInfo.id
                  })
              }}
            >
              Excluir
            </Button.Ripple>

          }
        </div>
      </div>
    </div>
  )
  // }
}

// export default AddEvent
