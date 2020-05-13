import React from 'react';

import * as Icon from "react-feather"
import {
  ButtonGroup,
  Button,
  UncontrolledTooltip,
  Col
} from "reactstrap"

export default function toolbar(props) {
  const toolBar = (
    props.typeBar === "1" ?
    <div>
      <ButtonGroup className="mb-1">
        {props.toolBarList.map((item, index) => {
          const IconTag = item.icon ? Icon[item.icon] : null
          const labelTag = item.label ? item.label : null
          const disabled = item.disabled === undefined ? false : item.disabled
          const toolTip = item.tooltip ? ( <UncontrolledTooltip
            placement="bottom"
            target={item.id}
          >
            {item.tooltip}
          </UncontrolledTooltip>) : null
          return (
            <Button.Ripple className={item.buttomClassName} disabled={disabled} outline={item.outline} color={item.color} onClick={item.action} key={item.id} id={item.id}>
               {item.icon ? <IconTag size={item.size} /> : null}
               {item.label ?<span className="align-middle ml-25">{labelTag}</span>: null}
              {toolTip}
            </Button.Ripple>
          )
        })}
      </ButtonGroup>
    </div>
    :
    <Col className="d-flex justify-content-end flex-wrap" sm="12">
       {props.toolBarList.map((item, index) => {
         const IconTag = item.icon ? Icon[item.icon] : null
         const labelTag = item.label ? item.label : null
         const disabled = item.disabled === undefined ? false : item.disabled
         const toolTip = item.tooltip ? ( <UncontrolledTooltip
          placement="bottom"
          target={item.id}
        >
          {item.tooltip}
        </UncontrolledTooltip>) : null
         return (
           <Button.Ripple className={item.buttomClassName} disabled={disabled} outline={item.outline} color={item.color} onClick={item.action} key={item.id} id={item.id}
           size="sm">
             {item.icon ? <IconTag size={item.size} /> : null}
             {item.label ?<span className="align-middle ml-25">{labelTag}</span>: null}
             {toolTip}
           </Button.Ripple>
         )
       })}

    </Col>
 )

  return (
    toolBar
  )
}
