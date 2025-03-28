'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './supabaseClient'
import './page.css'

type Todo = {
  id: number
  text: string
  completed: boolean
  startTime: string
  endTime: string
}

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  // 🔐 Provera da li je korisnik ulogovan
  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (!data?.user) {
        router.push('/auth')
      } else {
        setUser(data.user)
      }
    }
    checkUser()
  }, [])

  // ⏳ Učitaj todos iz localStorage
  useEffect(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      setTodos(JSON.parse(saved))
    }
  }, [])

  // 💾 Snimi todos
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (!input.trim()) return
    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      startTime,
      endTime,
    }
    setTodos([newTodo, ...todos])
    setInput('')
    setStartTime('')
    setEndTime('')
  }

  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  if (!user) return null // ne prikazuj ništa dok se proverava user

  return (
    <main className={`todo-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="todo-card">
        <div className="top-controls">
          <button onClick={toggleDarkMode} className="toggle-theme-btn">
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/auth')
            }}
            className="logout-btn"
          >
            Logout
          </button>
        </div>

        <h1 className="todo-title">📝 Moja To-Do Lista</h1>

        <div className="todo-input-wrapper">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTodo()
            }}
            placeholder="Unesi novi zadatak..."
            className="todo-input"
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="todo-time"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="todo-time"
          />
          <button onClick={addTodo} className="todo-btn">
            Dodaj
          </button>
        </div>

        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'done' : ''}`}>
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                />
                <span className="checkmark"></span>
              </label>
              <div>
                <span className="todo-text">{todo.text}</span><br />
                <span className="todo-time-range">
                  {todo.startTime} - {todo.endTime}
                </span>
              </div>
              <button onClick={() => deleteTodo(todo.id)} className="delete-btn">✖</button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
