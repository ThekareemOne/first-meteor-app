import { Meteor } from "meteor/meteor";
import { Articles } from "../api/articles";
import { Comments } from "../api/comments";

Articles.addLinks({
  user: {
    type: "one",
    collection: Meteor.users,
    field: "createdById",
  },
  comments: {
    collection: Comments,
    inversedBy: "article",
    type: "many",
  },
});

Comments.addLinks({
  article: {
    type: "one",
    collection: Articles,
    field: "articleId",
  },
  user: {
    type: "one",
    collection: Meteor.users,
    field: "createdById",
  },
});

Articles.addReducers({
  commentCount: {
    body: {
      comments: { _id: 1 },
    },
    reduce(article) {
      const commentCount = article.comments?.length || 0;
      return commentCount;
    },
  },
});
