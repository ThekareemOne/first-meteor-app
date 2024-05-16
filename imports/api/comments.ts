import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import { Articles } from "./articles";
import { Meteor } from "meteor/meteor";

export const Comments = new Mongo.Collection("comments");

Comments.schema = new SimpleSchema({
  text: { type: String },
  articleId: { type: String },
  createdOn: { type: Date, autoValue: () => new Date() },
  createdById: { type: String },
});

Comments.attachSchema(Comments.schema);

Comments.addLinks({
  // TODO: Fix [Error]: For the link article you did not provide a collection.
  // article: {
  //   type: "one",
  //   collection: Articles,
  //   field: "articleId",
  // },
  user: {
    type: "one",
    collection: Meteor.users,
    field: "createdById",
  },
});
