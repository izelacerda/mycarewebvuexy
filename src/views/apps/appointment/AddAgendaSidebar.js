import React, { useState} from "react"
import { X } from "react-feather"


import "flatpickr/dist/themes/light.css";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"

import Calendar from  "./calendar/list/List"
import Cadastro from  "./calendar/cadastro"

export default function AddAgendaSidebar(props) {
  const [screen, setScreen] = useState(1)
  const [id, setId] = useState(0)

  function handleChangeScreen(screen, id) {
    console.log(id)
    console.log(screen)
    setId(id)
    setScreen(screen)
  }
  return (
    <div
        className={`add-event-sidebar ${
          props.sidebar ? "show" : "hidden"
        }`}
    >
      <div className="header d-flex justify-content-between">
        <h3 className="text-bold-600 mb-0">
            Agendas
        </h3>
        <div
          className="close-icon cursor-pointer"
          onClick={() => props.handleSidebar(false)}
        >
          <X size={20} />
        </div>
      </div>
      <div className="add-event-body">
        {screen === 1 ?
          <Calendar {...props} handleChangeScreen={handleChangeScreen} id={id} />
          :
          <Cadastro {...props} handleChangeScreen={handleChangeScreen} id={id} />
        }
      </div>
    </div>
  )
  // }
}

// export default AddEvent
