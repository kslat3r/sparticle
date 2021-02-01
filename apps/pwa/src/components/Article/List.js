import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ArticleListItem from './ListItem';

const styles = theme => ({
  root: {

  }
})

const ArticleList = props => {
  const {
    classes,
    items,
    showDeleted
  } = props;

  return (
    <List
      className={classes.root}
    >
      {items.map((item, i) => (
        <ArticleListItem
          key={i}
          item={item}
          showDeleted={showDeleted}
        />
      ))}
    </List>
  )
};

ArticleList.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  showDeleted: PropTypes.bool.isRequired
};

export default withStyles(styles)(ArticleList);
