import { describe, expect, it } from 'vitest'
import { addTask, countRemaining, createTask, removeTask, toggleTask } from './tasks'
import type { Task } from './tasks'

const task = (id: string, done = false): Task => ({
  id,
  title: `task ${id}`,
  done,
  createdAt: 0,
})

describe('createTask', () => {
  it('未完了のタスクを生成する', () => {
    expect(createTask('買い物', 'id-1', 1000)).toEqual({
      id: 'id-1',
      title: '買い物',
      done: false,
      createdAt: 1000,
    })
  })

  it('前後の空白を取り除く', () => {
    expect(createTask('  買い物  ', 'id-1', 0).title).toBe('買い物')
  })

  it('空文字や空白だけの場合は例外を投げる', () => {
    expect(() => createTask('', 'id-1', 0)).toThrow()
    expect(() => createTask('   ', 'id-1', 0)).toThrow()
  })
})

describe('addTask', () => {
  it('末尾に追加する', () => {
    const tasks = [task('a')]
    expect(addTask(tasks, task('b')).map((t) => t.id)).toEqual(['a', 'b'])
  })

  it('元の配列を変更しない', () => {
    const tasks = [task('a')]
    addTask(tasks, task('b'))
    expect(tasks).toHaveLength(1)
  })
})

describe('toggleTask', () => {
  it('対象のタスクだけ done を反転する', () => {
    const tasks = [task('a'), task('b', true)]
    const toggled = toggleTask(tasks, 'a')
    expect(toggled[0]?.done).toBe(true)
    expect(toggled[1]?.done).toBe(true)
  })

  it('完了済みを未完了に戻せる', () => {
    expect(toggleTask([task('a', true)], 'a')[0]?.done).toBe(false)
  })

  it('存在しない id では内容が変わらない', () => {
    const tasks = [task('a'), task('b', true)]
    expect(toggleTask(tasks, 'zzz')).toEqual(tasks)
  })

  it('元の配列を変更しない', () => {
    const tasks = [task('a')]
    toggleTask(tasks, 'a')
    expect(tasks[0]?.done).toBe(false)
  })
})

describe('removeTask', () => {
  it('対象のタスクを取り除く', () => {
    const tasks = [task('a'), task('b'), task('c')]
    expect(removeTask(tasks, 'b').map((t) => t.id)).toEqual(['a', 'c'])
  })

  it('存在しない id では内容が変わらない', () => {
    const tasks = [task('a')]
    expect(removeTask(tasks, 'zzz')).toEqual(tasks)
  })

  it('元の配列を変更しない', () => {
    const tasks = [task('a')]
    removeTask(tasks, 'a')
    expect(tasks).toHaveLength(1)
  })
})

describe('countRemaining', () => {
  it('未完了の件数を数える', () => {
    expect(countRemaining([task('a'), task('b', true), task('c')])).toBe(2)
  })

  it('空配列は 0', () => {
    expect(countRemaining([])).toBe(0)
  })

  it('すべて完了なら 0', () => {
    expect(countRemaining([task('a', true)])).toBe(0)
  })
})
