import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { TextInput, Label, Button, Spinner, Textarea } from "flowbite-react";

interface FormValues {
  title: string;
  description: string;
}

const ArticleSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
});

const EditArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState<FormValues>({
    title: "",
    description: "",
  });

  useEffect(() => {
    Meteor.call("articles.getById", id, (error, article) => {
      if (!error && article) {
        setInitialValues({
          title: article.title,
          description: article.description,
        });
      }
    });
  }, [id]);

  const updateArticle = (
    values: FormValues,
    { setSubmitting, setStatus }: any
  ) => {
    const article = {
      _id: id,
      title: values.title,
      description: values.description,
      modifiedOn: new Date(),
    };
    Meteor.call("articles.update", article, (error, articleId) => {
      setSubmitting(false);
      if (error) {
        setStatus(error.reason || "Error updating article");
      } else {
        navigate(`/article/${articleId}`);
      }
    });
  };

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-center">
        Edit Article
      </h1>
      {initialValues.title ? (
        <Formik
          initialValues={initialValues}
          validationSchema={ArticleSchema}
          onSubmit={updateArticle}
        >
          {({ isSubmitting, status }) => (
            <Form className="flex max-w-md flex-col gap-4 ml-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="title" value="Title" />
                </div>
                <Field name="title" value={initialValues.title}>
                  {({ field }) => {
                    return <TextInput {...field} id="title" type="text" />;
                  }}
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
                    <Textarea
                      {...field}
                      id="description"
                      rows={4}
                      defaultValue={initialValues.description}
                    />
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
                {isSubmitting ? <Spinner /> : "Edit"}
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="text-center">
          <Spinner size="xl" />
        </div>
      )}
    </div>
  );
};

export default EditArticle;
