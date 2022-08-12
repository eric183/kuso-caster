import createSchema from 'part:@sanity/base/schema-creator';

import schemaTypes from 'all:part:@sanity/base/schema-type';

import feed from './feed';
import user from './user';
import pagenationLink from './paginationLink';
import enclosure from './enclosure';
import playInfo from './playInfo';
// import item from './item';

export default createSchema({
  name: 'default',
 
  types: schemaTypes.concat([
    feed,
    user,
    pagenationLink,
    // item,
    playInfo,
    enclosure,
  ]),
})
