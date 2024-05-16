import React from "react";
import { Accounts } from "meteor/accounts-base";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { TextInput, Label, Button, Spinner } from "flowbite-react";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (
    values: FormValues,
    { setSubmitting, setStatus }: any
  ) => {
    Accounts.createUser(
      {
        email: values.email,
        password: values.password,
        profile: {
          name: values.name,
        },
      },
      (error) => {
        setSubmitting(false);
        if (error) {
          setStatus(error.reason || "Registration failed");
        } else {
          navigate("/");
        }
      }
    );
  };

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-center">
        Register
      </h1>
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
      >
        {({ isSubmitting, status }) => (
          <Form className="flex max-w-md flex-col gap-4 ml-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Name" />
              </div>
              <Field name="name">
                {({ field }) => <TextInput {...field} type="text" id="name" />}
              </Field>
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <Field name="email">
                {({ field }) => (
                  <TextInput {...field} type="email" id="email" />
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
              {isSubmitting ? <Spinner /> : "Register"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
