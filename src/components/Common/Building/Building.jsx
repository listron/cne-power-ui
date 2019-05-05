import React from "react";
import PropTypes from "prop-types";
import styles from './building.scss';
 import Footer from '../Footer';

class Building extends React.Component{
    constructor(props,context){
        super(props,context)
    }
    render(){
        return(
            <div className={styles.buildingContainer}>
            <div className={styles.building}>
             </div>             
               <Footer />
            </div>
        )
    }
}
export default (Building)