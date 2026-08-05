import type { Task } from './tasks'

/**
 * localStorage のうち実際に使う部分だけを型にしたもの。
 * window に依存しないので、テストではインメモリ実装を渡せる。
 */
export type StorageLike = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export const STORAGE_KEY = 'testTaskApp.tasks'

export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.done === 'boolean' &&
    typeof task.createdAt === 'number'
  )
}

/**
 * 保存済みのタスクを読み出す。
 * 未保存・壊れた JSON・配列でない値は空配列として扱い、
 * 配列の中の不正な要素は取り除く（古い形式のデータで画面が壊れないようにするため）。
 */
export function loadTasks(storage: StorageLike): Task[] {
  const raw = storage.getItem(STORAGE_KEY)
  if (raw === null) return []

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return []
  }

  if (!Array.isArray(parsed)) return []
  return parsed.filter(isTask)
}

export function saveTasks(storage: StorageLike, tasks: Task[]): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}
