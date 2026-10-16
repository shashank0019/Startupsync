import React, { useEffect, useState } from 'react';
import { 
  Filter, 
  Trash2, 
  Edit2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Plus,
  Search,
  LayoutGrid,
  List,
  Calendar,
  MoreHorizontal,
  Paperclip,
  MessageSquare,
  X,
  TrendingUp
} from 'lucide-react';
import { taskService, TaskItem } from '../api/taskService';

type UiStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'completed';
type ViewType = 'kanban' | 'list' | 'calendar' | 'timeline';

const mapBackendStatus = (status: string): UiStatus => {
  const s = status?.toUpperCase();
  if (s === 'BACKLOG') return 'backlog';
  if (s === 'IN_PROGRESS' || s === 'IN-PROGRESS') return 'in-progress';
  if (s === 'REVIEW' || s === 'IN_REVIEW') return 'review';
  if (s === 'COMPLETED' || s === 'DONE') return 'completed';
  return 'todo';
};

const mapUiToBackend = (status: UiStatus): string => {
  const map: Record<UiStatus, string> = {
    backlog: 'BACKLOG',
    todo: 'TODO',
    'in-progress': 'IN_PROGRESS',
    review: 'REVIEW',
    completed: 'COMPLETED',
  };
  return map[status];
};

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'assigned' | 'high-priority' | 'overdue'>('all');
  const [view, setView] = useState<ViewType>('kanban');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await taskService.getMyTasks();
        setTasks(data);
      } catch (err) {
        console.error('Failed to load tasks:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: UiStatus) => {
    try {
      await taskService.updateStatus(taskId, mapUiToBackend(newStatus));
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: mapUiToBackend(newStatus) } : t))
      );
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'high-priority') return t.priority?.toUpperCase() === 'HIGH';
    if (filter === 'overdue') return t.dueDate && new Date(t.dueDate) < new Date();
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(query) || t.description?.toLowerCase().includes(query);
    }
    return true;
  });

  const getStatusColor = (status: UiStatus) => {
    switch (status) {
      case 'backlog': return 'bg-slate-100 text-slate-700 border border-slate-200';
      case 'todo': return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'in-progress': return 'bg-indigo-50 text-indigo-700 border border-indigo-100';
      case 'review': return 'bg-purple-50 text-purple-700 border border-purple-100';
      case 'completed': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    const p = priority?.toUpperCase();
    if (p === 'HIGH') return 'bg-rose-50 text-rose-700 border-rose-200';
    if (p === 'MEDIUM') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length,
    productivity: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'COMPLETED').length / tasks.length) * 100) : 0
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin h-10 w-10 border-b-2 border-brand-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tasks Board</h1>
          <p className="text-slate-500 mt-1">Manage your startup's project tasks</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition flex items-center gap-2">
            <Plus size={18} />
            Create Sprint
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition flex items-center gap-2"
          >
            <Plus size={18} />
            Create Task
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Tasks</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
            </div>
            <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <LayoutGrid className="h-5 w-5 text-slate-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
            </div>
            <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">In Progress</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.inProgress}</p>
            </div>
            <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Overdue</p>
              <p className="text-2xl font-bold text-rose-600 mt-1">{stats.overdue}</p>
            </div>
            <div className="h-10 w-10 bg-rose-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-rose-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Productivity</p>
              <p className="text-2xl font-bold text-brand-600 mt-1">{stats.productivity}%</p>
            </div>
            <div className="h-10 w-10 bg-brand-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-brand-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between shadow-sm">
        <div className="flex gap-2">
          {(['all', 'assigned', 'high-priority', 'overdue'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {f === 'all' ? 'All Tasks' : f === 'assigned' ? 'Assigned to Me' : f === 'high-priority' ? 'High Priority' : 'Overdue'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            <Filter size={18} className="text-slate-600" />
          </button>
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            {(['kanban', 'list', 'calendar', 'timeline'] as ViewType[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-2 transition-all ${
                  view === v ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {v === 'kanban' && <LayoutGrid size={18} />}
                {v === 'list' && <List size={18} />}
                {v === 'calendar' && <Calendar size={18} />}
                {v === 'timeline' && <Clock size={18} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {(['backlog', 'todo', 'in-progress', 'review', 'completed'] as const).map((status) => (
            <div key={status} className="bg-slate-50 rounded-xl p-4 min-h-[500px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-800 capitalize flex items-center gap-2">
                  {status === 'backlog' && <AlertCircle size={16} className="text-slate-400" />}
                  {status === 'todo' && <CheckCircle size={16} className="text-blue-500" />}
                  {status === 'in-progress' && <Clock size={16} className="text-indigo-500" />}
                  {status === 'review' && <AlertCircle size={16} className="text-purple-500" />}
                  {status === 'completed' && <CheckCircle size={16} className="text-emerald-500" />}
                  {status.replace('-', ' ')}
                </h2>
                <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
                  {filteredTasks.filter((t) => mapBackendStatus(t.status) === status).length}
                </span>
              </div>

              <div className="space-y-3">
                {filteredTasks
                  .filter((t) => mapBackendStatus(t.status) === status)
                  .map((task) => (
                    <div 
                      key={task.id} 
                      onClick={() => setSelectedTask(task)}
                      className="group bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-slate-900 text-sm leading-tight">{task.title}</h3>
                        <button className="p-1 text-slate-400 hover:text-slate-600 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${getPriorityColor(task.priority || 'MEDIUM')}`}>
                          {task.priority || 'MEDIUM'}
                        </span>
                        {task.dueDate && (
                          <span className={`text-xs flex items-center gap-1 ${
                            new Date(task.dueDate) < new Date() ? 'text-rose-600' : 'text-slate-500'
                          }`}>
                            <Clock size={12} /> {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
                        <div
                          className="bg-brand-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${task.completionPercentage || 0}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          {task.assignedTo && (
                            <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold">
                              {task.assignedTo.firstName?.charAt(0)}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <MessageSquare size={12} />
                            <span>0</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Paperclip size={12} />
                            <span>0</span>
                          </div>
                        </div>
                        {status !== 'completed' && (
                          <select
                            value={status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value as UiStatus)}
                            className="text-xs border border-slate-200 rounded px-2 py-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="backlog">Backlog</option>
                            <option value="todo">Todo</option>
                            <option value="in-progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="completed">Completed</option>
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Task</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Priority</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Assignee</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Due Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Progress</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{task.title}</div>
                    <div className="text-xs text-slate-500 truncate max-w-xs">{task.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(mapBackendStatus(task.status))}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority || 'MEDIUM')}`}>
                      {task.priority || 'MEDIUM'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {task.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                          {task.assignedTo.firstName?.charAt(0)}
                        </div>
                        <span className="text-sm text-slate-700">{task.assignedTo.firstName}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {task.dueDate ? (
                      <span className={`text-sm ${new Date(task.dueDate) < new Date() ? 'text-rose-600' : 'text-slate-700'}`}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">No due date</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 rounded-full h-2">
                        <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${task.completionPercentage || 0}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{task.completionPercentage || 0}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-1 text-slate-400 hover:text-brand-600 rounded hover:bg-brand-50">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => taskService.deleteTask(task.id).then(() => setTasks(p => p.filter(t => t.id !== task.id)))}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Calendar View Placeholder */}
      {view === 'calendar' && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Calendar className="mx-auto h-16 w-16 text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">Calendar View</h3>
          <p className="text-slate-500 mt-2">View your tasks by due date</p>
        </div>
      )}

      {/* Timeline View Placeholder */}
      {view === 'timeline' && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Clock className="mx-auto h-16 w-16 text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">Timeline View</h3>
          <p className="text-slate-500 mt-2">View your tasks in a timeline format</p>
        </div>
      )}

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Create New Task</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
                <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Enter task title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" placeholder="Enter task description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                  <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
                  <input type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Assignee</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option value="">Select assignee</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Enter tags separated by commas" />
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition">
                Cancel
              </button>
              <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition">
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Drawer */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-slate-900">{selectedTask.title}</h2>
              <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Description</h3>
                <p className="text-slate-700">{selectedTask.description || 'No description provided'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Status</h3>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(mapBackendStatus(selectedTask.status))}`}>
                    {selectedTask.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Priority</h3>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getPriorityColor(selectedTask.priority || 'MEDIUM')}`}>
                    {selectedTask.priority || 'MEDIUM'}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Progress</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${selectedTask.completionPercentage || 0}%` }} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{selectedTask.completionPercentage || 0}%</span>
                </div>
              </div>
              {selectedTask.dueDate && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Due Date</h3>
                  <p className="text-slate-700">{new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                </div>
              )}
              {selectedTask.assignedTo && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Assignee</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                      {selectedTask.assignedTo.firstName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{selectedTask.assignedTo.firstName} {selectedTask.assignedTo.lastName}</p>
                      <p className="text-sm text-slate-500">{selectedTask.assignedTo.email}</p>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-brand-500 mt-2" />
                    <div>
                      <p className="text-slate-700">Task created</p>
                      <p className="text-slate-500 text-xs">{new Date(selectedTask.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;

