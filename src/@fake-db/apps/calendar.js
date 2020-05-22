import mock from "../mock"
let data = {
  events: [
    {
      id: 1,
      title: "My Event",
      start: new Date(),
      end: new Date(),
      label: "RM",
      allDay: false,
      selectable: true
    }
  ]
}

// GET : Calendar Events
mock.onGet("/api/apps/calendar/events").reply(() => {
  return [200, data.events]
})
