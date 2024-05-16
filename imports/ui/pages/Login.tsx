import React from "react";
import { Meteor } from "meteor/meteor";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { TextInput, Label, Button, Spinner } from "flowbite-react";

interface FormValues {
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (
    values: FormValues,
    { setSubmitting, setStatus }: any
  ) => {
    Meteor.loginWithPassword(values.email, values.password, (error) => {
      setSubmitting(false);
      if (error) {
        setStatus(error.reason || "Login failed");
      } else {
        navigate("/");
      }
    });
  };

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-center">
        Login
      </h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting, status }) => (
          <Form className="flex max-w-md flex-col gap-4 ml-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <Field name="email">
                {({ field }) => (
                  <TextInput {...field} id="email" type="email" />
                )}
              </Field>
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <Field name="password">
                {({ field }) => (
                  <TextInput {...field} id="password" type="password" />
                )}
              </Field>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500"
              />
            </div>
            {status && <div className="text-red-500">{status}</div>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "Login"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
