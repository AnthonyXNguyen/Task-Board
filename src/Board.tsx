// src/components/Board.tsx
import { useState, useEffect } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { supabase } from './supabaseClient'
import { Task } from './types'
import Column from './Column'

// The four columns and their display labels
const COLUMNS = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'in_review',   label: 'In Review' },
  { id: 'done',        label: 'Done' },
]

function Board() {
  const [tasks, setTasks] = useState<Task[]>([])       // all tasks from Supabase, starts out as empty
  const [loading, setLoading] = useState(true)         // always start loading as true
  const [newTaskTitle, setNewTaskTitle] = useState('')
  // <string | null> means can be a string or null
  // (null) means starts out at null
  const [activeColumn, setActiveColumn] = useState<string | null>(null) // which column's form is open

  // Fetch tasks on startup, only runs once
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: true })
        if (error){
            throw error
        }
        if (data) {
            setTasks(data)
        } 
        else {
            setTasks([])
        }
        } 
        catch (error) {
            console.error('Error fetching tasks:', error)
        } 
        finally { // Always runs, no matter what
            setLoading(false)  // stop showing loading state regardless of success/fail
        }
   }

    fetchTasks()
  }, [])

  // Add new task
  // status: string is a typed parameter
  const handleAddTask = async (status: string) => {
    // .trim() removes whitespace from both ends of a string
    const newTaskTitleTrimmed = newTaskTitle.trim()
    if (newTaskTitleTrimmed === ""){
        return  // Do not let a user create a task with empty spaces
    }
    try {
        // data: is the key,
        // user is Object, like dict in Python and is destructured using { } 
        // user is the Object in data that we actually want 
        // can't have two error objects named the same, so just rename to authError
        // DONT destructure it because we already have the error object we want
        const { data: { user }, error: authError} = await supabase.auth.getUser()
        if (authError) throw authError

        // Same as:
        // const response = await supabase.auth.getUser()
        // const data = response.data
        // const user = data.user

        const { data, error: insertError } = await supabase
            .from('tasks')
            .insert({
                title: newTaskTitleTrimmed, // use trimmed version to normalize input
                status: status,             // use passed value in status
                // ? is optional chaining, if user is null/undefined, return undefined instead of crashing"
                // if user does exist, then return the id
                user_id: user?.id
            })
            .select() // then select that newly inserted row, and get it as data
        
        // Throw error when inserting data into supabase db
        if (insertError) throw insertError 

        if (!data) throw new Error ('No data returned from insert')

        // .select() was useful becasue we don't need to refetch the new task from the db
        // and can instead update UI instantly
        // We do data[0] because the data array only holds the 1 new task
        setTasks(prev => [...prev, data[0]])
        setNewTaskTitle("")
        setActiveColumn(null)

        }
        catch (error) {
            console.error('Error creating task:', error)
        }
  }

  // Handle drag and drop
  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination } = result

    // If dropped outside a column, do nothing
    if (!destination){
        return
    }
    const newStatus = destination.droppableId  // the column it was dropped into

    // Update local state immediately so UI feels instant
    setTasks(prev =>
      prev.map(task =>
        task.id === draggableId ? { ...task, status: newStatus } : task
      )
    )
    // Then sync the change to Supabase in the background
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', draggableId)
      if (error){
        throw error
      }
    } catch (err) {
      console.error('Error updating task status:', err)
    }
  }

  if (loading){
    return <p>Loading board...</p>
  }

  return (
    // DragDropContext wraps the whole board and receives the onDragEnd callback
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', gap: '16px' }}>

        {COLUMNS.map(col => (
          <Column
            key={col.id}
            columnId={col.id}
            title={col.label}
            // Filter tasks down to only the ones belonging to this column
            tasks={tasks.filter(t => t.status === col.id)}
            onAddTask={(status) => setActiveColumn(status)}
          />
        ))}

      </div>

      {/* Create task form, appears when a column's + button is clicked */}
      {activeColumn && (
        <div>
          <input
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            placeholder="Task title..."
          />
          <button onClick={() => handleAddTask(activeColumn)}>Create</button>
          <button onClick={() => setActiveColumn(null)}>Cancel</button>
        </div>
      )}
    </DragDropContext>
  )
}

export default Board