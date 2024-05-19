import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Comments = new Mongo.Collection("comments");

Comments.schema = new SimpleSchema({
  text: { type: String },
  articleId: { type: String },
  createdOn: { type: Date, autoValue: () => new Date() },
  createdById: { type: String },
});

Comments.attachSchema(Comments.schema);
