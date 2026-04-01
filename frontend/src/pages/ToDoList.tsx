//  import React from 'react';
//  import { useState } from 'react';
import InputTask from '../components/InputTask';
 
 export default function ToDoList() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">To-Do List Page</h1><hr/>
      < InputTask />
    </div>
  );
}