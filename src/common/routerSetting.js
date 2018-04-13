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

const routers = [
  {
    path:'/404',
    exact:true,
    loader: () => import('../containers/Exception/404.js')
  },
  {
    path:'/login',
    exact:true,
    loader: () => import('../containers/Login')
  }, {
    path:'/forget',
    exact:true,
    loader: () => import('../containers/Forget')
  }, {
    path:'/signup',
    exact:true,
    loader: () => import('../containers/Signup')
  }, {
    path:'/',
    exact:true,
    loader: () => import('../containers/Power')
  }, {
    path:'/page1',
    exact:true,
    loader: () => import('../containers/Power/UserList'),
  }, {
    path:'/page2',
    exact:true,
    loader: () => import('../containers/Power/PostList'),
  }, {
    path:'/pone',
    exact:true,
    loader: () => import('../containers/TestPages/Pone'),
  }, {
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
});






