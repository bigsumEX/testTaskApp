export type Task = {
  id: string
  title: string
  done: boolean
  createdAt: number
}

/**
 * タスクを 1 件生成する。
 * id と createdAt は呼び出し側から渡す（純粋関数に保ち、テストを決定的にするため）。
 */
export function createTask(title: string, id: string, createdAt: number): Task {
  const trimmed = title.trim()
  if (trimmed === '') {
    throw new Error('タスク名を入力してください')
  }
  return { id, title: trimmed, done: false, createdAt }
}

/** 末尾に追加した新しい配列を返す。 */
export function addTask(tasks: Task[], task: Task): Task[] {
  return [...tasks, task]
}

/** 該当タスクの done を反転した新しい配列を返す。該当なしなら内容は変わらない。 */
export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
}

/** 該当タスクを取り除いた新しい配列を返す。 */
export function removeTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((task) => task.id !== id)
}

/** 未完了のタスク数。 */
export function countRemaining(tasks: Task[]): number {
  return tasks.reduce((count, task) => (task.done ? count : count + 1), 0)
}
