import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ArticleListItem from './ArticleListItem';

const styles = theme => ({
  root: {

  }
})

const ArticleList = props => {
  const {
    // classes,
    items
  } = props;

  return (
    <List>
      {items.map((item, i) => (
        <ArticleListItem
          key={i}
          item={item}
        />
      ))}
    </List>
  )
};

ArticleList.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired
};

export default withStyles(styles)(ArticleList);
