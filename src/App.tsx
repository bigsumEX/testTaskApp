import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTasks } from './useTasks'

export default function App() {
  const { tasks, remaining, add, toggle, remove } = useTasks()
  const [title, setTitle] = useState('')

  const canSubmit = title.trim() !== ''

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    add(title)
    setTitle('')
  }

  return (
    <main className="app">
      <h1>タスク管理</h1>

      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          value={title}
          placeholder="やることを入力"
          aria-label="やること"
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit" disabled={!canSubmit}>
          追加
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="empty">タスクはまだありません。</p>
      ) : (
        <ul className="list">
          {tasks.map((task) => (
            <li key={task.id} className="item">
              <label className={task.done ? 'label done' : 'label'}>
                <input type="checkbox" checked={task.done} onChange={() => toggle(task.id)} />
                <span>{task.title}</span>
              </label>
              <button type="button" aria-label={`${task.title} を削除`} onClick={() => remove(task.id)}>
                削除
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="count">
        残り {remaining} 件 / 全 {tasks.length} 件
      </p>
    </main>
  )
}
