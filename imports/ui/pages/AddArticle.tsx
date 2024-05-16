import React from "react";
import { Meteor } from "meteor/meteor";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { TextInput, Label, Button, Spinner, Textarea } from "flowbite-react";

interface FormValues {
  title: string;
  description: string;
}

const ArticleSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
});

const AddArticle = () => {
  const navigate = useNavigate();

  const createArticle = (
    values: FormValues,
    { setSubmitting, setStatus }: any
  ) => {
    const article = {
      title: values.title,
      description: values.description,
      createdOn: new Date(),
      createdById: Meteor.userId(),
    };
    Meteor.call("articles.insert", article, (error, articleId) => {
      setSubmitting(false);
      if (error) {
        setStatus(error.reason || "Error creating article");
      } else {
        navigate(`/article/${articleId}`);
      }
    });
  };

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-center">
        Add Article
      </h1>
      <Formik
        initialValues={{ title: "", description: "" }}
        validationSchema={ArticleSchema}
        onSubmit={createArticle}
      >
        {({ isSubmitting, status }) => (
          <Form className="flex max-w-md flex-col gap-4 ml-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="title" value="Title" />
              </div>
              <Field name="title">
                {({ field }) => <TextInput {...field} id="title" type="text" />}
              </Field>
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Description" />
              </div>
              <Field name="description">
                {({ field }) => (
                  <Textarea {...field} id="description" rows={4} />
                )}
              </Field>
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500"
              />
            </div>
            {status && <div className="text-red-500">{status}</div>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "Add"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddArticle;
