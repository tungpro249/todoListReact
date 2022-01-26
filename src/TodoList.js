import React from "react"
import Control from "./componentTodoList/Control"
import FormAdd from "./componentTodoList/FormAdd"
import List from "./componentTodoList/List"

export default class TodoList extends React.Component{
  constructor(props){
    super(props)
    this.state ={
      tasks: [], //id: unique, name, status
      isDisplayForm: false,
      taskEditting: null,
      filter: {
        name: '',
        status: -1
      },
      keyword: '',
      sortBy: 'name',
      sortValue: 1
    }
  }

  componentWillMount(){
    if(localStorage && localStorage.getItem('tasks')){
      var tasks = JSON.parse(localStorage.getItem('tasks'))
      this.setState({
        tasks: tasks
      })
    }
  }

  // tạo ID random
  s4(){
    return Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
  }

  generateID(){
    return this.s4() + this.s4() + '-'+ this.s4() + '-'+ this.s4() +  '-'+ this.s4() + 
    '-'+ this.s4() +  '-'+ this.s4() +  '-'+ this.s4() +  '-'+ this.s4() +  '-'+ this.s4() + 
    '-'+ this.s4() ;
  }

  onToggleForm = () =>{
    if(this.state.isDisplayForm && this.state.taskEditting !== null){
      this.setState({
        isDisplayForm: true,
        taskEditting: null
      })
    }else
    this.setState({
      isDisplayForm: !this.state.isDisplayForm,
      taskEditting: null
    })
  }

  onCloseForm =()=>{
    this.setState({
      isDisplayForm: false
    })
  }
  onShowForm =()=>{
    this.setState({
      isDisplayForm: true
    })
  }

  onSubmit = (data)=>{
    var { tasks } = this.state
    if(data.id === ''){
      data.id = this.generateID();
      tasks.push(data)
    }else{
      var index = this.findIdex(data.id);
      tasks[index] = data;
    }
    
    this.setState({
      tasks: tasks,
      taskEditting: null
    });
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }

  onUpdateStatus = (id)=>{
    var { tasks } = this.state
    var index = this.findIdex(id);
    if(index !== -1){
      tasks[index].status = !tasks[index].status;
      this.setState({
        tasks: tasks
      })
      localStorage.setItem('tasks',JSON.stringify(tasks))
    }
  }

  onDelete = (id)=>{
    var { tasks } = this.state
    var index = this.findIdex(id);
    if(index !== -1){
      tasks.splice(index, 1);
      this.setState({
        tasks: tasks
      })
      localStorage.setItem('tasks',JSON.stringify(tasks))
    }
    this.onCloseForm()
  }
  
  onUpdate = (id)=>{
    var { tasks } = this.state
    var index = this.findIdex(id);
    var taskEditting = tasks[index];
    this.setState({
      taskEditting: taskEditting
    })
    this.onShowForm()
  }

  findIdex = (id) =>{
    var { tasks } = this.state;
    var result = -1;
    tasks.forEach((task,index) =>{
      if(task.id === id){
        result = index;
      }
    })
    return result;
  }

  onFilter = (filterName,filterStatus)=>{
    filterStatus = parseInt(filterStatus,10)
    this.setState({
      filter:{
        name: filterName.toLowerCase(),
        status: filterStatus
      }
    })
  }

  onSearch = (keyword)=>{
    this.setState({
      keyword: keyword
    })
  }

  onSort = (sortBy, sortValue)=>{
    this.setState({
      sortBy: sortBy,
      sortValue: sortValue
    })
  }


  render(){
    var { tasks, isDisplayForm, taskEditting, filter, keyword,sortBy, sortValue } = this.state //var tasks = this.state.tasks
    if(filter){
      if(filter.name){
        tasks = tasks.filter((task) =>{
          return task.name.toLowerCase().indexOf(filter.name) !== -1;
        });
      }
      tasks = tasks.filter((task) =>{
        if(filter.status === -1){
          return task;
        }else{
          return task.status === (filter.status === 1 ? false: true)
        }
      })
    }
    if(keyword){
      tasks = tasks.filter((task) =>{
        return task.name.toLowerCase().indexOf(keyword) !== -1;
      });
    }

    if(sortBy ==="name"){
      tasks.sort((a,b) =>{
        if(a.name > b.name) return sortValue;
        else if(a.name < b.name) return -sortValue;
        else return 0;
      })
    }else{
      tasks.sort((a,b) =>{
        if(a.status > b.status) return sortValue;
        else if(a.status < b.status) return -sortValue;
        else return 0;
      })
    }

    var elmFormAdd = isDisplayForm ? 
    <FormAdd  
    onCloseForm = {this.onCloseForm} 
    onSubmit = {this.onSubmit} 
    task ={ taskEditting } /> : '';
    return(
      <div className="container">
        <div className="text-center">
            <h1>Quản Lý Công Việc</h1>
            <hr/>
        </div>
        <div className="row">
          <div className={ isDisplayForm ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4': '' } >
              { elmFormAdd }
          </div>
          <div className={ isDisplayForm? 'col-xs-8 col-sm-8 col-md-8 col-lg-8':
        'col-xs-12 col-sm-12 col-md-12 col-lg-12' }>
            <button 
            onClick = { this.onToggleForm }
            type="button" 
            className="btn btn-primary">
              <span className="fa fa-plus mr-5"></span>Thêm Công Việc
            </button>
            <Control onSearch = {this.onSearch} onSort= {this.onSort} 
            sortBy ={sortBy} sortValue ={sortValue} />
            <div className="row mt-15">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <List tasks = { tasks } 
                onUpdateStatus ={ this.onUpdateStatus } 
                onDelete = { this.onDelete }
                onUpdate = { this.onUpdate }
                onfilter = { this.onFilter}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}