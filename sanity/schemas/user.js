export default {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
      },
     {
        name: 'subLinks',
        title: 'SubLinks',
        type: 'array',
        of: [{type: 'url'}],
        options: {
          layout: 'subLinks'
        }
     }
    ],
  
    // preview: {
    //   select: {
    //     title: 'title',
    //     author: 'author.name',
    //     media: 'mainImage',
    //   },
    //   prepare(selection) {
    //     const {author} = selection
    //     return Object.assign({}, selection, {
    //       subtitle: author && `by ${author}`,
    //     })
    //   },
    // },
  }
  