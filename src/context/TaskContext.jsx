import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';

const TodoContext = createContext();

const getAPIUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // If we have an ENV URL and it's NOT localhost, use it
  if (envUrl && !envUrl.includes('localhost')) return envUrl;
  
  // If we are on localhost, use the local backend
  if (isLocalhost) return 'http://localhost:5000/api/todos';
  
  // Default to production Render backend
  return 'https://todo-backend-3zzn.onrender.com/api/todos';
};

const API_URL = getAPIUrl();
console.log('Task API Initialized with URL:', API_URL);

// Helper to get or create a guest token
const getGuestToken = () => {
  let token = localStorage.getItem('todo_guest_token');
  if (!token) {
    // Fallback for older browsers without crypto.randomUUID
    token = (typeof crypto !== 'undefined' && crypto.randomUUID) 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('todo_guest_token', token);
  }
  return token;
};

const guestToken = getGuestToken();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [processingIds, setProcessingIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const startProcessing = (id) => setProcessingIds(prev => new Set(prev).add(id));
  const stopProcessing = (id) => setProcessingIds(prev => {
    const next = new Set(prev);
    next.delete(id);
    return next;
  });

  // Fetch all todos
  const fetchTodos = useCallback(async () => {
    setIsFetching(true);
    try {
      const response = await fetch(API_URL, {
        headers: { 'x-guest-token': guestToken }
      });
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = useCallback(async (todoData) => {
    setIsAdding(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-guest-token': guestToken
        },
        body: JSON.stringify(todoData)
      });
      const newTodo = await response.json();
      setTodos(prev => [newTodo, ...prev]);
      toast.success('To-Do added successfully!');
      return newTodo;
    } catch (err) {
      console.error('Error adding todo:', err);
      toast.error('Failed to add To-Do');
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, []);

  const updateTodo = useCallback(async (id, updates) => {
    startProcessing(id);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-guest-token': guestToken
        },
        body: JSON.stringify(updates)
      });
      const updatedTodo = await response.json();
      setTodos(prev => prev.map(t => t._id === id ? updatedTodo : t));
      toast.success('To-Do updated successfully!');
      return updatedTodo;
    } catch (err) {
      console.error('Error updating todo:', err);
      toast.error('Failed to update To-Do');
      throw err;
    } finally {
      stopProcessing(id);
    }
  }, []);

  const deleteTodo = useCallback(async (id) => {
    startProcessing(id);
    try {
      await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE',
        headers: { 'x-guest-token': guestToken }
      });
      setTodos(prev => prev.filter(t => t._id !== id));
      toast.success('To-Do deleted successfully!');
    } catch (err) {
      console.error('Error deleting todo:', err);
      toast.error('Failed to delete To-Do');
      throw err;
    } finally {
      stopProcessing(id);
    }
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = filterStatus === 'all' || t.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [todos, searchQuery, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: todos.length,
      pending: todos.filter(t => t.status === 'pending').length,
      inProgress: todos.filter(t => t.status === 'in-progress').length,
      completed: todos.filter(t => t.status === 'completed').length,
    };
  }, [todos]);

  const latestTodos = useMemo(() => {
    return [...todos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  }, [todos]);

  return (
    <TodoContext.Provider value={{
      todos,
      filteredTodos,
      isFetching,
      isAdding,
      processingIds,
      searchQuery,
      setSearchQuery,
      filterStatus,
      setFilterStatus,
      addTodo,
      updateTodo,
      deleteTodo,
      stats,
      latestTodos,
      fetchTodos
    }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}
