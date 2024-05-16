import { Meteor } from "meteor/meteor";
import { Comments } from "../api/comments";

Meteor.publish("comments", function (articleId) {
  return Comments.find({ articleId }, { sort: { createdOn: 1 } });
});
