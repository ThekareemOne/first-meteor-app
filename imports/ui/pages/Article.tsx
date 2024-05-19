import { Meteor } from "meteor/meteor";
import { Card, TextInput, Button, Alert } from "flowbite-react";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Comments } from "/imports/api/comments";

export default function Article() {
  const [article, setArticle] = useState({});
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const userId = Meteor.userId();

  useEffect(() => {
    Meteor.call("articles.getById", id, (error, result) => {
      if (error) {
        console.error("Error fetching article:", error);
      } else {
        console.log(result);
        setArticle(result);
      }
    });
  }, [id]);

  const comments = useTracker(() => {
    Meteor.subscribe("comments", id);
    const comments = Comments.find(
      { articleId: id },
      { sort: { createdOn: 1 } }
    ).fetch();
    return comments;
  });

  const addComment = () => {
    if (comment.trim() !== "") {
      Meteor.call(
        "comments.insert",
        { text: comment, articleId: id, createdById: userId },
        (error) => {
          if (error) {
            console.error("Error creating comment:", error);
          } else {
            setComment("");
          }
        }
      );
    }
  };

  const removeComment = (commentId) => {
    Meteor.call("comments.delete", commentId, (error) => {
      if (error) {
        console.error("Error creating comment:", error);
      } else {
        setComment("");
      }
    });
  };

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-center">
        Article Details
      </h1>
      <Card className="mb-3 mx-4">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900">
          {article.title}
          <p className="font-normal text-sm text-gray-500">
            Date: {moment(article.createdOn).format("MMMM Do YYYY, h:mm:ss a")}
          </p>
          <p className="font-normal text-sm text-gray-500">
            Author: {article.user?.profile.name}
          </p>
        </h5>
        <p className="font-normal text-gray-700">{article.description}</p>
        {userId && (
          <div className="max-w-sm flex">
            <TextInput
              className="flex-1 mr-2"
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={addComment}>Add</Button>
          </div>
        )}
        {comments &&
          comments.map((comment) => (
            <Alert
              key={comment._id}
              className="max-w-sm mt-2"
              color="success"
              onDismiss={() => removeComment(comment._id)}
            >
              {comment.text}
            </Alert>
          ))}
      </Card>
    </div>
  );
}
