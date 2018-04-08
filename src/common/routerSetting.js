


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

export const routerCofig = [
  {
    path:'/',
    exact:true,
    component:{
      loader: () => import('../containers/Power'),
      loading: getLoadingComponent
    },
  },{
    path:'/page1',
    exact:true,
    component:{
      loader: () => import('../containers/Power/UserList'),
      loading: getLoadingComponent
    },
  },{
    path:'/page2',
    exact:true,
    component:{
      loader: () => import('../containers/Power/PostList'),
      loading: getLoadingComponent
    },
  },{
    path:'/pone',
    exact:true,
    component:{
      loader: () => import('../containers/TestPages/Pone'),
      loading: getLoadingComponent
    },
  },{
    path:'/ptwo',
    exact:true,
    component:{
      loader: () => import('../containers/TestPages/Ptwo'),
      loading: getLoadingComponent
    },
  }
]




