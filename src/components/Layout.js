import React, {useState, Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden'

const drawerWidth = 240
const useStyles= makeStyles(theme =>({
  toolbar: {
    height: `calc(${theme.mixins.toolbar.minHeight}px)`
  },
  drawer:{
    width: drawerWidth,
    flexShrink: 0
  },
  // drawerHeader: {
  //   ...theme.mixins.toolbar,
  //   display: 'flex',
  //   justifyContent: 'flex-end',
  //   alignItems: 'center',
  //   padding: theme.spacing(0, 3)
  // },
  elevation: 2,
  drawerPaper: {
    width: drawerWidth
  },
  appBar:{
    // transition: theme.transitions.create()
  },
  // appBarShift: {
  //   marginLeft: drawerWidth,
  //   width: `calc(100% - ${drawerWidth}px)`,
  // },
  // drawerPaperClose: {
  //   overflow: 'hidden',
  //   width: theme.spacing(7)
  // },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    // transition: theme.transitions.create()
  },
  // contentShift: {
  //   marginLeft: drawerWidth,
  //   width: `calc(100% - ${drawerWidth}px)`
  // }
}))

export default React.memo((props) => {
  const classes = useStyles();
  // const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <Box display='flex'>
      <CssBaseline/>
      <AppBar position='fixed' color='white' elevation={1}>
        <Toolbar>
          <Typography variant="h6">{props.title}</Typography>
        </Toolbar>
      </AppBar>
      {/* <Drawer variant='permanent' className={classes.drawer} classes={{paper:classes.drawerPaper}}>
        <div className={classes.toolbar}/>
        {props.drawer}
      </Drawer> */}
      <Box className={classes.content} bgcolor="background.default">
        <div className={classes.toolbar}/>
        {props.children}
      </Box>
    </Box>
  )
})
