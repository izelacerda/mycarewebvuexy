import React from "react"
import { Button } from "reactstrap"
import { Plus } from "react-feather"

export default function AddEventButton(props) {
  return (
    <Button.Ripple
      color="primary"
      onClick={() => {
        props.onAdd()
      }}
      className="d-sm-block d-none"
    >
      {" "}
      <Plus size={15} /> <span className="align-middle">Add</span>
    </Button.Ripple>
  )
}
