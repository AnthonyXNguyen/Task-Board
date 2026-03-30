import { Draggable } from '@hello-pangea/dnd'
import { Task } from './types'

interface TaskCardProps {
  task: Task
  index: number  // needed by Draggable to track order
}

function TaskCard({ task, index }: TaskCardProps) {
  return (
    // Draggable wraps the card so it can be picked up and moved
    // draggableId must be unique — we use the task's id
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          // JavaScript object that holds a reference to the DOM element.
          ref={provided.innerRef}
          {...provided.draggableProps}    // handles drag positioning
          {...provided.dragHandleProps}   // handles the click-and-drag gesture
        >
          <p>{task.title}</p>
          {task.priority && <span>{task.priority}</span>}
          {task.due_date && <span>{task.due_date}</span>}
        </div>
      )}
    </Draggable>
  )
}

export default TaskCard