import { Meteor } from "meteor/meteor";
import { Comments } from "../api/comments";
import { check } from "meteor/check";

Meteor.publish("comments", function (articleId) {
  check(articleId, String);

  const comments = Comments.find({ articleId });
  const commentsObjects = comments.fetch();

  const usersInComments = commentsObjects.map((comment) => comment.createdById);
  const users = Meteor.users.find(
    { _id: { $in: usersInComments } },
    { fields: { profile: 1 } }
  );

  return [comments, users];
});
