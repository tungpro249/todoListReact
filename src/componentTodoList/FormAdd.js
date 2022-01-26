import React from"react"

export default class FormAdd extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      id: "",
      name: "",
      status: false
    }
  }

  componentWillMount(){
    if(this.props.task){
      this.setState({
        id: this.props.task.id,
        name: this.props.task.name,
        status: this.props.task.status
      })
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps && nextProps.task){
      this.setState({
        id: nextProps.task.id,
        name: nextProps.task.name,
        status: nextProps.task.status
      })
    }else if(nextProps && nextProps.task === null){
      this.setState({
        id: "",
        name: "",
        status: false
      })
    }
  }

  onChange = (e)=>{
    var target = e.target
    var name = target.name
    var value = target.value
    if(name === "status"){
      value = target.value === 'true' ? true : false;
    }
    this.setState({
      [name] : value
    })
  }

  onSubmit = (e)=>{
    e.preventDefault()
    this.props.onSubmit(this.state)
    this.onclear()
    this.onCloseForm()
  }

  onclear = ()=>{
    this.setState({
      name: '',
      status: false
    })
    this.onCloseForm()
  }

  onCloseForm = ()=>{
    this.props.onCloseForm();
  }

  render(){
    var { id } = this.state;
    return(
      <div className="panel panel-warning">
        <div className="panel-heading">
            <h3 className="panel-title"> 
              {id !== '' ? 'Cập nhật công việc': 'Thêm Công Việc'} 
            </h3>
            <span className ="fa fa-times-cirle text-right"></span>
        </div>
        <div className="panel-body">
          <form onSubmit = {this.onSubmit}>
            <div className="form-group">
              <label>Tên :</label>
              <input type="text" name ="name" className="form-control" value= {this.state.name} onChange ={ this.onChange } />
            </div>
            <label>Trạng Thái :</label>
           <select className="form-control" name ="status" value ={this.state.status} onChange ={ this.onChange } >
              <option value="true">Ẩn</option>
              <option value="false">Kích hoạt</option>
            </select>
            <br/>
            <div className="text-center">
              <button type="submit" className="btn btn-warning">Thêm</button>&nbsp;
              <button type="button" className="btn btn-danger" onClick = { this.onclear } >Hủy Bỏ</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}