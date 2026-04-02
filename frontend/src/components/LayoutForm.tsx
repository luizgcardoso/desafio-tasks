import TaskForm from './TaskForm';
import UserForm from './UserForm';
import Login from '../pages/Login';

export default function LayoutForm( props: { type: 'Task' | 'User'| 'Login' }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Create New {props.type}</h1>
      {props.type === 'Task' ? <TaskForm /> : props.type === 'User' ? <UserForm /> : <Login />}
    </div>
  );
}