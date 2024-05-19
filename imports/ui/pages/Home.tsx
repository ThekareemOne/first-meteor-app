import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { Table, Pagination, TextInput, Button, Spinner } from "flowbite-react";
import moment from "moment";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";

const PAGE_SIZE = 10;

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const search = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(Number(page));

  const [searchText, setSearchText] = useState(search);
  const [searchTextFinal, setSearchTextFinal] = useState(search);

  const navigate = useNavigate();

  const { data, isLoading } = useQuery(
    ["articles", currentPage, searchTextFinal],
    async () => {
      const response = await fetchArticles();
      return response;
    },
    {
      staleTime: 0,
    }
  );

  const fetchArticles = () => {
    return new Promise((resolve, reject) => {
      Meteor.call(
        "articles.getAll",
        { page: currentPage, pageSize: PAGE_SIZE, search: searchText },
        (error, result) => {
          if (error) {
            console.error("Error fetching articles:", error);
          } else {
            const { data, count } = result;
            const response = {
              articles: data,
              count: count,
              pages: Math.ceil(count / parseFloat(`${PAGE_SIZE}`)),
            };
            resolve(response);
          }
        }
      );
    });
  };

  const onPageChange = (page: number) => {
    if (data.count < PAGE_SIZE) return;
    setCurrentPage(page);
    updateQueryParams(`${page}`);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    setCurrentPage(1);
    updateQueryParams("1");
    setSearchTextFinal(searchText);
  };

  const updateQueryParams = (page: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    if (searchText) params.set("search", `${searchText}`);
    else params.delete("search");
    setSearchParams(params);
  };

  return (
    <div>
      {!isLoading ? (
        <>
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-center">
            Home
          </h1>
          <div className="max-w-sm flex mb-4 ml-4">
            <TextInput
              className="flex-1 mr-2"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
          <Table className="mx-4">
            <Table.Head>
              <Table.HeadCell>Article</Table.HeadCell>
              <Table.HeadCell>Created On</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {data.articles.map((article) => (
                <Table.Row key={article._id} className="bg-white">
                  <Table.Cell
                    className="whitespace-nowrap font-medium text-gray-900 cursor-pointer"
                    onClick={() => navigate(`/article/${article._id}`)}
                  >
                    {article.title}
                  </Table.Cell>
                  <Table.Cell>
                    {moment(article.createdOn).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <div className="flex overflow-x-auto sm:justify-center mt-3">
            <div className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">
                Total Articles Count: {data.count}
              </span>
            </div>
          </div>
          <div className="flex overflow-x-auto sm:justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={data.pages}
              onPageChange={onPageChange}
            />
          </div>
        </>
      ) : (
        <div className="text-center">
          <Spinner size="xl" />
        </div>
      )}
    </div>
  );
};

export default Home;
