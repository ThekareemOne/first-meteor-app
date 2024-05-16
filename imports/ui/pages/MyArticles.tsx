import { Meteor } from "meteor/meteor";
import { Table } from "flowbite-react";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export default function MyArticles() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Meteor.call("articles.getMine", (error, result) => {
      if (error) {
        console.error("Error fetching articles:", error);
      } else {
        setArticles(result);
      }
    });
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-center">
        My Articles
      </h1>
      <Table className="mx-4">
        <Table.Head>
          <Table.HeadCell>Article</Table.HeadCell>
          <Table.HeadCell>Created On</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {articles.map((article) => (
            <Table.Row key={article._id} className="bg-white">
              <Table.Cell
                className="whitespace-nowrap font-medium text-gray-900 cursor-pointer"
                onClick={() => navigate(`/article/${article._id}`)}
              >
                {article.title}
              </Table.Cell>
              <Table.Cell>
                {moment(article.createdOn).format("MMMM Do YYYY, h:mm:ss a")}
              </Table.Cell>
              <Table.Cell>
                <Link
                  className="font-medium text-cyan-600 hover:underline"
                  to={`/article/${article._id}/edit`}
                >
                  Edit
                </Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
