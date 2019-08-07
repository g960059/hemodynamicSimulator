// import React,{useContext} from 'react';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
// import Slider from '@material-ui/core/Slider'

// import AppContext from '../contexts/AppContexts'

// import Typography from '@material-ui/core/Typography'


// export default (props) => {
//   const context = useContext(ModelPropertyContext);
//   const handleChange = (name) => (e,v) =>{
//     context.setCVProps(
//       {
//         ...context.CVProps,
//         [name]: v
//       }
//     )
//   }
//   return (
//     <List>
//       {[1,2,3].map(x => 
//         <ListItem key={x}>
//           <ListItemText>Item{x}</ListItemText>
//         </ListItem>
//       )}
//       <ListItem>
//         <Typography gutterBottom>
//           LV_Ees
//         </Typography>
//         <Slider value = {context.CVProps.LV_Ees} onChangeCommitted={handleChange('LV_Ees')} min={0.2} max={10} step={0.1} valueLabelDisplay="auto"></Slider>
//       </ListItem>
//       <ListItem>
//         <Typography gutterBottom>
//           LV_alpha
//         </Typography>
//         <Slider value = {context.CVProps.LV_alpha} onChangeCommitted={handleChange('LV_alpha')} min={0.01} max={0.05} step={0.01} valueLabelDisplay="auto"></Slider>
//       </ListItem>      
//       <ListItem>
//         <Typography gutterBottom>
//           Ras
//         </Typography>
//         <Slider value = {context.CVProps.Ras} onChangeCommitted={handleChange('Ras')} min={100} max={2000} step={10} valueLabelDisplay="auto"></Slider>
//       </ListItem>
//     </List>
//   )
// }

// const Test = ()=>{
  
//   return <div>{context.CVProps.LV_Ees}</div>
// }