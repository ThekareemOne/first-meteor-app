import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Articles = new Mongo.Collection("articles");

Articles.schema = new SimpleSchema({
  title: { type: String },
  description: { type: String },
  createdOn: { type: Date, autoValue: () => new Date() },
  modifiedOn: { type: Date, autoValue: () => new Date(), optional: true },
  createdById: { type: String },
});

Articles.attachSchema(Articles.schema);
