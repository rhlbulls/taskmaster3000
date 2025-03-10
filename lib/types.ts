export interface SubTask {
  id: string
  title: string
  completed: boolean
  timeSpent: number
  position: number
}

export interface Task {
  id: string
  title: string
  date: string
  completed: boolean
  timeSpent: number
  subTasks?: SubTask[]
  description?: string
  links?: string[]
  position: number
}

