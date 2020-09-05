import React from 'react';
import { withRouter } from 'react-router-dom';
import { Menu, MenuItem } from '@progress/kendo-react-layout';

const flatten = (rts) => {
  return (rts || []).map(item =>  item.items ?  [].concat.apply([],flatten(item.items)) :  item)  
}

const subcomponents = (itm, index) => {
   return itm.map((subitm, i) => {
      return <MenuItem key={`${index}.${i}`} text={subitm.text} data={{route: subitm.path}} />
    })
}

const menuitems = (items) => flatten(items).map((itm, i) => {
  if(!Array.isArray(itm)){
    return <MenuItem key={i} text={itm.text} data={{route: itm.path}} />
  }
  if(Array.isArray(itm)){
     return subcomponents(itm, i).filter(item => item != undefined)
  }
});

class MenuWrapper extends React.Component {

  render(){
    
    return (
      <div className='site-container'>
            
        <div className='navbar'>
            
          <Menu
            items={this.props.data || []}
            /*horizontal={this.props.isMediumPlus}*/
            style={{ display: 'inline-block' }}
            onSelect={(e) => this.props.history.push(e.item.path)}
          >
           
            {menuitems(this.props.data)}
            
          </Menu>
        </div>
        <div style={{ padding: 5 }}>{this.props.children}</div>
      </div>
    ); 
  }
}

export default withRouter(MenuWrapper);