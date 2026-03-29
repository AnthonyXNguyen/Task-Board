import { Draggable } from '@hello-pangea/dnd'

// Define the shape of a Task object
interface Task {
  id: string
  title: string
  description?: string
  priority?: 'low' | 'normal' | 'high'
  due_date?: string
  status: string
}

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