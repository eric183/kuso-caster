import { number, string } from "prop-types";

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
        name: 'email',
        title: 'Email',
        type: 'string',
      },
      {
        name: 'password',
        title: 'Password',
        type: 'string',
        initialValue: "123456"
      },
      {
        name: 'role',
        title: 'Role',
        type: 'string',
        initialValue: 'user',
      },
      {
        name: 'createdAt',
        title: 'Created At',
        type: 'datetime',
        initialValue: (new Date()).toISOString()
      },
      {
        name: 'updatedAt',
        title: 'Updated At',
        type: 'datetime',
        initialValue: (new Date()).toISOString()
      },
      {
        name: "avatar",
        title: "Avatar",
        type: "image",
      },
      {
        name: "emailVerified",
        title: "Email Verified",
        type: "boolean",
        initialValue: false,
      },
      {
        name: "feedIds",
        title: "Feed Ids",
        type: "array",
        of: [
          { type: "string" }
        ],
        initialValue: ['YW5jaG9yLmZtL3MvNGE0', 'ZHJpbmt3aXRobWFyaW8u', 'ZmVlZC50YW5nc3VhbnJh', 'anVzdHBvZG1lZGlhLmNv', 'b3Blbmxhbmd1YWdlLmNv', 'cmVkY2lyY2xlLmNvbS9z', 'cnNzLmxpemhpLmZtL3Jz', 'd3d3LnN0b3ZvbC5jbHVi', 'd3d3LnhpbWFsYXlhLmNv', 'dGFya29jaG9uc2t5LnR5'],
      },
      {
        name: "favoriteFeedIds",
        title: "Favorite Feed Ids",
        type: "array",
        of: [
          { type: "string" }
        ],
        initialValue: [],
      },
      {
        name: "session",
        title: "Session",
        type: "object",
        fields: [
          {
            name: "sessionToken",
            type: "string",
          },
          {
            name: "expiresAt",
            type: "datetime",
          },
        ]
      }
    ],
  }
  


