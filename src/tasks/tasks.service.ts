import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/tasks-filter.dto';
import * as uuid from "uuid";

@Injectable()
export class TasksService { 
  private tasks: Task[] = []
  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilter(filterDto: GetTaskFilterDto) {
    const tasks = this.getAllTasks()
    const statusResult = filterDto.status ? tasks.filter(
      task => filterDto.status === task.status
    ) : tasks;
    

    const searchResult = filterDto.search ? statusResult.filter(
      task => {
        return task.title.includes(filterDto.search) || task.description.includes(filterDto.search)
      }
    ) : statusResult;
    return searchResult;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const {title, description} = createTaskDto;
    const task: Task = {
      id: uuid.v1(),
      title,
      description,
      status: TaskStatus.OPEN
    };
    this.tasks.push(task)
    return task;
  }

  getTaskById(id:string): Task {
    const result = this.tasks.find(task => task.id === id)
    if(!result) {
      throw new NotFoundException()
    }
    console.log("result of task by id =>", result)
    return result;
  }

  deleteTaskById(id: string) {
    this.tasks = this.tasks.filter(task => task.id !== id)
    return true;
  }
}
