import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import { Meteor } from "meteor/meteor";
import { Comments } from "./comments";

export const Articles = new Mongo.Collection("articles");

Articles.schema = new SimpleSchema({
  title: { type: String },
  description: { type: String },
  createdOn: { type: Date, autoValue: () => new Date() },
  modifiedOn: { type: Date, autoValue: () => new Date(), optional: true },
  createdById: { type: String },
});

Articles.attachSchema(Articles.schema);

Articles.addLinks({
  user: {
    type: "one",
    collection: Meteor.users,
    field: "createdById",
  },
  // comments: {
  //   collection: Comments,
  //   inversedBy: "article",
  //   type: "many",
  // },
});

// TODO: Add after fixing the broken link between article and comments
// Articles.addReducers({
//   commentCount: {
//     body: {
//       comments: { _id: 1 },
//     },
//     reduce(article) {
//       const commentCount = article.comments.count();
//       return commentCount;
//     },
//     collection: Comments,
//   },
// });
