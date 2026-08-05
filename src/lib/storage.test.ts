import { describe, expect, it } from 'vitest'
import { STORAGE_KEY, loadTasks, saveTasks } from './storage'
import type { StorageLike } from './storage'
import type { Task } from './tasks'

/** localStorage の代わりに使うインメモリ実装（jsdom なしでテストするため）。 */
function memoryStorage(initial: Record<string, string> = {}): StorageLike {
  const store = new Map(Object.entries(initial))
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value)
    },
  }
}

const task = (id: string): Task => ({ id, title: `task ${id}`, done: false, createdAt: 1 })

describe('loadTasks', () => {
  it('保存されていなければ空配列を返す', () => {
    expect(loadTasks(memoryStorage())).toEqual([])
  })

  it('壊れた JSON なら空配列を返す', () => {
    expect(loadTasks(memoryStorage({ [STORAGE_KEY]: '{ broken' }))).toEqual([])
  })

  it('配列でない JSON なら空配列を返す', () => {
    expect(loadTasks(memoryStorage({ [STORAGE_KEY]: '{"id":"a"}' }))).toEqual([])
  })

  it('形式が不正な要素は取り除く', () => {
    const raw = JSON.stringify([
      task('a'),
      { id: 'b' },
      { id: 'c', title: 'c', done: 'yes', createdAt: 1 },
      null,
      task('d'),
    ])
    expect(loadTasks(memoryStorage({ [STORAGE_KEY]: raw })).map((t) => t.id)).toEqual(['a', 'd'])
  })
})

describe('saveTasks', () => {
  it('保存したタスクをそのまま読み戻せる', () => {
    const storage = memoryStorage()
    const tasks = [task('a'), { ...task('b'), done: true }]
    saveTasks(storage, tasks)
    expect(loadTasks(storage)).toEqual(tasks)
  })

  it('空配列を保存すると空配列が読み戻る', () => {
    const storage = memoryStorage()
    saveTasks(storage, [task('a')])
    saveTasks(storage, [])
    expect(loadTasks(storage)).toEqual([])
  })
})
