import { Meteor } from "meteor/meteor";
import { Articles } from "../api/articles";
import { Comments } from "../api/comments";
import { check, Match } from "meteor/check";

Meteor.methods({
  "articles.insert"(article) {
    if (!Meteor.userId()) {
      throw new Meteor.Error(
        "not-authorized",
        "You must be logged in to insert an article."
      );
    }

    return Articles.insert(article);
  },
  "articles.update"(article) {
    check(article, Object);

    const { _id, title, description, modifiedOn } = article;

    Articles.update(
      { _id },
      {
        $set: {
          title,
          description,
          modifiedOn,
        },
      }
    );

    return _id;
  },
  "articles.getAll"({ page, search }) {
    check(page, Number);
    check(search, Match.Maybe(String));

    const baseQuery = {};
    if (search) {
      const searchRegex = new RegExp(search, "i");
      baseQuery.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ];
    }

    const query = Articles.createQuery({
      $filters: baseQuery,
      $options: {
        fields: { title: 1, createdOn: 1, createdById: 1 },
        sort: { createdOn: -1 },
        limit: 10,
        skip: (page - 1) * 10,
      },
    });

    const data = query.fetch();

    const countData = Articles.createQuery({ $filters: baseQuery }).fetch();
    const count = countData.length;

    return { data, count };
  },
  "articles.getMine"() {
    return Articles.createQuery({
      $filters: { createdById: Meteor.userId() },
      $options: {
        sort: { createdOn: -1 },
        fields: { title: 1, createdOn: 1, createdById: 1 },
      },
    }).fetch();
  },
  "articles.getById"(articleId) {
    check(articleId, String);

    const query = Articles.createQuery({
      $filters: { _id: articleId },
      $options: {
        fields: {
          title: 1,
          description: 1,
          createdOn: 1,
          createdById: 1,
          user: 1,
        },
      },
    });

    const article = query.fetchOne();

    // console.log(article.user);
    // returns undefined

    if (article) {
      const user = Meteor.users.findOne(article.createdById);

      if (user) {
        article.createdByName = user.profile.name;
      }
    }

    return article;
  },

  "comments.insert"(article) {
    if (!Meteor.userId()) {
      throw new Meteor.Error(
        "not-authorized",
        "You must be logged in to insert an article."
      );
    }

    return Comments.insert(article);
  },
  "comments.delete"(commentId) {
    check(commentId, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error(
        "not-authorized",
        "You must be logged in to insert an article."
      );
    }

    const comment = Comments.findOne(commentId);

    if (!comment) {
      throw new Meteor.Error("comment-not-found", "Comment not found.");
    }

    if (comment.createdById !== Meteor.userId()) {
      throw new Meteor.Error(
        "not-authorized",
        "You are not authorized to delete this comment."
      );
    }

    Comments.remove(comment);
  },
});
