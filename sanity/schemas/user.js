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
        of: [{type: "string"}],
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
  


