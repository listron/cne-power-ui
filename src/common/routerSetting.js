import Loadable from 'react-loadable';
import React from 'react'

const getLoadingComponent = ({ isLoading, error }) => {
  // Handle the loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }
  // Handle the error state
  else if (error) {
    console.log(error)
    return <div>Sorry, there was a problem loading the page.</div>;
  }
  else {
    return null;
  }
};

export const routerConfig = [
  {
    path:'/login',
    exact:true,
    component:{
      loader: () => import('../containers/Login'),
      loading: getLoadingComponent
    }
  },
  {
    path:'/forget',
    exact:true,
    component:{
      loader: () => import('../containers/Forget'),
      loading: getLoadingComponent
    }
  },
  {
    path:'/signup',
    exact:true,
    component:{
      loader: () => import('../containers/Signup'),
      loading: getLoadingComponent
    }
  },
  {
    path:'/',
    exact:true,
    component:{
      loader: () => import('../containers/Power'),
      loading: getLoadingComponent
    },
  },
  {
    path:'/page1',
    exact:true,
    component:{
      loader: () => import('../containers/Power/UserList'),
    }
  },{
      path:'/page2',
      exact:true,
      loader: () => import('../containers/Power/PostList'),
    },{
      path:'/pone',
      exact:true,
      loader: () => import('../containers/TestPages/Pone'),
    },{
      path:'/ptwo',
      exact:true,
      loader: () => import('../containers/TestPages/Ptwo')
    }
  ]
  export const routerConfig = routers.map(e=>{
    return {
      path:e.path,
      exact:e.exact,
      component:{
        loader: e.loader,
        loading: getLoadingComponent
      },
    }
  })







