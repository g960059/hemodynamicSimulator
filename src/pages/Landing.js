import React from 'react';
import { makeStyles,createMuiTheme } from '@material-ui/core/styles';
import {Grid, Box, Typography, Icon, AppBar, Toolbar, CssBaseline, Button, Divider} from '@material-ui/core'
import gifImg from '../assets/landing_gif2.gif'
import { ThemeProvider } from '@material-ui/styles';


const theme = createMuiTheme({
  mixins: {
    toolbar: {
      minHeight: 42,
      '@media (min-width:0px) and (orientation: landscape)': {
        minHeight: 36
      },
      '@media (min-width:600px)':{
        minHeight: 48
      }
    }
  },
});
theme.shadows[1] = '0px 1px 5px 1px rgba(0,0,0,0.1)'

const useStyles= makeStyles(theme =>({
  toolbar: {
    height: `calc(${theme.mixins.toolbar.minHeight}px - 8px)`
  },
  content: {
    flexGrow: 1
  },
  mainContainer: {
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    overflowY: 'scroll',
    paddingTop: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
  },
  logoTitle: {
    flexGrow: 1,
  },
  title: {
    display: "inline-block",
    position: "relative",
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none"
  },
  icon:{
    paddingTop: "4px",
    marginBottom: "-6px",
    marginRight: "16px"
  }
}))


export default (props) => {
  const classes = useStyles()
  return (
    <ThemeProvider theme={theme}>
      <Box display='flex'>      
        <CssBaseline/>
        <AppBar position='fixed' elevation={1} color='inherit'>
          <Toolbar>
            <Typography variant="h6" className={classes.logoTitle}>CardioStory</Typography>
          </Toolbar>
        </AppBar>
        <Box className={classes.content} bgcolor ="background.paper">
          <div className={classes.toolbar}/>
          <Box className={classes.mainContainer}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={5}>
                <Box m={3}  textAlign="center">
                  <Typography variant='h2' color='primary'>CardioStory</Typography>
                </Box>
                <Box m={3} textAlign="center">
                  <Typography variant='h5' color='primary'>
                    Cardiovascular simulator
                    <br/>
                    for faster and intuitive learning.
                  </Typography>
                  <Box mt={5} width={1} display='flex'  justifyContent="center">
                    <Button variant="outlined" color="primary" href="/simulator">
                      Get Started
                    </Button>
                  </Box>
                </Box>
              </Grid>        
              <Grid item md={7}>
                <Box m={2}>
                  <img src={gifImg} alt="gif" style={{width:'100%'}}/>
                </Box>
              </Grid>
            </Grid>
            <Box px={2} mt={4}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box p={3} bgcolor ="grey.100">
                    <Box my={2}>
                      <Typography variant='h5'>
                      <Icon color="primary"  fontSize="large" className={classes.icon}> people_outlined </Icon>
                        Share Intuition
                      </Typography>
                    </Box>
                    <Box my={3}>
                      <Typography variant='body1' paragraph={true}>
                        You can prove a treatment that you feel empirically successful in daily practice and share your knowledge with others.
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box p={3} bgcolor ="grey.100">
                    <Box my={2}>
                      <Typography variant='h5'>
                      <Icon color="primary"  fontSize="large" className={classes.icon}> sort </Icon>
                        Fully Controllable
                      </Typography>
                    </Box>
                    <Box my={3}>
                      <Typography variant='body1' paragraph={true}>
                        You can set up a simulation of a patient with heart failure, valvular disease, arrhythmia.
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box p={3} bgcolor ="grey.100">
                    <Box my={2}>
                      <Typography variant='h5'>
                      <Icon color="primary"  fontSize="large" className={classes.icon}> slideshow </Icon>
                        Learn by Slides
                      </Typography>
                    </Box>
                    <Box my={3}>
                      <Typography variant='body1' paragraph={true}>
                        You can also learn with many easy-to-understand slides.
                        Slides will be added in the future.
                      </Typography>
                    </Box>
                  </Box>
                </Grid>                                                                                      
              </Grid>                 
            </Box>
          </Box>     
        </Box>    
      </Box>
    </ThemeProvider>
  )
}