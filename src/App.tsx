// tslint:disable:no-console
import * as React from 'react';
import './App.css';


interface IMyState {
  matrix:number[][],
  row:number,
  column:number,
  visited:boolean[][],
  region:object[],
  max:number,
}




class App extends React.Component<{},IMyState> {

  constructor(props:any){
    super(props);
    this.state = {
      column:4,
      matrix: Array(4).fill(0).map(row => new Array(4).fill(0)),
      max:0,
      region:[],
      row:4,
      visited:Array(4).fill(0).map(row => new Array(4).fill(false)),
    }
    console.log(this.state.visited);
   
  }

  public componentDidMount = () =>{

      this.generateCells();  
     // this.getRegionCount();
  }

  // random number generator 0 || 1
  public generateRandomNumber = (max:number,min:number) =>{
      return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  // cell generation
  public generateCells = () =>{

    const max = 1;
    const min = 0;
 
    const {matrix,column,row} = this.state;
    for(let i=0;i<row;i++){
      for(let j=0;j<column;j++){
        const rand = this.generateRandomNumber(max,min);
        matrix[i][j] = rand; 
      }
    }

    this.setState({
      matrix
    },()=>{
      this.startEngine();
    })
  }

  public handleChange = (i:number,index:number,event:any) =>{
    const {matrix,row,column} = this.state;
    const value = parseInt(event.target.value,undefined);
    matrix[i][index] = value;
    if(value <=1 && value >=0 && !isNaN(value) && event.target.type !== 'number'){
    this.setState({
      matrix,
      visited:Array(row).fill(0).map(innerrow => new Array(column).fill(false)),
    },()=>{
      this.startEngine();
    })
  }else{
    alert("Invalid input! Please enter either 0 or 1");
  }

  }

  // UI generation
  public renderColumnLayout = (items:number[],i:number) =>{
    // 
    // const itemLength = item.length;
    // const width = window.innerWidth;
    // const evenWidth = width / itemLength;
    const column = items.map((item,index)=>{
      
      return(
        <div key={index} style={{padding:10,border:"solid 1px black",textAlign:"center",background:item===1?"red":"white",color:item===1?"white":"black"}}>
        <select value={item} className="form-control" onChange={this.handleChange.bind(this,i,index)}>
          <option value={0}>0</option>
          <option value={1}>1</option>
        </select>
        </div>
      )
    });
    return column;

  }

  public renderRowLayout = () =>{
    const {matrix} = this.state;

    const mapped = matrix.map((item,index)=>{
        return(
          <div key={index} className="row justify-content-center" style={{paddingLeft:10,paddingRight:10}}>
              {this.renderColumnLayout(item,index)}
           </div> 
        )
      
    });

    return mapped;
  }


  public scanner = (currentRow:number,currentColumn:number) =>{

    const {visited} = this.state;
    

    const neighbours = [{row:-1,col:-1},{row:-1,col:0},{row:-1,col:1},{row:0,col:-1},{row:0,col:1},{row:1,col:-1},{row:1,col:0},{row:1,col:1}];
    visited[currentRow][currentColumn] = true;
  
    let count = 1;
    this.setState({
      visited
    });
  
    for(let i=0;i<8;i++){
      const keyrow = 'row';
      const keycol = 'col';
      if(this.checkValidity(currentRow+neighbours[i][keyrow],currentColumn+neighbours[i][keycol])){
        count = count + this.scanner(currentRow+neighbours[i][keyrow],currentColumn+neighbours[i][keycol]);
      }
    }

    return count;
  }

  public checkValidity(currentRow:number,currentColumn:number){
    const {row,column,matrix,visited} = this.state;
    if((currentRow >= 0 && currentRow < row) && (currentColumn >=0 && currentColumn < column) && ((matrix[currentRow][currentColumn] === 1) && visited[currentRow][currentColumn] === false)){
      return true;
    }else{
      return false;
    }
    
  }

  public startEngine = ()=>{

    const {row,column,visited,matrix} = this.state;
    let max = 0;
   
    for(let i=0;i<row;i++){
      for(let j=0;j<column;j++){
          if(!visited[i][j] && matrix[i][j] === 1){
            const count = this.scanner(i,j);
            max = Math.max(max,count);
          }
      }
    }

    this.setState({
      max
    })

  }

  public handleRowChange = (event:any) =>{
    const {column} = this.state;
    const value = event.target.value;
    if(value !== ""){
      const currentRow = parseInt(value,undefined);
    this.setState({
      matrix: Array(currentRow).fill(0).map(innerrow => new Array(column).fill(0)),
      row:currentRow,
      visited:Array(currentRow).fill(0).map(innerrow => new Array(column).fill(false)),  
    },()=>{
      this.generateCells();
    })
    }else{
      const row = event.target.value;
      this.setState({
        row
      })
    }
  }

  public handleColChange = (event:any) =>{
    const {row} = this.state;
    const value = event.target.value;
    if(value !== ""){
      const column = parseInt(value,undefined);
      this.setState({
        column,
        matrix: Array(row).fill(0).map(innerrow => new Array(column).fill(0)),
        visited:Array(row).fill(0).map(innerrow => new Array(column).fill(false)),  
      },()=>{
        this.generateCells();
      })
    }else{
      const col = event.target.value;
      this.setState({
        column:col
      })
    }
   
  }

  public handleOnClick = () =>{
    const {row,column} = this.state;
    this.setState({
      matrix: Array(row).fill(0).map(innerrow => new Array(column).fill(0)),
      visited:Array(row).fill(0).map(innerrow => new Array(column).fill(false)),  
    },()=>{
      this.generateCells();
    })

  }

  public render() {
    const {row,column,max} = this.state;
    return (
      <div className="container-fluid" style={{padding:15}}>
          <br/>
          <div className="text-center">
          <h5>Simple Interface for Connected Cells</h5>
          </div>
          <br/>
          <div style={{border:"dashed black 2px",padding:10}}>
          <div className="row justify-content-center">
          <form className="form-inline"> 
          Row: &nbsp;&nbsp;<input type="number" className='form-control' value={row} style={{width:"35%"}} onChange={this.handleRowChange}/> &nbsp; Column:&nbsp;&nbsp; <input type="number" value={column} style={{width:"35%"}} className='form-control' onChange={this.handleColChange}/>
          </form>
          </div>
          <br/>
          {this.renderRowLayout()}
          <br/>
          <div className="text-center">
          <h4>The largest region contains <span style={{borderBottom: "double 3px",borderBottomColor:"red",fontSize:30,fontWeight:600}}>{max}</span> cell(s)</h4>
          <br />
          <button className="btn btn-lg btn-primary" onClick={this.handleOnClick}>Regenerate New Cells</button>
          </div>

          </div>

          <div>
            <br />
              <h6>Remarks:</h6>
              <p>This site is made using create-react-app boilerplate, uses typescript as main language. </p>
              <p>Bootstrap 4 is added as main UI framework.</p>
          </div>

      </div>
    );
  }
}



export default App;
