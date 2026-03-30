// Define the shape of a Task object, doesn't contain any data yet,
// but will get filled in from Supabase
export interface Task {
  id: string
  title: string
  description?: string                  //? = optional
  priority?: 'low' | 'normal' | 'high'  //? = optional
  due_date?: string                     //? = optional
  status: string
}