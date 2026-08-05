import { useCallback, useEffect, useMemo, useState } from 'react'
import { addTask, countRemaining, createTask, removeTask, toggleTask } from './lib/tasks'
import type { Task } from './lib/tasks'
import { loadTasks, saveTasks } from './lib/storage'

/**
 * lib のロジックと React の state をつなぐ層。
 * 副作用（localStorage / ID 生成 / 現在時刻）はここに閉じ込め、lib は純粋なまま保つ。
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks(window.localStorage))

  useEffect(() => {
    saveTasks(window.localStorage, tasks)
  }, [tasks])

  const add = useCallback((title: string) => {
    const task = createTask(title, crypto.randomUUID(), Date.now())
    setTasks((current) => addTask(current, task))
  }, [])

  const toggle = useCallback((id: string) => {
    setTasks((current) => toggleTask(current, id))
  }, [])

  const remove = useCallback((id: string) => {
    setTasks((current) => removeTask(current, id))
  }, [])

  const remaining = useMemo(() => countRemaining(tasks), [tasks])

  return { tasks, remaining, add, toggle, remove }
}
