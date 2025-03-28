'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import LanguageSwitcher from '../components/LanguageSwitcher';
import translations from '@/utils/translations';
import { useLanguage } from '@/context/LanguageContext';


import {
  fetchTodos,
  addTodo as addTodoToDB,
  deleteTodo as deleteTodoFromDB,
  toggleComplete as toggleTodoComplete
} from '@/utils/supabaseTodos';
import '../page.css';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  start_time: string;
  end_time: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [userGender, setUserGender] = useState<'male' | 'female' | 'unknown'>('unknown');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push('/auth');
      } else {
        setUser(data.user);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadTodos();
      loadUserData();
    }
  }, [user]);

  const loadTodos = async () => {
    try {
      const data = await fetchTodos(user.id);
      setTodos(data);
    } catch (err) {
      console.error('Greška pri učitavanju taskova:', err);
    }
  };

  const loadUserData = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('name, gender')
      .eq('id', user.id)
      .single();

    if (!data) {
      const res = await fetch(`https://api.genderize.io?name=${user.user_metadata?.name || 'unknown'}`);
      const gdata = await res.json();
      const gender = gdata?.gender === 'male' || gdata?.gender === 'female' ? gdata.gender : 'unknown';

      await supabase.from('profiles').insert({
        id: user.id,
        name: user.user_metadata?.name || 'Nepoznat',
        gender
      });

      setUserName(user.user_metadata?.name || 'Nepoznat');
      setUserGender(gender);
    } else {
      setUserName(data.name);
      setUserGender(data.gender || 'unknown');
    }
  };

  const getGreeting = (name: string, gender: string) => {
    if (gender === 'female') return `${t.welcome_back_f} ${name}!`;
    if (gender === 'male') return `${t.welcome_back_m} ${name}!`;
    return `${t.welcome_back} ${name}!`;
  };

  const addTodo = async () => {
    if (!input.trim()) return;
    try {
      await addTodoToDB(user.id, input.trim(), startTime, endTime);
      toast.success(t.task_added);
      setInput('');
      setStartTime('');
      setEndTime('');
      await loadTodos();
    } catch (err) {
      console.error('Greška pri dodavanju taska:', err);
      toast.error('Greška pri dodavanju zadatka ❌');
    }
  };

  const toggleComplete = async (id: string, current: boolean) => {
    try {
      await toggleTodoComplete(id, !current);
      toast.success(current ? t.task_undone : t.task_done);
      await loadTodos();
    } catch (err) {
      console.error('Greška pri štikliranju taska:', err);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteTodoFromDB(id);
      setTodos(todos.filter(todo => todo.id !== id));
      toast.success(t.task_deleted);
    } catch (err) {
      console.error('Greška pri brisanju taska:', err);
      toast.error('Greška pri brisanju zadatka ❌');
    }
  };

  const updateTodoText = async (id: string, newText: string) => {
    try {
      await supabase.from('todos').update({ text: newText }).eq('id', id);
      toast.success(t.task_updated);
      setEditingId(null);
      await loadTodos();
    } catch (err) {
      console.error('Greška pri editovanju taska:', err);
    }
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  if (!user) return null;

  return (
    <main className={`todo-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      <LanguageSwitcher />
      <div className="todo-card bg-white text-black dark:bg-gray-800 dark:text-white backdrop-blur-md shadow-xl rounded-xl p-8 transition-colors duration-300">
        <div className="top-controls">
          <button onClick={toggleDarkMode} className="toggle-theme-btn">
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <h1 className="todo-title">
          {userName ? getGreeting(userName, userGender) : t.todo_title}
        </h1>

        <div className="todo-input-wrapper">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            placeholder={t.enter_task}
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
          <button onClick={addTodo} className="todo-btn">{t.add}</button>
        </div>

        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'done' : ''}`}>
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id, todo.completed)}
                />
                <span className="checkmark"></span>
              </label>
              <div className="flex-1">
                {editingId === todo.id ? (
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') updateTodoText(todo.id, editingText);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    autoFocus
                    className="px-2 py-1 rounded border border-gray-300 text-sm w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <>
                    <span className="todo-text">{todo.text}</span><br />
                    <span className="todo-time-range">{todo.start_time} - {todo.end_time}</span>
                  </>
                )}
              </div>
              <div className="flex gap-2 items-center ml-2">
                <button
                  onClick={() => {
                    setEditingId(todo.id);
                    setEditingText(todo.text);
                  }}
                  className="text-blue-500 text-sm"
                >
                  ✏️
                </button>
                <button onClick={() => deleteTodo(todo.id)} className="delete-btn">✖</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full text-center mt-6">
        <p
          className="logout-link"
          onClick={async () => {
            await supabase.auth.signOut();
            router.push('/auth');
          }}
        >
          🚪 {t.logout}
        </p>
      </div>
    </main>
  );
}
