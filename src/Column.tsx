import { Droppable } from '@hello-pangea/dnd'
import { Task } from './types'
import TaskCard from './TaskCard'

interface ColumnProps {
  columnId: string        // e.g. "todo", "in_progress", saved to Supabase
  title: string          // e.g. "To Do", "In Progress", title of column for front-end
  tasks: Task[]          // only the tasks belonging to this column
  onAddTask: (status: string) => void  // tells Board to open the create form
}

function Column({ columnId, title, tasks, onAddTask}: ColumnProps){
    return (
        <div>
            <h2>{title}</h2>

            <Droppable droppableId={columnId}>
                {(provided) => (
                    <div
                    // JavaScript object that holds a reference to the DOM element.
                    ref={provided.innerRef}
                    //contains data attributes that we use for styling and lookups.
                    {...provided.droppableProps} 
                    >
                    
                    {tasks.map((task, index) => (
                        <TaskCard key={task.id} task={task} index={index} />
                    ))}
                    
                    {/* This is used to create space in the <Droppable /> as needed during a drag.*/}
                    {provided.placeholder}
                    </div>
                )}
            </Droppable>

            <button onClick={() => onAddTask(columnId)}>+ Add Task</button>
        </div>
    )
}

export default Column


