export default {
  name: 'feed',
  title: 'Feed',
  type: 'document',
  fields: [
    {
      name: "copyright",
      title: "Copyright",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "string",
    },
    {
      name: "feedUrl",
      title: "Feed URL",
      type: "url",
    },
    {
      name: "items",
      title: 'Items',
      type: 'array',
      of: [
        {
          title: 'Item',
          type: 'item',
        },
      ],
    },
    {
      name: "language",
      title: "Language",
      type: "string",
    },
    {
      name: "link",
      title: "Link",
      type: "url",
    },
    {
      name: "itunes",
      title: "iTunes",
      type: "string",
    },
    {
      name: "paginationLinks",
      title: "Pagination Links",
      type: "paginationLink",
    },
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "image",
      title: "Image",
      type: "string",
    },
  ],
}
