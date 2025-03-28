import { supabase } from '../app/supabaseClient'

export const fetchTodos = async (userId: string) => {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const addTodo = async (
    userId: string,
    text: string,
    start_time: string,
    end_time: string
  ) => {
    console.log('USER ID:', userId);
    console.log('TEXT:', text);
  
    const { data, error } = await supabase.from('todos').insert([
      {
        user_id: userId,
        text,
        completed: false,
        start_time,
        end_time,
      },
    ]);
  
    if (error) {
      console.error('INSERT ERROR:', error);
      throw error;
    }
  
    return data;
  };  

export const toggleComplete = async (id: string, value: boolean) => {
  const { data, error } = await supabase
    .from('todos')
    .update({ completed: value })
    .eq('id', id)

  if (error) throw error
  return data
}

export const deleteTodo = async (id: string) => {
  const { error } = await supabase.from('todos').delete().eq('id', id)
  if (error) throw error
}
