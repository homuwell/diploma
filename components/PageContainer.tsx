import React from 'react';
import classes from './PageContainer.module.css'

const PageContainer : React.FC = ({children} :any) => {
    return (
        <div className={classes.container}>
            {children}
        </div>
    );
}

export default PageContainer;