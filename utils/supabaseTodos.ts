import { supabase } from '../app/supabaseClient';

export const fetchTodos = async (userId: string) => {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const addTodo = async (
  userId: string,
  text: string,
  startTime: string,
  endTime: string,
  dueAt: string | null // ovo sad prima gotov ISO string
) => {
  const { error } = await supabase.from('todos').insert({
    user_id: userId,
    text,
    start_time: startTime,
    end_time: endTime,
    due_at: dueAt, // ✅ već u ISO formatu
  });

  if (error) throw error;
};

export const deleteTodo = async (id: string) => {
  const { error } = await supabase.from('todos').delete().eq('id', id);
  if (error) throw error;
};

export const toggleComplete = async (id: string, completed: boolean) => {
  const { error } = await supabase.from('todos').update({ completed }).eq('id', id);
  if (error) throw error;
};
