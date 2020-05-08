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
           console.log('alo2')
           console.log(item.disabled)
          const IconTag = Icon[item.icon ? item.icon : "X"]
          const disabled = item.disabled === undefined ? false : item.disabled
          return (
            <Button.Ripple className="btn-icon" disabled={disabled} color={item.color} onClick={item.action} key={item.id} id={item.id}>
              <IconTag size={item.size} />
              <UncontrolledTooltip
                placement="bottom"
                target={item.id}
              >
                {item.tooltip}
              </UncontrolledTooltip>
            </Button.Ripple>
          )
        })}
      </ButtonGroup>
    </div>
    :
    <Col className="d-flex justify-content-end flex-wrap" sm="12">
       {props.toolBarList.map((item, index) => {
         const IconTag = Icon[item.icon ? item.icon : "X"]
         const labelTag = item.label ? item.label : null
         const toolTip = item.tooltip ? ( <UncontrolledTooltip
          placement="bottom"
          target={item.id}
        >
          {item.tooltip}
        </UncontrolledTooltip>) : null
         return (
           <Button.Ripple className={item.buttomClassName} outline={item.outline} color={item.color} onClick={item.action} key={item.id} id={item.id}
           size="sm">
             <IconTag size={item.size} />
             <span className="align-middle ml-25">{labelTag}</span>
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
